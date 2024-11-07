import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { RoleService } from '../services/role.service';
import { User, Role } from '../models/user.model';

@Component({
  standalone: true,
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
  providers: [UserService, RoleService],
  imports: [CommonModule, FormsModule]
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  roles: Role[] = [];
  newUser: User = { id: 0, username: '', email: '', password:'' };
  selectedUser: User | null = null;
  viewMode: 'view' | 'add' | 'edit' | 'manageRoles' = 'view';

  constructor(private userService: UserService, private roleService: RoleService) {}

  ngOnInit(): void {
    this.fetchUsers();
    this.fetchRoles();
  }

  fetchUsers() {
    this.userService.getUsers().subscribe((data: User[]) => {
      this.users = data;
    });
  }

  fetchRoles() {
    this.roleService.getRoles().subscribe((data: Role[]) => {
      this.roles = data;
    });
  }

  showViewUsers() {
    this.viewMode = 'view';
    this.selectedUser = null;
  }

  showAddUserForm() {
    this.viewMode = 'add';
    this.newUser = { id: 0, username: '', email: '' };
  }

  addUser() {
    this.userService.addUser(this.newUser).subscribe(() => {
      this.showViewUsers();
      this.fetchUsers();
    });
  }

  selectUser(user: User) {
    this.selectedUser = user;
    this.viewMode = 'view';
  }
  // Select a user for editing and switch to edit view
  editUser(user: User) {
    this.selectedUser = { ...user };
    this.viewMode = 'edit';
  }

  // Update the selected user’s information
  updateUser() {
    if (this.selectedUser) {
      this.userService.updateUser(this.selectedUser).subscribe(() => {
        this.fetchUsers();  // Refresh user list after update
        this.showViewUsers();  // Switch back to the view mode
      });
    }
  }

  // Confirm and delete the selected user
  confirmDeleteUser(userId: number) {
    if (confirm("Are you sure you want to delete this user?")) {
      this.userService.deleteUser(userId).subscribe(() => {
        this.fetchUsers();  // Refresh user list after deletion
        if (this.selectedUser && this.selectedUser.id === userId) {
          this.selectedUser = null;  // Clear selected user if deleted
        }
      });
    }
  }
  // Select a user and fetch their roles
  manageRoles(user: User) {
    this.selectedUser = user;
    this.viewMode = 'manageRoles';
    this.fetchUserRoles(user.id);  // Fetch roles for the selected user
  }

  // Fetch roles assigned to a user
  fetchUserRoles(userId: number) {
    this.userService.getUserRoles(userId).subscribe((roles: Role[]) => {
      if (this.selectedUser) this.selectedUser.roles = roles;
    });
  }

// Assign a role to the selected user
assignRole(user: User, roleId: number) {
  this.roleService.assignRoleToUser(user.id, roleId).subscribe(() => {
    this.fetchUsers(); // Refresh user data
    alert('Role assigned successfully.');
    this.viewMode = 'manageRoles';
    this.fetchUserRoles(user.id);
  });
}

// Remove a role from the selected user
removeRole(user: User, role: Role) {
  this.userService.removeRoleFromUser(user.id, role.id).subscribe(() => {
    this.fetchUsers(); // Refresh user data
    alert('Role removed successfully.');
    this.viewMode = 'manageRoles';
    this.fetchUserRoles(user.id);
  });
}

}
