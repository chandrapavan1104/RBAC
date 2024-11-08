import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { UserService } from '../services/user.service';
import { RoleService } from '../services/role.service';
import { User, Role } from '../models/user.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
  providers: [UserService, RoleService],
  imports: [CommonModule, FormsModule, MatTableModule, MatPaginatorModule, MatSortModule]
})
export class UserManagementComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'username', 'email', 'actions'];
  dataSource: MatTableDataSource<User> = new MatTableDataSource<User>([]);
  roles: Role[] = [];
  newUser: User = { id: 0, username: '', email: '', password: '' };
  selectedUser: User | null = null;
  viewMode: 'view' | 'add' | 'edit' | 'manageRoles' = 'view';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userService: UserService, private roleService: RoleService) {}

  ngOnInit(): void {
    this.fetchUsers();
    this.fetchRoles();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  fetchUsers() {
    this.userService.getUsers().subscribe((data: User[]) => {
      this.dataSource.data = data;
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
    this.newUser = { id: 0, username: '', email: '', password: '' };
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

  editUser(user: User) {
    this.selectedUser = { ...user };
    this.viewMode = 'edit';
  }

  updateUser() {
    if (this.selectedUser) {
      this.userService.updateUser(this.selectedUser).subscribe(() => {
        this.fetchUsers();
        this.showViewUsers();
      });
    }
  }

  confirmDeleteUser(userId: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe(() => {
        this.fetchUsers();
        if (this.selectedUser && this.selectedUser.id === userId) {
          this.selectedUser = null;
        }
      });
    }
  }

  manageRoles(user: User) {
    this.selectedUser = user;
    this.viewMode = 'manageRoles';
    this.fetchUserRoles(user.id);
  }

  fetchUserRoles(userId: number) {
    this.userService.getUserRoles(userId).subscribe((roles: Role[]) => {
      if (this.selectedUser) this.selectedUser.roles = roles;
    });
  }

  assignRole(user: User, roleId: number) {
    this.roleService.assignRoleToUser(user.id, roleId).subscribe(() => {
      this.fetchUsers();
      alert('Role assigned successfully.');
      this.viewMode = 'manageRoles';
      this.fetchUserRoles(user.id);
    });
  }

  removeRole(user: User, role: Role) {
    this.userService.removeRoleFromUser(user.id, role.id).subscribe(() => {
      this.fetchUsers();
      alert('Role removed successfully.');
      this.viewMode = 'manageRoles';
      this.fetchUserRoles(user.id);
    });
  }
}
