import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { RoleManagementComponent } from './role-management/role-management.component';
import { PermissionManagementComponent } from './permission-management/permission-management.component';

import { RouterOutlet } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    UserManagementComponent,
    RoleManagementComponent,
    PermissionManagementComponent
  ],
  imports: [
    BrowserModule,
    RouterOutlet,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
