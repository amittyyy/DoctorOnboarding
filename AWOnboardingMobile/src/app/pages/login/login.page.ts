
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NavController, MenuController, LoadingController } from '@ionic/angular';
import { UserLogin } from '../../models/UserLogin';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { LoginError } from '../../errors/login-error';
import { AppError } from '../../errors/AppError';
import { GenericApiService } from '../../services/api/generic-api.service';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { AlertController } from '@ionic/angular';
import { UtilitiesService } from '../../services/utilities/utilities.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {


  public userName: string;
  public password: string;
  public firmCode: string;
  public isLoginInvalid: boolean;
  public isLoginInvalidOther: boolean;
  public saveInformation: boolean;
  public enabledId;
  public savedPassword;
  public jwt: string;
  public savedRefresh: string;
  private loading;
  private fpAvail;
  private unsubscribe: Subject<void> = new Subject<void>();
  private platformIdText: string;

  constructor(private navCtrl: NavController, private loadingCtrl: LoadingController,
    private menuCtrl: MenuController, private api: GenericApiService, private utilities: UtilitiesService,
    private auth: AuthenticationService, private fingerPrint: FingerprintAIO, public alertController: AlertController,
    private cdr: ChangeDetectorRef, private iab: InAppBrowser) {
  }

  ionViewDidLoad() {

  }
  async ngOnInit() {
    this.menuCtrl.enable(false);
    // this.fpAvail = await this.fingerPrint.isAvailable(); Temporary commented out 
    this.fpAvail = false;

    this.auth.getUserLoginInfo().subscribe(
      val => {

        if (val) {
          this.userName = val.username;
          this.firmCode = val.firmCode;
          this.saveInformation = val.saveInformation ? val.saveInformation : false;
        }
        console.log(this.saveInformation);
      }
    );

   // this.enabledId = await this.auth.getUserEnabledIdInfo() || { value: false, user: ''};
   this.enabledId = false;

    this.platformIdText = this.utilities.isIOS() ? 'Touch ID' : 'Fingerprint';
  }

  ionViewWillLeave() {

    this.menuCtrl.enable(true);
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  public async login() {

    const userLogin: UserLogin = {
      username: this.userName,
      password: this.password,
      name: this.firmCode
    };
    this.loading = await this.loadingCtrl.create({
      spinner: 'dots',
      message: 'Signing in..',
      duration: 10000
    });
    this.loading.present();

    this.api.loginAPI(userLogin)
      .pipe(
        takeUntil(this.unsubscribe)
      )
      .subscribe(res => {

        this.isLoginInvalid = false;
        this.isLoginInvalidOther = false;
        forkJoin([
          this.auth.deleteToken(),
          this.auth.storeUserInfo(res['access_token']),
          this.auth.storeRefreshToken(res['refresh_token'])
        ])
          .subscribe(async val => {

            if (val !== undefined) {
              this.loading.dismiss();

              if (this.saveInformation === true) {
                this.auth.storeUserLogin({
                  username: this.userName.toLowerCase(),
                  firmCode: this.firmCode,
                  saveInformation: this.saveInformation
                });
                if (this.fpAvail && !this.enabledId.value) {
                  try {

                    await this.utilities.presentAlertConfirm(this.alertController, {
                      header: this.platformIdText,
                      message: 'Do you want to set up ' + this.platformIdText + ' to work with this account?',
                      acceptText: 'Yes',
                      cancelText: 'No',
                      cancelHandler: x => {
                        this.navCtrl.navigateRoot('/dashboard');

                      },
                      okayHandler: async x => {
                        const resp = await this.fingerPrint.show({
                          clientId: 'aw-ec',
                          clientSecret: 'employeecenter',
                          localizedReason: 'Please authenticate', // Only iOS ,
                          disableBackup: true
                        });

                        if (resp) {
                          await this.auth.storeIdSettinginfo({value: true, user: this.userName});
                          await this.auth.storeUserLoginWithId({
                            username: this.userName.toLowerCase(), firmCode: this.firmCode, refresh: res['refresh_token']
                          });
                        } 
                        this.navCtrl.navigateRoot('/dashboard');
                      }
                    });

                  } catch (e) {
                    console.log(e);
                  }
                } else {
                  if ( this.fpAvail && this.enabledId.value && this.enabledId.user !== this.userName) {

                   } else {
                    await this.auth.storeIdSettinginfo(false);
                   }
                  
                  this.navCtrl.navigateRoot('/dashboard');
                }

              } else {
                this.auth.deleteStoredLoginInfo();
                this.navCtrl.navigateRoot('/dashboard');
              }

              // this.navCtrl.navigateRoot('/dashboard');
            }
          });
      }, (error: AppError) => {
        this.loading.dismiss();
        if (error instanceof LoginError) {

          console.log('There was an error login in: ' + error.description);
          this.isLoginInvalid = true;
        } else {
          this.isLoginInvalidOther = true;
        }
      });
  }

  public async loginWithId() {
    const resp = await this.fingerPrint.show({
      clientId: 'aw-ec',
      clientSecret: 'employeecenter',
      localizedReason: 'Please authenticate' // Only iOS 
    });
    if (resp) {
      const loginWithId = await this.auth.getUserLoginInfoWithId();

      const userLogin: UserLogin = {
        refreshToken: loginWithId.refresh
      };
      this.loading = await this.loadingCtrl.create({
        spinner: 'dots',
        message: 'Signing in..',
        duration: 10000
      });
      this.loading.present();

      try {
        const res = await this.api.refreshLoginAPI(userLogin).toPromise();
        this.isLoginInvalid = false;
        this.isLoginInvalidOther = false;
        forkJoin([
          this.auth.deleteToken(),
          this.auth.storeUserInfo(res['access_token']),
          this.auth.storeRefreshToken(res['refresh_token'])
        ])
          .subscribe(async val => {
            if (val !== undefined) {
              this.loading.dismiss();
              this.navCtrl.navigateRoot('/dashboard');
            }
          });
      } catch (error) {
        this.loading.dismiss();
        if (error instanceof LoginError) {

          console.log('There was an error login in: ' + error.description);
          this.isLoginInvalid = true;

        } else {
          this.isLoginInvalidOther = true;
        }
      }

      // .pipe(
      //   takeUntil(this.unsubscribe)
      // )
      // .subscribe(res => {
      //   console.log(res);
      //   this.isLoginInvalid = false;
      //   forkJoin([
      //     this.auth.deleteToken(),
      //     this.auth.storeUserInfo(res['access_token']),
      //     this.auth.storeRefreshToken(res['refresh_token'])
      //   ])
      //     .subscribe(async val => {
      //       if (val !== undefined) {
      //         this.loading.dismiss();
      //         this.navCtrl.navigateRoot('/dashboard');
      //       }
      //     });
      // }, (error: AppError) => {
      //   this.loading.dismiss();
      //   if (error instanceof LoginError) {

      //     console.log('There was an error login in: ' + error.description);
      //     this.isLoginInvalid = true;
      //   }
      // });
    }
  }

  public async resetProfile() {
    await this.utilities.presentAlertConfirm(this.alertController, {
      header: 'Delete current profile?',
      message: 'Are you sure you want to remove the current ' + this.platformIdText + ' profile for ' + this.enabledId.user,
      acceptText: 'Yes',
      cancelText: 'No',
      okayHandler: async x => {
        await this.auth.deleteStoredLoginIdInfo();
        this.enabledId.value = false;
        this.enabledId.user = '';
        this.cdr.detectChanges();
      }

    });
  }

  public openPrivacyPolicy() {
    const browser = this.iab.create('http://www.accountantsworld.com/Security.html', '_system'); 
  }
  public openResetPassword() {
    const path = environment.passwordResetURL +
    ( this.firmCode  ? ('?firmCode=' + this.firmCode) : ''  );
    const browser =  this.iab.create(path, '_system'); 
  }

}
