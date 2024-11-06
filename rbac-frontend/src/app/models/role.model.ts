// src/app/models/role.model.ts

import { Permission } from './permission.model';

export interface Role {
  id: number;
  name: string;
  description: string;
  permissions?: Permission[]; // Optional, used when displaying/editing a role's permissions
}
