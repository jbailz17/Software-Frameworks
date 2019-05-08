import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class DataService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) { }

  getData() {
    return this.http.get(environment.apiUrl).toPromise();
  }

  writeData(data) {
    console.log('Write Data', data);
    this.http.post(environment.apiUrl, data, {headers: this.headers}).toPromise().then((res) => {
      console.log('RESPONSE: ', res);
    }).catch((err) => {
      console.log('There was an error: ', err);
    });
  }

}
