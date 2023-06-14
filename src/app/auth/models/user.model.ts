import { Timestamp } from "@angular/fire/firestore";

interface UserRoles {
	subscriber: boolean;
	editor: boolean;
	admin: boolean;
}

export interface User {
	id?: string;
  name?: string;
  email?: string;
  disabled?: boolean;
  roles?: UserRoles;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}