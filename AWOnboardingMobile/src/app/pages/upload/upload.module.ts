import { SharedModule } from './../../modules/shared/shared.module';
import { FooterComponent } from './../../components/footer/footer.component';


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UploadPage } from './upload.page';

const routes: Routes = [
  {
    path: '',
    component: UploadPage
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
  declarations: [UploadPage]
})
export class UploadPageModule {}
