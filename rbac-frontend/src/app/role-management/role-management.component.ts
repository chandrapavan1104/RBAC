import { Component, OnInit } from '@angular/core';
import { RoleService } from '../services/role.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.css'],
  providers: [RoleService],
  imports: [FormsModule, CommonModule]
})
export class RoleManagementComponent implements OnInit {
  roles: any[] = []; // Array to store roles
  newRole: any = {}; // Object to store new role details
  editingRole: any = null; // Object to store role being edited
  showAddRoleForm: boolean = false; // Toggle visibility of Add Role form

  constructor(private roleService: RoleService) {}

  ngOnInit(): void {
    this.fetchRoles();
  }

  // Toggle the visibility of the Add Role form
  toggleAddRoleForm() {
    this.showAddRoleForm = !this.showAddRoleForm;
    if (!this.showAddRoleForm) {
      this.newRole = {}; // Reset form when closed
    }
  } 
  
  fetchRoles(): void {
    this.roleService.getRoles().subscribe(data => {
      this.roles = data;
    });
  }

  addRole(): void {
    this.roleService.createRole(this.newRole).subscribe(() => {
      this.fetchRoles();
      this.newRole = { name: '', description: '' };
    });
  }

  startEdit(role: any): void {
    this.editingRole = { ...role };
  }

  updateRole(): void {
    if (this.editingRole) {
      this.roleService.updateRole(this.editingRole.id, this.editingRole).subscribe(() => {
        this.fetchRoles();
        this.cancelEdit();
      });
    }
  }

  cancelEdit(): void {
    this.editingRole = null;
  }

  confirmDelete(roleId: string): void {
    if (confirm('Are you sure you want to delete this role?')) {
      this.deleteRole(roleId);
    }
  }

  deleteRole(id: string): void {
    this.roleService.deleteRole(id).subscribe(() => this.fetchRoles());
  }
}
