import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendConnectionService {

  private apiUrl = 'http://127.0.0.1:5000'; // Insira a URL base da sua API aqui

  constructor(private http: HttpClient) { }

  getCarros(): Observable<any> {
    const url = `${this.apiUrl}/carros`; // Constrói a URL completa da rota da API
    return this.http.get(url);
  }

}
