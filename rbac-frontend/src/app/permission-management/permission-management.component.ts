// import { Component, OnInit, ViewChild } from '@angular/core';
// import { PermissionService } from '../services/permission.service';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';

// import { MatPaginator, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
// import { MatTableDataSource, MatTableModule } from '@angular/material/table';;


// @Component({
//   standalone: true,
//   selector: 'app-permission-management',
//   templateUrl: './permission-management.component.html',
//   styleUrls: ['./permission-management.component.css'],
//   providers: [PermissionService],
//   imports: [FormsModule, CommonModule, MatPaginatorModule,MatTableModule]
// })
// export class PermissionManagementComponent implements OnInit {
//   viewMode: string = 'existing'; // Tracks whether to show existing permissions or new permission form

//   // Other existing properties
//   permissions: any[] = []; // Stores existing permissions
//   levels = ['App', 'Module', 'Feature', 'Object', 'Record', 'Field'];
//   selectedLevel = '';
//   itemsInLevel: any[] = [];
//   selectedItemId: number | null = null;
//   searchValue: string = '';
//   newPermission = {
//     canRead: false,
//     canWrite: false,
//     canEdit: false,
//     canDelete: false,
//     inheritance: true
//   };

//     // Paginator-related properties
//     pageSize = 10;
//     pageIndex = 0;
//     totalItems = 0;

//     @ViewChild(MatPaginator) paginator!: MatPaginator;

//   constructor(private permissionService: PermissionService) {}


//   ngOnInit(): void {
//     this.fetchPermissions();
//   }

//   ngAfterViewInit() {
//     this.permissions.paginator = this.paginator;
//   }

//   // Toggle view to show existing permissions
//   showExistingPermissions(): void {
//     this.viewMode = 'existing';
//     this.fetchPermissions();
//   }

//   // Toggle view to create a new permission
//   showNewPermissionForm(): void {
//     this.viewMode = 'new';
//     this.resetForm();
//   }

//   // Fetches existing permissions from the backend
//   fetchPermissions(): void {
//     this.permissionService.getAllPermissions().subscribe(data => {
//       this.permissions = data;
//       //console.log(this.permissions);
//     });
//   }
//   onSearchInput(event: Event): void {
//     const target = event.target as HTMLInputElement;
//     const searchValue = target.value;
//     this.loadItemsForLevel(1, searchValue);
//   }

//   // Select a level and load items for it
//   selectLevel(level: string): void {
//     this.selectedLevel = level;
//     this.selectedItemId = null;
//     this.loadItemsForLevel(1,'');
//   }

//   selectItem(itemId: number): void {
//     this.selectedItemId = itemId;
//   }


//   // Step 2: Load Items for Selected Level with Pagination/Search
//   loadItemsForLevel(page: number = 1, searchQuery: string = ''): void {
//     this.permissionService.getItemsInLevel(this.selectedLevel, page, searchQuery).subscribe(data => {
//       this.itemsInLevel = data.items;
//       // You can add pagination information from `data.pagination`
//     });
//   }

//   // Step 3: Check for Duplicate and Create Permission
//   checkAndSetPermission(): void {
//     const requestData = {
//       ...this.newPermission,
//       level: this.selectedLevel,
//       levelId: this.selectedItemId,
//     };
//     //console.log(requestData);

//     this.permissionService.checkDuplicatePermission(requestData).subscribe(response => {
//       if (response.exists) {
//         alert(`A similar permission already exists: ${response.body}`);
//       } else {
//         alert('Permission created successfully!');
//         this.resetForm();
//       }
//     });
//   }

//   // Reset the form
//   resetForm(): void {
//     this.selectedLevel = '';
//     this.selectedItemId = null;
//     this.newPermission = {
//       canRead: false,
//       canWrite: false,
//       canEdit: false,
//       canDelete: false,
//       inheritance: true
//     };
//   }

// }


import { Component, OnInit, ViewChild } from '@angular/core';
import { PermissionService } from '../services/permission.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';

@Component({
  standalone: true,
  selector: 'app-permission-management',
  templateUrl: './permission-management.component.html',
  styleUrls: ['./permission-management.component.css'],
  providers: [PermissionService],
  imports: [FormsModule, CommonModule, MatPaginatorModule, MatTableModule]
})
export class PermissionManagementComponent implements OnInit {
  viewMode: string = 'existing'; // Tracks whether to show existing permissions or new permission form

  // Paginator-related properties
  pageSize = 10;
  pageIndex = 0;
  totalItems = 0;
  // permissions: any[] = [];
  permissions = new MatTableDataSource<any>([]); // Changed to MatTableDataSource
  levels = ['App', 'Module', 'Feature', 'Object', 'Record', 'Field'];
  selectedLevel = '';
  itemsInLevel: any[] = [];
  selectedItemId: number | null = null;
  searchValue: string = '';
  newPermission = {
    canRead: false,
    canWrite: false,
    canEdit: false,
    canDelete: false,
    inheritance: true
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private permissionService: PermissionService) {}

  ngOnInit(): void {
    this.fetchPermissions();
  }

  ngAfterViewInit() {
    this.permissions.paginator = this.paginator; // Assign paginator here
  }

  // Toggle view to show existing permissions
  showExistingPermissions(): void {
    this.viewMode = 'existing';
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
      this.permissions.data = data; // Set data for MatTableDataSource
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
    this.loadItemsForLevel(1, '');
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

  // Reset the form
  resetForm(): void {
    this.selectedLevel = '';
    this.selectedItemId = null;
    this.newPermission = {
      canRead: false,
      canWrite: false,
      canEdit: false,
      canDelete: false,
      inheritance: true
    };
  }
}
