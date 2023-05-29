import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService{

  constructor() { }


  getItem(key:any){
    return localStorage.getItem(key);
  }

  getArray(key:any){
    return localStorage.getItem(JSON.parse(key));
  }

  setItem(key:any, data:any){
    return localStorage.setItem(key, data);
  }

  setArray(key:any, data:any){
    return localStorage.setItem(key,  JSON.stringify(data));
  }

  deleteItem(key:any){
    return localStorage.removeItem(key);
  }

  deleteAllStorage(){
    return localStorage.clear();
  }
}
