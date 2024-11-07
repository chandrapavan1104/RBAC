import { Component, OnInit } from '@angular/core';
import { PermissionService } from '../services/permission.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-permission-management',
  templateUrl: './permission-management.component.html',
  styleUrls: ['./permission-management.component.css'],
  providers: [PermissionService],
  imports: [FormsModule, CommonModule]
})
export class PermissionManagementComponent implements OnInit {
  viewMode: string = 'existing'; // Tracks whether to show existing permissions or new permission form

  // Other existing properties
  permissions: any[] = []; // Stores existing permissions
  levels = ['App', 'Module', 'Feature', 'Object', 'Record', 'Field'];
  selectedLevel = '';
  itemsInLevel: any[] = [];
  selectedPermission: any = null;
  selectedItemId: number | null = null;

  newPermission = {
    canRead: false,
    canWrite: false,
    canEdit: false,
    canDelete: false,
    inheritance: true,
    name: '',
    description: ''
  };

  constructor(private permissionService: PermissionService) {}

  ngOnInit(): void {
    this.fetchPermissions();
  }

  // Toggle view to show existing permissions
  showExistingPermissions(): void {
    this.viewMode = 'existing';
    this.selectedPermission = null;
    this.fetchPermissions();
  }

  // Toggle view to create a new permission
  showNewPermissionForm(): void {
    this.viewMode = 'new';
    this.resetForm();
  }

  // Fetches existing permissions from the backend
  fetchPermissions(): void {
    this.permissionService.getAllPermissions().subscribe(data => {
      this.permissions = data;
      //console.log(this.permissions);
    });
  }
  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const searchValue = target.value;
    this.loadItemsForLevel(1, searchValue);
  }

  // Select a level and load items for it
  selectLevel(level: string): void {
    this.selectedLevel = level;
    this.selectedItemId = null;
    this.loadItemsForLevel(1,'');
  }
  
  selectItem(itemId: number): void {
    this.selectedItemId = itemId;
  }
  

  // Step 2: Load Items for Selected Level with Pagination/Search
  loadItemsForLevel(page: number = 1, searchQuery: string = ''): void {
    this.permissionService.getItemsInLevel(this.selectedLevel, page, searchQuery).subscribe(data => {
      this.itemsInLevel = data.items;
      // You can add pagination information from `data.pagination`
    });
  }

  // Step 3: Check for Duplicate and Create Permission
  checkAndSetPermission(): void {
    const requestData = {
      ...this.newPermission,
      level: this.selectedLevel,
      levelId: this.selectedItemId,
    };
    //console.log(requestData);

    this.permissionService.checkDuplicatePermission(requestData).subscribe(response => {
      if (response.exists) {
        alert(`A similar permission already exists: ${response.body}`);
      } else {
        alert('Permission created successfully!');
        this.resetForm();
      }
    });
  }

  // Select a permission for editing
  editPermission(permission: any): void {
    this.viewMode = 'edit';
    this.selectedPermission = { ...permission }; 
  }
  // Update the selected permission
  updatePermission(): void {
    this.permissionService.updatePermission(this.selectedPermission).subscribe( response => {
      if (response.exists) {
        alert(`A similar permission already exists: ${response.body}`);
      } else {
        alert('Permission created successfully!');
        this.resetForm();
      }
        this.showExistingPermissions();
        this.fetchPermissions();
      }
    );
  }

  deletePermission(permissionId: number): void {
    if (confirm('Are you sure you want to delete this permission?')) {
      this.permissionService.deletePermission(permissionId).subscribe(() => {
        this.fetchPermissions();
        alert('Permission deleted successfully');
      });
    }
  }

  // Reset the form
  resetForm(): void {
    this.selectedLevel = '';
    this.selectedItemId = null;
    this.newPermission = {
      canRead: false,
      canWrite: false,
      canEdit: false,
      canDelete: false,
      inheritance: true,
      name: '',
      description: ''
    };
    this.selectedPermission = null;
  }

}