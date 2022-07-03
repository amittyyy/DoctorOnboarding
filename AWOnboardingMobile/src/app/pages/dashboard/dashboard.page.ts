import { FCM } from '@ionic-native/fcm/ngx';

import { Router } from '@angular/router';
import { OnInit, Component } from '@angular/core';
import { AppError } from './../../errors/AppError';
import { User } from '../../models/user';
import { from, Subject, throwError } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NavController, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { GenericApiService } from '../../services/api/generic-api.service';
import { UtilitiesService } from '../../services/utilities/utilities.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  public user: User;
  private unsubscribe: Subject<void> = new Subject<void>();
  private loading;
  public loadFailed = false;


  constructor(public navCtrl: NavController, private api: GenericApiService, private storage: Storage,
    private loadingCtrl: LoadingController, private utilities: UtilitiesService, private router: Router,
    public fcm: FCM) {


  }

  ionViewDidEnter() {
  }

  async ngOnInit() {


    this.loading = await this.loadingCtrl.create({
      spinner: 'dots',
      message: 'Loading home'
    });
    this.loading.present();


    this.storage.get('dashboard').then(val => {
      if ((val === null) || (val === undefined)) {

        this.loadEmployeeInformation();
      } else {

        this.user = val;
        this.utilities.isContractor.next(this.user.isContractor);
        this.loading.dismiss();

      }
    });
  }

  ionViewWillLeave() {

    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private async loadEmployeeInformation() {
    const firebase = await this.storage.get('firebase');
    
    let fbToken = firebase ? firebase.token : '';
    if ( firebase && (fbToken == null || firebase.udid === '' || firebase.device === '' )) {
      fbToken = await this.fcm.getToken();
    }

    if (fbToken) {
      fbToken = encodeURIComponent(fbToken);
    }
    let url = '';
    if ( fbToken && firebase) {
       url = '/employees/dashboard/' + firebase.udid + '/' + firebase.device + '/' + fbToken;
    } else {
       url = '/employees/dashboard/0/' + firebase.device + '/0';
    }

    this.api.get(url, 40000)
      .pipe(
        takeUntil(this.unsubscribe)
      )
      .subscribe(res => {

        this.user = <User>res;
        this.utilities.isContractor.next(this.user.isContractor);
        from(this.storage.set('dashboard', this.user));
        this.loading.dismiss();

      }, (error) => {
        this.loading.dismiss();
        this.loadFailed = true;
        console.log('There was an error loading employee information in the dashboard: ' + error.description);
      });
  }

  onFail(message) {
    alert('Failed because: ' + message);
  }


  private navigateToProfile(): void {
    this.router.navigate(['/profile']);
  }
  private navigateToPayStubs(): void {
    this.router.navigate(['/pay-stubs']);
  }
  private navigateToUpload(): void {
    this.navCtrl.navigateForward('/upload');
  }
  private navigateToForms(): void {
    this.navCtrl.navigateForward('/forms');
  }
  private navigateToTaxForms(): void {
    this.router.navigate(['/taxforms']);
  }

  public async doRefresh(event) {
    await this.loadEmployeeInformation();
    event.target.complete();
  }
}
