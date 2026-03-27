import { Injectable } from '@angular/core';
import { ApiService } from '../api-service';

@Injectable({
  providedIn: 'root',
})
export class ModuleService {
   private url = 'licenseType';
    constructor(private api: ApiService) {}
  
    search(term: string) {
      return this.api.get(`${this.url}/search?term=${term}`);
    }
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
       return this.api.get(`${this.url}/licenseTypecode`);
    }
     getById(id: number) {
        return this.api.get(`${this.url}/${id}`);
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
      getByFilter(pd_id: number) {
    return this.api.get(`${this.url}/product/${pd_id}`);
  }
}
