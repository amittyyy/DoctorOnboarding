
import { User } from './../../models/user';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Storage } from '@ionic/storage';
import { from, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private user: User;
  private helper = new JwtHelperService();

  constructor(private storage: Storage) {

  }

  public storeUserInfo(token: string) {

    return from(this.storage.set('access_token', token));
  }
  public storeUserLogin(info) {

    return from(this.storage.set('loginInfo', info));
  }
  public storeUserLoginWithId(info) {

    return this.storage.set('loginInfoId', info);
  }
  public storeIdSettinginfo(info) {

    return this.storage.set('enabledId', info);
  }
  public storeRefreshToken(refreshToken: string) {
    return from(this.storage.set('refresh_token', refreshToken));
  }
  public isTokenValid() {
    return this.getToken()
      .pipe(
        map(val => {
          return !this.helper.isTokenExpired(<string>val);
        })
      );
  }

  public getToken() {
    return from(this.storage.get('access_token'));
  }
  public getUserLoginInfo() {
    return from(this.storage.get('loginInfo'));
  }
  public getUserLoginInfoWithId() {
    return this.storage.get('loginInfoId');
  }
  public getUserEnabledIdInfo() {
    return this.storage.get('enabledId');
  }

  public async deleteToken() {
    await this.storage.remove('access_token');
    await this.storage.remove('refesh_token');
    await this.storage.remove('dashboard');
    await this.storage.remove('TaxFormDownloaded');
    await this.storage.remove('FormDownloaded');

  }
  public deleteStoredLoginInfo() {
    this.storage.remove('loginInfo');
  }
  public async deleteStoredLoginIdInfo() {
    await this.storage.set('enabledId', false);
    await this.storage.remove('loginInfoId');
  }
}
