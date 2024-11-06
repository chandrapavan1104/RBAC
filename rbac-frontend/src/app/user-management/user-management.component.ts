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
  imports: [CommonModule, FormsModule]
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  roles: Role[] = [];
  newUser: User = { id: 0, username: '', email: '' };
  selectedUser: User | null = null;
  viewMode: 'view' | 'add' = 'view';

  constructor(private userService: UserService, private roleService: RoleService) {}

  ngOnInit(): void {
    this.fetchUsers();
    this.fetchRoles();
  }

  fetchUsers() {
    this.userService.getUsers().subscribe((data: User[]) => {
      this.users = data;
      console.log(this.users);
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

  assignRole(user: User, role: Role) {
    this.roleService.assignRoleToUser(user.id, role.id).subscribe(() => {
      this.fetchUsers();
    });
  }

  removeRole(user: User, role: Role) {
    this.roleService.removeRoleFromUser(user.id, role.id).subscribe(() => {
      this.fetchUsers();
    });
  }
}
