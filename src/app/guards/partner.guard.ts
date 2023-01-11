import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";

export class PartnerGuard implements CanActivate{

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<boolean> | boolean{
    const token = localStorage.getItem('apiToken')
    const role = localStorage.getItem('role')
    return !!(token && role === 'PARTNER');
  }
}
