import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Permission } from '../models/permission.model';


@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private apiUrl = 'http://localhost:3000/api/permissions';

  constructor(private http: HttpClient) {}

  // Fetch all permissions (for displaying existing permissions)
  getAllPermissions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`);
  }

  // Fetch items within a specified level with pagination and search
  getItemsInLevel(level: string, page: number = 1, searchQuery: string = ''): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('search', searchQuery);

    return this.http.get(`${this.apiUrl}/level/${level}`, { params });
  }

  // Check for duplicate permission
  checkDuplicatePermission(permissionData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/check-duplicate`, permissionData);
  }

  // Add new permission and role
  addNewPermissionAndRole(permissionData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-with-role`, permissionData);
  }

  // **Update a permission**
  updatePermission(permissionData: Permission): Observable<any> {
    return this.http.put<Permission>(`${this.apiUrl}/${permissionData.id}`, permissionData);
  }

  // **Delete a permission by ID**
  deletePermission(permissionId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${permissionId}`);
  }
}
