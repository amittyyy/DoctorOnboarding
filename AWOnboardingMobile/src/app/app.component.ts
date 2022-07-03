import { EventEmitter } from 'events';
import { UtilitiesService } from './services/utilities/utilities.service';
import { FCM } from '@ionic-native/fcm/ngx';
import { concatMap } from 'rxjs/operators';
import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthenticationService } from './services/authentication/authentication.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Device } from '@ionic-native/device/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  private assetsDirectory = '../assets/icon/';
  public isContractor: boolean;

  public rootPage: any;


  public pages = [
    {
      title: 'Home',
      url: '/dashboard',
      icon: this.assetsDirectory + 'Nav_home.svg'
    },
    {
      title: 'Profile',
      url: '/profile',
      icon: this.assetsDirectory + 'Profile_icon.svg'
    },
    {
      title: 'Pay Stubs',
      url: '/pay-stubs',
      icon: this.assetsDirectory + 'Paystub_icon.svg'
    },
    {
      title: 'Tax Forms',
      url: '/taxforms',
      icon: this.assetsDirectory + (this.isContractor ? '1099_icon.svg' : 'W2_icon.svg')
    },
    {
      title: 'Upload Forms',
      url: '/upload',
      icon: this.assetsDirectory + 'Upload_icon.svg'
    },
    {
      title: 'View Uploaded Forms',
      url: '/forms',
      icon: this.assetsDirectory + 'View_file_icon.svg'
    }
  ];
  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
    public menuCtrl: MenuController, private auth: AuthenticationService, private navCtrl: NavController,
    private router: Router, public fcm: FCM, public utilities: UtilitiesService, private storage: Storage,
    private device: Device ) {

    this.initializeApp();
    this.utilities.isContractor.subscribe(
      value => {
        this.pages[3] = {
          title: 'Tax Forms',
          url: '/taxforms',
          icon: this.assetsDirectory + (value ? '1099_icon.svg' : 'W2_icon.svg')
        };
        this.isContractor = value;
      }
    );
  }


  initializeApp() {
    this.platform.ready().then(async () => {
      this.logout();
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();

      let fbToken, device = '';
      fbToken = await this.fcm.getToken();
      if (this.utilities.isAndroid()) {
        device = 'android';
      } else if (this.utilities.isIOS()) {
        device = 'ios';
      }

      await this.storage.set('firebase', {
        device: device,
        token: fbToken,
        udid: this.device.uuid
      });
      this.auth.isTokenValid().subscribe(val => {
        this.fcm.onNotification().subscribe(data => {
          if (data.wasTapped) {
            this.router.navigate(['/pay-stubs']);
          } else {

          }

        }, err => { });

        if (val) {

          if (this.router.url === '/login') {
            this.router.navigate(['/dashboard']);
          } else {
            this.navCtrl.navigateRoot(this.router.url);
          }

        } else {
          this.navCtrl.navigateRoot('/login');
        }
        // this.splashScreen.hide();
      });
    });

    this.platform.pause.subscribe( x => {
      this.auth.getUserLoginInfo().subscribe(
        val => {
          if (val == null) {
              this.logout();
          } 
        }
      );
      
    });
  }

  ionViewDidLoad() {


  }

  ionViewDidEnter() {

  }

  ionViewWillLeave() {


  }

  // openPage(page) {
  //   // Reset the content nav to have just this page
  //   // we wouldn't want the back button to show in this scenario
  //   this.nav.setRoot(page.component);
  // }

  async logout() {

    await this.auth.deleteToken();
    this.menuCtrl.close();
    this.navCtrl.navigateRoot('/login');


  }
}
