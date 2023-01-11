import {Injectable} from '@angular/core';
import {environment} from '../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, BehaviorSubject} from 'rxjs';
import {Router} from '@angular/router';
import {MessageService} from "primeng/api";

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem(environment.apiToken),
  });

  public authorized: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  fullUrl = environment.apiUrl + '/auth';

  constructor(private http: HttpClient,
              private router: Router,
              private messageService: MessageService) {
  }

  authorize = (perf: any) => {
    this.authorized.next(true);
    localStorage.setItem(environment.apiToken, perf.token);
    localStorage.setItem('userInfo', JSON.stringify(perf.userInfo));
    perf.roles.forEach((role: string) => {
      if (role === 'ADMIN') {
        localStorage.setItem(environment.roleName, role);
        localStorage.setItem(environment.rolePath, 'admin');
      } else if (role === 'USER') {
        localStorage.setItem(environment.roleName, role);
        localStorage.setItem(environment.rolePath, 'user');
      } else if (role === 'PARTNER') {
        localStorage.setItem(environment.roleName, role);
        localStorage.setItem(environment.rolePath, 'partner');
      }
    })
    console.log('asdasd')
    if (localStorage.getItem(environment.rolePath) === 'partner') {
      this.router.navigate(['partner']);
    } else if (localStorage.getItem(environment.rolePath) === 'user') {
      this.router.navigate(['user'])
    } else if (localStorage.getItem(environment.rolePath) === 'admin') {
      this.router.navigate(['admin'])
    }
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(this.fullUrl + '/login', {username, password});
  }

  // currentUser(token: string): Observable<any> {
  //   return this.http.get<any>(environment.apiUrl + '/partners/api/employee/token', {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer ' + token,
  //     }),
  //   });
  // }

  register(registerRequest: any) {
    return this.http.post(this.fullUrl + '/registration', registerRequest);
  }

  confirmRegister(phone: string, code: string) {
    return this.http.put(this.fullUrl + '/register/confirm?phone=' + phone + '&registrationCode=' + code, null);
  }

  isAuthorized() {
    return localStorage.getItem(environment.apiToken);
  }

  checkAvailability(): boolean {
    return !!localStorage.getItem(environment.apiToken);
  }

  removeToken() {
    localStorage.removeItem(environment.apiToken);
  }

  removeRole() {
    localStorage.removeItem(environment.roleName);
  }

  removeAll() {
    this.removeRole();
    this.removeToken();
  }

  getToken() {
    return localStorage.getItem(environment.apiToken);
  }

  getRole() {
    return localStorage.getItem(environment.roleName);
  }

  getRolePath() {
    return localStorage.getItem(environment.rolePath);
  }

  public logout() {
    this.authorized.next(false);
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  // getMyRole() {
  //   if (!this.getMyApi()) {
  //     return null;
  //   }
  //   const base64Url = this.getMyApi().split('.')[1];
  //   const base64 = base64Url.replace('-', '+').replace('_', '/');
  //   return (JSON.parse(window.atob(base64))).role;
  // }

  // getMyUsername() {
  //   if (!this.getMyApi()) {
  //     return null;
  //   }
  //   const base64Url = this.getMyApi().split('.')[1];
  //   const base64 = base64Url.replace('-', '+').replace('_', '/');
  //   return (JSON.parse(window.atob(base64))).sub;
  // }

  getMyApi() {
    return localStorage.getItem(environment.apiToken);
  }

}
