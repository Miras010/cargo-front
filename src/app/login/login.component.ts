import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import {MessageService, PrimeNGConfig} from "primeng/api";
import {Router} from "@angular/router";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: any;
  logoPath = 'assets/logo.png'
  submitted = false;

  constructor(private authService: AuthService,
              private messageService: MessageService,
              private router: Router
              ) {
  }
  ngOnInit() {
    this.authService.logout()
    this.loginForm = new FormGroup({
      login: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  onSubmit() {
    this.submitted = true
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value.login, this.loginForm.value.password)
        .toPromise()
        .then(res => {
          this.authService.authorize(res)
        }).catch((err) => {
        console.log(err);
        this.messageService.add({severity:'error', summary: 'Ошибка', detail: err.error.message, life: 3000});
      });
    } else {
      this.messageService.add({severity:'info', summary:'Info Message', detail:'Не все поля заполнены!'})
    }
  }


}
