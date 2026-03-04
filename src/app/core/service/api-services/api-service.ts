import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../shared/enviorment';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../models/interface/Apiresponse';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private buildParams(params?: any): HttpParams {
    let httpParams = new HttpParams();

    if (!params) return httpParams;

    Object.keys(params).forEach(key => {
      const value = params[key];

      if (value !== null && value !== undefined && value !== '') {
        httpParams = httpParams.set(key, value.toString());
      }
    });

    return httpParams;
  }

  get<T>(url: string, params?: any): Observable<ApiResponse<T>> {
    return this.http.get<ApiResponse<T>>(
      `${this.baseUrl}/${url}`,
      { params: this.buildParams(params) }
    );
  }

  post<T>(url: string, body: any): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(
      `${this.baseUrl}/${url}`,
      body
    );
  }

  put<T>(url: string, body: any): Observable<ApiResponse<T>> {
    return this.http.put<ApiResponse<T>>(
      `${this.baseUrl}/${url}`,
      body
    );
  }

  patch<T>(url: string, body: any): Observable<ApiResponse<T>> {
    return this.http.patch<ApiResponse<T>>(
      `${this.baseUrl}/${url}`,
      body
    );
  }

  delete<T>(url: string): Observable<ApiResponse<T>> {
    return this.http.delete<ApiResponse<T>>(
      `${this.baseUrl}/${url}`
    );
  }
}