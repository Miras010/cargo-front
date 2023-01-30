import { Component } from '@angular/core';

@Component({
    selector: 'app-partner',
    template: `
      <app-partner-header></app-partner-header>
      <router-outlet></router-outlet>
      <app-new-user-header></app-new-user-header>
    `,
})

export class PartnerComponent {

    constructor() {
    }
}
