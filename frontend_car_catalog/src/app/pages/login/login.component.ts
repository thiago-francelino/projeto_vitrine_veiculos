import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent {
  email!: string;
  senha!: string;

  constructor(private http: HttpClient, private router: Router) {}
  //valida usuario
  login(): void {
    this.http
      .post<any>('http://127.0.0.1:5000/login', { email: this.email, password: this.senha })
      .subscribe(
        (response) => {
          const token = response.token;
          localStorage.setItem('token', token);
          this.router.navigate(['/home']);
          console.log('Sucesso:');
        },
        (error) => {
          console.error(error);
        }
      );
  }
  //cria usuario
  userCreate(): void {
    this.http
      .post<any>('http://127.0.0.1:5000/login_create', { email: this.email, password: this.senha })
      .subscribe(
        (response) => {
          const token = response.token;
          localStorage.setItem('token', token);
          this.router.navigate(['/home']);
          console.log('Sucesso:');
        },
        (error) => {
          console.error(error);
        }
      );
  }
}
