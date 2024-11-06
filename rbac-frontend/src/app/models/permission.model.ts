// src/app/models/permission.model.ts

export interface Permission {
    id: number;
    name: string;
    level: string;         // App, Module, Feature, etc.
    levelId: number;       // ID of the specific level (e.g., ID of the feature or module)
    canRead: boolean;      // Read access
    canWrite: boolean;     // Write access
    canEdit: boolean;      // Edit access
    canDelete: boolean;    // Delete access
    selected?: boolean;    // Optional, used for checkboxes when assigning permissions
  }
  