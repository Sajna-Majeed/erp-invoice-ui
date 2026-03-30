import { Injectable } from '@angular/core';
import { ApiService } from '../api-service';

@Injectable({
  providedIn: 'root',
})
export class LicenseModeService {
   private url = 'LicenseMode';
    constructor(private api: ApiService) {}
  
   
    checkNameExists(name: string, id?: number) {
    return this.api.get(`${this.url}/check`, {
      name: name,
      id: id
    });
  }
    getAll() {
      return this.api.get(this.url);
    }
    getNextNumber() {
       return this.api.get(`${this.url}/code`);
    }
      create(module: any) {
        return this.api.post(this.url, module);
      }
      update(module: any) {
        return this.api.put(this.url, module);
      }
      delete(moduleId: number) {  
        return this.api.delete(`${this.url}/${moduleId}`); 
      }
      toggleStatus(moduleId: number) {
        return this.api.delete(`${this.url}/toggle/${moduleId}`);
      }
}
