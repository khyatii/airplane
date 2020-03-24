import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';
import { environment }  from '../../../environments/environment';

@Injectable()
export class AdminFnService {
  private BASE_URL: string = `${environment.BASE_URL}`;
  private options = {withCredentials:true};

  constructor(
    private http: Http
  ) { }

  list() {
    return this.http.get(`${this.BASE_URL}/admin/claim/list`, this.options)
      .map(res => {
        return res.json().sort((a, b) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
      })
  }

  updateStatus(statusForm) {
    return this.http.post(`${this.BASE_URL}/admin/claim/status`, statusForm, this.options)
  }

  listUsers() {
    return this.http.get(`${this.BASE_URL}/admin/users/list`, this.options)
      .map(res => {
        return res.json()
      })
  }

  deleteClaim(deleteInfo: {id: string, deletePassword: string}) {
    return this.http.post(`${this.BASE_URL}/admin/claim/delete`, deleteInfo, this.options)
  }

}
