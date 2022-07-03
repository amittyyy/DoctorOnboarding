import { AuthGuardService } from './guards/auth-guard.service';
import { RedirectGuardService } from './guards/redirect-guard.service';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule', canActivate: [RedirectGuardService]},
  { path: 'dashboard', loadChildren: './pages/dashboard/dashboard.module#DashboardPageModule', canActivate: [AuthGuardService] },
  { path: 'forms', loadChildren: './pages/forms/forms.module#FormsPageModule', canActivate: [AuthGuardService] },
  { path: 'profile', loadChildren: './pages/profile/profile.module#ProfilePageModule', canActivate: [AuthGuardService] },
  { path: 'pay-stubs', loadChildren: './pages/pay-stubs/pay-stubs.module#PayStubsPageModule', canActivate: [AuthGuardService] },
  { path: 'upload', loadChildren: './pages/upload/upload.module#UploadPageModule', canActivate: [AuthGuardService] },
  { path: 'taxforms', loadChildren: './pages/taxforms/taxforms.module#TaxformsPageModule' , canActivate: [AuthGuardService]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
