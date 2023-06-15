import { Timestamp } from '@angular/fire/firestore';

export type Story = {
  title: string;
  desc: string;
  time?: Timestamp;
  isWorkingExperience: boolean;
}

export type CvLanguage = {
  flag: 'it' | 'en' | 'fr' | 'de';
  name: string;
  level: number;
}

export type Specs = {
  passions: string[];
  lang: CvLanguage[];
  memberId: number;
  socials: CvSocial[];
}

export type Certification = {
  id: string;
  title: string;
  priority?: number;
  isPro: boolean;
  hide?: boolean;
}

type Contacts = {
  email: string;
  phone: string;
}

export type CvSocial = {
  id: 'ig' | 'fb' | 'in' | 'tw';
  username: string;
}

type DraftDetails = {
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export type Curriculum = {
  name: string;
  birthday: Timestamp;
  desc: string;
  stories: Story[];
  specs: Specs;
  certs: Certification[];
  contacts: Contacts;
  draft?: DraftDetails;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

type FormSpecs = {
  passions: string[];
  memberId: number;
}

export type FormCurriculum = {
  name: string;
  birthday: string;
  desc: string;
  contacts: Contacts;
  specs: FormSpecs;
  draft?: DraftDetails;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
