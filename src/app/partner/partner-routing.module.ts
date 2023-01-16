import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PartnerComponent } from './partner.component';
import {TracksComponent} from "./tracks/tracks.component";
import {ReceiptsComponent} from "./receipts/receipts.component";

const routes: Routes = [
  {
  path: '',
  component: PartnerComponent,
  children: [
    {
      path: 'track',
      component: TracksComponent
    },
    {
      path: 'receipts',
      component: ReceiptsComponent
    },
    {
      path: '**',
      redirectTo: 'track',
      pathMatch: 'full',
    },
  ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PartnerRoutingModule {
}
