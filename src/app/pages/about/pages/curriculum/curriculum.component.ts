import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { jsPDF } from 'jspdf';
import { map, of, Subscription, switchMap, take } from 'rxjs';
import { FirebaseExtendedService } from 'src/app/shared/services/firebase-extended.service';
import { PageLoaderService } from 'src/app/shared/services/page-loader.service';
import { PersonalMetaTagsService } from 'src/app/shared/services/personal-meta-tags.service';
import { PdfComponent } from './components/pdf/pdf.component';
import { Certification, Curriculum } from './models/curriculum.model';

@Component({
  templateUrl: './curriculum.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurriculumComponent implements OnInit, OnDestroy {
  @ViewChild("pdfContainer", { read: ViewContainerRef }) container: ViewContainerRef | undefined;

  MARGIN_TOP = 5;
  MARGIN_BOTTOM = 20;

  curriculum: Curriculum | undefined;

  cvSub: Subscription | undefined;
  downloadState: 'off' | 'downloading' | 'completed' = 'off';

  constructor(
    private db: FirebaseExtendedService,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
		private pageLoader: PageLoaderService,
		private meta: PersonalMetaTagsService,
  ) { }

	ngOnInit(): void {
		this.pageLoader.show(false);
    const id = this.route.snapshot.data['id'];
    this.cvSub = this.db.getDoc<Curriculum>(`cv/${id}`)
			.pipe(
				take(1),
        switchMap(cv => {
          if (!cv) return of(undefined);
          return this.db.getCol<Certification>(`cv/${id}/certs`)
						.pipe(
							take(1),
              map(certs => {
                const normCerts: Curriculum['certs'] = certs.sort((a, b) => (a.isPro ? a?.priority || 40 : 50) - (b.isPro ? b?.priority || 40 : 50));
                let normCv: Curriculum = {
                  ...cv,
                  stories: cv?.stories.map(s => ({
                    ...s,
                    time: s.time ? s.time : Timestamp.fromDate(new Date())
                  })),
                };
                normCv = {...normCv, desc: normCv.desc.replace('{age}', this.normAge(normCv.birthday.toDate()) + '')};
								const res: Curriculum = { ...normCv, certs: normCerts };
								this.meta.update({
									title: `About Us - ${res.name}`,
									description: res.desc,
								})
                return res;
							}),
            );
        }),
      ).subscribe(dbCurriculum => {
        this.curriculum = dbCurriculum;
        this.curriculum?.stories.push({
          title: 'La storia continua...',
          desc: 'Questo è solo l\'inizio di ciò che vogliamo creare e speriamo davvero che tu ne possa fare parte assieme a noi :)',
          isWorkingExperience: false,
          time: Timestamp.fromDate(new Date()),
        })
        this.cdRef.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.cvSub?.unsubscribe();
  }

  normAge(bDay: Date): number {
    const myMonth = bDay.getMonth() + 1;
    const myDay = bDay.getDate();
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const day = new Date().getDate();
    const res = year - bDay.getFullYear();
    return (month < myMonth) ? res - 1 : (month === myMonth) ? day < myDay ? res - 1 : res : res;
  }

  generatePdf() {
    if (!this.container) return;
    const doc = new jsPDF('p', 'px', 'a4', true);
    this.downloadState = 'downloading';
    const pdfContentRef = this.container.createComponent(PdfComponent);
    const pdfContent = pdfContentRef.instance;
    pdfContent.visible = false;
    pdfContent.setCurriculum = this.curriculum;    
    
    const sub = pdfContent.loaded.pipe(take(1)).subscribe(() => {
      const cvEl = pdfContent.cvElement?.nativeElement;
      const setFamily = (element: HTMLElement) => {
        const len = element.children.length || 0;
        if (len <= 0) return;
        for (let i = 0; i < len; i++) {
          const e = element.children.item(i) as HTMLElement | null
          if (e) {
            if (['h1', 'h2', 'h3'].indexOf(e.nodeName.toLowerCase()) !== -1) {
              if (e.nodeName.toLowerCase() === 'h1') e.style.fontFamily = '"Times", sans-serif';
              return;
            };
            e.style.fontFamily = '"helvetica", sans-serif';
            setFamily(e);
          };
        }
      };
      if (cvEl) setFamily(cvEl);
      if (!cvEl) {
        this.container?.remove();
        sub.unsubscribe();
        return console.error('CV is undefined');
      };
      doc.html(cvEl.outerHTML, {
        html2canvas: {
          scale: 0.3434,
          svgRendering: true,
          letterRendering: true,
        },
        margin: [this.MARGIN_TOP, 0, this.MARGIN_BOTTOM, 0],
        width: 1300,
        windowWidth: 1300,
        autoPaging: 'text',
        callback: (doc) => {
          doc.setLanguage('it');
          const addFooter = () => {
            const pageCount = doc.getNumberOfPages();
            for (var i = 1; i <= pageCount; i++) {
              doc.setPage(i);
              const text = `Pagina ${i} di ${pageCount} - Curriculum ${this.curriculum?.name} - © ${new Date().getFullYear()} LUNGABROS`;
              const xOffset = ((doc.internal.pageSize.width) - (doc.getStringUnitWidth(text))) - 10;
              doc.setFontSize(5);
              doc.text(text, xOffset, doc.internal.pageSize.height - (this.MARGIN_BOTTOM / 2), {
                align: 'right',
              });
            }
          };
          addFooter();
          this.downloadState = 'completed';
          this.cdRef.detectChanges();
          doc.save(`Curriculum - ${this.curriculum?.name}`);
          setTimeout(() => {
            this.downloadState = 'off';
            this.cdRef.detectChanges();
          }, 3000);
          sub.unsubscribe();
          this.container?.remove();
        },
      });
      sub.unsubscribe();
    });

    this.cdRef.detectChanges();
  }

}
