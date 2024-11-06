export interface Role {
    id: number;
    name: string;
    description?: string;
  }
  
  export interface User {
    id: number;
    username: string;
    email: string;
    roles?: Role[];
    roleNames?: string; // Optional precomputed property for display
    password?: string; // Add this if used for adding/updating users only
  }
  