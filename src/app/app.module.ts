import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { getAnalytics, provideAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ImgixAngularModule } from '@imgix/angular';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';

@NgModule({
  declarations: [
		AppComponent,
		FooterComponent,
		NavbarComponent,
  ],
  imports: [
		BrowserModule,
		BrowserAnimationsModule,

		AppRoutingModule,
		
		// Firebase
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAnalytics(() => getAnalytics()),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideFunctions(() => getFunctions(undefined, 'europe-west2')),
		provideStorage(() => getStorage()),
		
		// Dependencies
		ImgixAngularModule.forRoot({
      domain: 'lungabros.imgix.net',
      defaultImgixParams: {
        auto: 'format,compress',
      },
    }),
  ],
  providers: [
		ScreenTrackingService,
		UserTrackingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
