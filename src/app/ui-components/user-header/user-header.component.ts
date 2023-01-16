import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-user-header',
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.scss']
})
export class UserHeaderComponent implements OnInit {
  logoPath = 'assets/logo.png'
  // @ts-ignore
  userInfo = JSON.parse(localStorage.getItem('userInfo'))

  ngOnInit() {
    console.log('userInfo', this.userInfo.username)
  }
}
