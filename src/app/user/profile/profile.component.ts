import {Component, OnInit, ViewEncapsulation} from '@angular/core'
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../services/user.service";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent implements OnInit {

  userData: any
  isLoading: boolean = false
  onEditing: boolean = false
  userForm: any
  passwordForm: any
  phoneNumber: string = ''

  constructor(private userService: UserService,
              private messageService: MessageService) { }

  ngOnInit() {
    this.setValue()
    this.getUserData()
  }

  setValue () {
    this.userForm = new FormGroup({
      name: new FormControl('', Validators.required),
      surname: new FormControl('', Validators.required),
      phoneNumber: new FormControl('', Validators.required),
      mail: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required),
    })
    this.passwordForm = new FormGroup({
      currentPassword: new FormControl('', [Validators.required, Validators.minLength(3),  Validators.maxLength(18)]),
      newPassword: new FormControl('', [Validators.required, Validators.minLength(3),  Validators.maxLength(19)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(3),  Validators.maxLength(19)]),
    })
  }

  getUserData () {
    this.isLoading = true
    this.userService.getUserData().toPromise()
      .then((response) => {
        this.userData = response
        this.userForm.patchValue({
          name: response.name,
          surname: response.surname,
          phoneNumber: response.phoneNumber,
          mail: response.mail,
          username: response.username
        })
        this.phoneNumber = response.phoneNumber
      }).finally(() => {
        this.isLoading = false
      })
  }

  onSubmit () {
    if (this.userForm.valid) {
      this.isLoading = true
      const symbols = ['+', '(', ')', ' ', '-']
      symbols.forEach(symbol => {
        this.userForm.value.phoneNumber = this.userForm.value.phoneNumber.replaceAll(symbol, '')
      })
      this.userService.updateByUser(this.userForm.value).toPromise()
        .then(() => {
          this.getUserData()
          this.messageService.add({
            severity: "success",
            summary: "??????????????",
            detail: "?????????????????? ?????????????? ??????????????????!"
          });
        }).catch(err => {
        this.messageService.add({
          severity: "info",
          summary: "????????????",
          detail: '???? ?????????????? ?????????????????? - ' + err.error.message
        })
      })
        .finally(() => {
          this.isLoading = false
          this.onEditing = false
        })
    }
  }

  cancelForm () {
    this.onEditing = false
    this.getUserData()
  }

  changePassword () {
    if (this.passwordForm.valid) {
      if (this.passwordForm.value.newPassword === this.passwordForm.value.confirmPassword) {
        this.isLoading = true
        const data = {
          currentPassword: this.passwordForm.value.currentPassword,
          newPassword: this.passwordForm.value.newPassword,
        }
        this.userService.changePasswordByUser(data).toPromise()
          .then(response => {
            this.getUserData()
            this.messageService.add({
              severity: "success",
              summary: "??????????????",
              detail: "???????????? ?????????????? ??????????????!"
            });
          }).catch(err => {
          this.messageService.add({
            severity: "info",
            summary: "????????????",
            detail: '???? ?????????????? ???????????????? ???????????? - ' + err.error.message
          })
        })
          .finally(() => {
            this.isLoading = false
            this.passwordForm.reset();
          })
      } else {
        this.messageService.add({
          severity: "info",
          summary: "????????????????",
          detail: '???????????? ???? ??????????????????'
        })
      }
    } else {
      this.messageService.add({
        severity: "info",
        summary: "????????????????",
        detail: '???????????? ???????????? ???????? ???? 3 ???? 18 ????????????????'
      })
    }
  }
}





