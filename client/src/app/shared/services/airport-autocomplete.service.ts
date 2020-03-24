import { Injectable } from '@angular/core';
import { environment }  from '../../../environments/environment';
import { airportInterface } from'../interfaces/interfaces'
import { Observable } from 'rxjs/Rx';
import { Http, Response } from '@angular/http';

@Injectable()
export class AirportAutocompleteService {
  private BASE_URL: string = `${environment.BASE_URL}`;

  constructor(
    private http: Http
  ) { }

  new(regularExp: string): Observable<Array<airportInterface>> {
    return this.http.post(`${this.BASE_URL}/airport/autocomplete`, {regularExp: regularExp})
    .map(res => res.json())
  }

  find(inputValue: string): Observable<Array<airportInterface>> {
    return this.http.post(`${this.BASE_URL}/airport/find`, {inputValue: inputValue})
    .map(res => res.json())
  }

}
