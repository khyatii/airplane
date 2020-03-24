import { Injectable } from '@angular/core';
import { environment }  from '../../../environments/environment';
import { airlineInterface } from'../interfaces/interfaces'
import { Observable } from 'rxjs/Rx';
import { Http, Response } from '@angular/http';

@Injectable()
export class AirlineAutocompleteService {
  private BASE_URL: string = `${environment.BASE_URL}`;

  constructor(private http: Http) { }

  new(regularExp: string): Observable<Array<airlineInterface>>  {
    return this.http.post(`${this.BASE_URL}/airline/autocomplete`, {regularExp: regularExp})
    .map(res => res.json())
  }

  find(inputValue: string): Observable<Array<airlineInterface>> {
    return this.http.post(`${this.BASE_URL}/airline/find`, {inputValue: inputValue})
    .map(res => res.json())
  }

}
