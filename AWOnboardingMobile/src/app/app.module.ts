import { Camera } from '@ionic-native/camera/ngx';
import { RedirectGuardService } from './guards/redirect-guard.service';
import { AuthGuardService } from './guards/auth-guard.service';
import { FCM } from '@ionic-native/fcm/ngx';
import { Device } from '@ionic-native/device/ngx';
import { JwtInterceptor } from './interceptors/JwtInterceptor';
import { TokenInterceptor } from './interceptors/TokenInterceptor';
import { FilePath } from '@ionic-native/file-path/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, RouteReuseStrategy, Routes } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthenticationService } from './services/authentication/authentication.service';
import { GenericApiService } from './services/api/generic-api.service';
import { UtilitiesService } from './services/utilities/utilities.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { CustomErrorHandler } from './services/ErrorHandling/error-handler.service';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, BrowserAnimationsModule, IonicModule.forRoot({
    menuType: 'overlay',
    scrollAssist: true
  }),
    AppRoutingModule, HttpClientModule,
    IonicStorageModule.forRoot()
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthenticationService,
    GenericApiService,
    UtilitiesService,
    AndroidPermissions,
    AuthGuardService,
    RedirectGuardService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    File,
    FCM,
    FileOpener,
    FilePath,
    PhotoViewer,
    Camera,
    FingerprintAIO,
    Device,
    InAppBrowser,
    Keyboard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    {
      provide: ErrorHandler,
      useClass: CustomErrorHandler,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
