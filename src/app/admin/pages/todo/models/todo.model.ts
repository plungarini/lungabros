import { Timestamp } from '@angular/fire/firestore';

export type TodoTask = {
  id: string;
  priority: 1 | 2 | 3;
  value: string;
  completed: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  readBy: string[];
};
