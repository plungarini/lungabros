import { Timestamp } from "@angular/fire/firestore";

interface CourseTime {
  time: string;
  unit: 'hours' | 'days' | 'minutes';
}

type DraftDetails = {
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Course {
  id: string;
  hide: boolean;
  title: string;
  bgImg: string;
  price?: number;
  shortDesc: string;
  category: string[];
  desc: string;
  howToCert: string;
  howToLearn: {
    eLearning: string;
    inPerson: string;
  };
  specs: {
    specs: {
      time: CourseTime;
      elearningTime: CourseTime;
      dives?: number;
      depth?: number;
      age?: number;
      pre: string;
    },
    foryou: string[];
    learnto: string[];
  };
  courseAdvice?: string[];
  suggestedCourse?: string[];
  gallery: string[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  draft?: DraftDetails;
}