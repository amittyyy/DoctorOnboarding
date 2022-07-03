import { ToastController, LoadingController, Platform } from '@ionic/angular';


import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UtilitiesService {

  public isContractor: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public loading;

  constructor(public http: HttpClient, private loadingCtrl: LoadingController,
    private toastCtrl: ToastController, public platform: Platform) {
  }

  async showToast(message, duration, position, type) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: duration,
      position: position,
      cssClass: this.decideToastType(type),
      color: type === 'success' ? 'secondary' : 'danger'
    });
    toast.present();
  }

  decideToastType(type): string {
    if (type === 'success') {
      return 'toast-success';
    } else if (type === 'error') {
      return 'toast-error';
    }
  }
  async presentLoadingCustom() {
    this.loading = await this.loadingCtrl.create({
      spinner: 'dots',
      message: 'Please wait...',
      duration: 20000
    });

    this.loading.present();

  }

  async presentAlertConfirm(alertController, alertContent) {
    const alert = await alertController.create({
      header: alertContent.header,
      message: alertContent.message,
      buttons: [
        {
          text: alertContent.cancelText,
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            alertContent.cancelHandler();
            return false;
          }
        }, {
          text: alertContent.acceptText,
          handler: () => {
            alertContent.okayHandler();
            return true;
          }
        }
      ]
    });

    await alert.present();
  }

  dismisLoading() {
    this.loading.dismiss();
  }

  isAndroid(): boolean {
    if (this.platform.is('android')) {
      return true;
    } else {
      return false;
    }
  }

  isIOS(): boolean {
    if (this.platform.is('ios')) {
      return true;
    } else {
      return false;
    }
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

  
}
