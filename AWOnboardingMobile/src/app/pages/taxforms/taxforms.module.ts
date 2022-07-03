import { SharedModule } from './../../modules/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TaxformsPage } from './taxforms.page';

const routes: Routes = [
  {
    path: '',
    component: TaxformsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TaxformsPage]
})
export class TaxformsPageModule {}
