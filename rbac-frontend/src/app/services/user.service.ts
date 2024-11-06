import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  addUser(user: any): Observable<any> {
    return this.http.post(this.apiUrl, user);
  }

  updateUser(user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${user.id}`, user);
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}`);
  }

  resetPassword(userId: number, newPassword: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${userId}/reset-password`, { password: newPassword });
  }
  // Fetch roles for a specific user
  getUserRoles(userId: number): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.apiUrl}/${userId}/roles`);
  }

  removeRoleFromUser(userId: number, roleId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/remove-role`, { userId, roleId });
  }
}
