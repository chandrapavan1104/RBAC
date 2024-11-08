import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoleService } from '../services/role.service';
import { PermissionService } from '../services/permission.service';
import { Role } from '../models/role.model';
import { Permission } from '../models/permission.model';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  standalone: true,
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.css'],
  providers: [RoleService, PermissionService],
  imports: [CommonModule, FormsModule, MatTableModule, MatPaginatorModule]
})
export class RoleManagementComponent implements OnInit {
  roles: Role[] = [];
  paginatedRoles = new MatTableDataSource<Role>(this.roles);
  permissions: Permission[] = [];
  selectedRole: Role | null = null;
  viewMode: 'view' | 'add' | 'edit' = 'view';
  newRole: Role = { id: 0, name: '', description: '', permissions: [] };
  isEditing: boolean = false;
  displayedColumns: string[] = ['name', 'description', 'actions'];


  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private roleService: RoleService,
    private permissionService: PermissionService
  ) {}

  ngOnInit(): void {
    this.fetchRoles();
    this.fetchPermissions();
  }

  ngAfterViewInit() {
    this.paginatedRoles.paginator = this.paginator;
  }

  // Fetch all roles
  fetchRoles(): void {
    this.roleService.getRoles().subscribe((data: Role[]) => {
      this.roles = data;
      this.paginatedRoles.data = this.roles;
    });
  }

  // Fetch all permissions
  fetchPermissions(): void {
    this.permissionService.getAllPermissions().subscribe((data: Permission[]) => {
      this.permissions = data.map(permission => ({ ...permission, selected: true }));
    });
  }

  // Toggle between view and add role modes
  showAddRoleForm(): void {
    this.viewMode = 'add';
    this.newRole = { id: 0, name: '', description: '', permissions: [] };
    this.permissions.forEach(permission => permission.selected = false); // Reset permission selections
  }

  showViewRoles(): void {
    this.viewMode = 'view';
    this.selectedRole = null;
  }

  // Add a new role
  createRole(): void {
    const selectedPermissions = this.permissions
      .filter(p => p.selected)
      .map(p => p.id); // Collect selected permission IDs

    this.roleService.createRole(this.newRole, selectedPermissions).subscribe(() => {
      this.fetchRoles();
      this.showViewRoles();
    });
  }

  // Select a role to edit
  editRole(role: Role): void {
    this.viewMode = 'edit';
    this.selectedRole = { ...role };
    this.newRole = { ...role, permissions: role.permissions || [] };

    // Set the selected permissions for editing
    this.permissions.forEach(permission => {
      permission.selected = !!this.newRole.permissions?.some(p => p.id === permission.id);
    });
  }

  // Update the role
  updateRole(): void {
    if (!this.selectedRole) return;

    const selectedPermissions = this.permissions
      .filter(p => p.selected)
      .map(p => p.id); // Collect selected permission IDs

    this.roleService.updateRole(this.newRole, selectedPermissions).subscribe(() => {
      this.fetchRoles();
      this.showViewRoles();
    });
  }

  // Confirm and delete a role
  confirmDeleteRole(roleId: number): void {
    if (confirm('Are you sure you want to delete this role?')) {
      this.roleService.deleteRole(roleId).subscribe(() => {
        this.fetchRoles();
      });
    }
  }

  // Toggle permission selection
  togglePermission(permission: Permission): void {
    permission.selected = !permission.selected;
  }
}
