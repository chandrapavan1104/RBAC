import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiUrl = 'http://localhost:3000/api/roles';

  constructor(private http: HttpClient) {}

  getRoles(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  deleteRole(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  assignRoleToUser(userId: number, roleId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/assign-role`, { userId, roleId });
  }

  removeRoleFromUser(userId: number, roleId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/remove-role`, { userId, roleId });
  }

  createRole(role: Role, permissions: number[]): Observable<Role> {
    return this.http.post<Role>(this.apiUrl, { ...role, permissions });
  }

  updateRole(role: Role, permissions: number[]): Observable<Role> {
    return this.http.put<Role>(`${this.apiUrl}/${role.id}`, { ...role, permissions });
  }

  getRolePermissions(roleId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${roleId}/permissions`);
  }
}
