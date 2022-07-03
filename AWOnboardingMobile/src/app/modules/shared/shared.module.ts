import { HeaderComponent } from './../../components/header/header.component';
import { IonicModule } from '@ionic/angular';
import { FooterComponent } from './../../components/footer/footer.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    IonicModule
  ],
  declarations: [
    FooterComponent,
    HeaderComponent
  ],
  exports: [
    FooterComponent,
    HeaderComponent
  ]
})
export class SharedModule { }
