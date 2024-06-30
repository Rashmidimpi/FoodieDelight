import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiHandlerService {
  API_URL = environment.API_URL;

  constructor(private http: HttpClient, public router: Router) { }

  emailCheck(data: any): Observable<any> {
    return this.http.get(this.API_URL + "admin?email=" + data.email);
  }

  loginRequest(data: any) {
    return this.http.get(this.API_URL + "admin?email=" + data.email + "&password=" + data.password);
  }
  postRequest(url: any, data: any): Observable<any> {
    return this.http.post(this.API_URL + url, data);
  }

  getRequest(url: any): Observable<any> {
    return this.http.get(this.API_URL + url);
  }

  deleteRequest(url: any, id: number) {
    return this.http.delete(this.API_URL + url + id)
  }

  updateRequest(url: any, id: number, updatedata: any) {
    let data = {
      "id": id,
      "name": updatedata.name,
      "description": updatedata.description,
      "address": updatedata.address,
      "zip": updatedata.zip,
      "mobile": updatedata.mobile,
      "city": updatedata.city,

    }
    return this.http.put(this.API_URL + url + id, data)
  }
}
