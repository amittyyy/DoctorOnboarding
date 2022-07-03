# Mobile Applications Programmers Guide 
Amit Timalsina, Ambrogio Cazzaniga - 6/19/2019

## TFS

  | Location                  | Description                                                         |
  | ------------------------- | ------------------------------------------------------------------- |
  | \$/employee-center-mobile | (Mobile application, depends on aw-login and Payroll-API)           | 
  | \$/aw-login               |  (old authentication app)                                           | 
  | \$/Payroll-API            | (API for Mobile application employee-center-mobile)                 | 
  |                           |                                                                     | 
  | \$/Push-Notifications     | (Console application to send notification to phones using FireBase) | 


## Software Environment Setup 

  1. Git 
  2. Java jdk -jdk1.8.0_211 (Set Env. Variable: JAVA_HOME to C:\Program Files\Java\jdk1.8.0_211) 
  3. Install Android studio 
  4. Install npm from https://www.npmjs.com/get-npm
  
          Once npm is installed install the following by running the following commands: 
          npm install -g cordova npm 
          npm install -g angular/cli@6.1.1 
          npm install -g ionic 

## Suggested IDE: VS Code  

  Extensions:  
  1. Angular Language Service
  2. Auto Import

## Documents 

Documents in SharePoint
1. [Development>Documents>MobileApps>Mobile Keys and Credentials](https://accountantsworldllc.sharepoint.com/:f:/g/Development/ElFII5q2xiVNpbPDW3HFo0cBXr8a8zTfjQ_Gk4vHpgT14Q?e=mh7S8s)
2. [Credentials.txt](https://accountantsworldllc.sharepoint.com/:f:/g/Development/ElFII5q2xiVNpbPDW3HFo0cBXr8a8zTfjQ_Gk4vHpgT14Q?e=mh7S8s)


## Application Info 
C:\Tfs\Employee-center-mobile\config.xml 
Identify images for app, and permission for camera, etc. 
 

## Android Build, Signing and Deployment 

https://ionicframework.com/docs/intro/deploying/ 
https://ionicframework.com/docs/v3/intro/deploying/ 

C:\Tfs\Employee-center-mobile\platforms\android\app\build\outputs\apk 

|Build|Command|Package location|
|-|-|-|
|*Debug:*   |ionic cordova build android           | C:\Tfs\Employee-center-mobile\platforms\android\app\build\outputs\apk\debug\app-debug.apk             |
|*Release:* |ionic cordova build --release android | C:\Tfs\Employee-center-mobile\platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk| 

### Signing 

1. Android: signing key password : aw2321040 
2. Open: cmd.exe as admin 
3. cd C:\Program Files\Java\jdk1.8.0_211\bin 
4. Copy apk file and key file into it 

### Release 

1. cd C:\Program Files\Java\jdk1.8.0_211\bin 
2. jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.jks app-release-unsigned.apk my-alias 
3. C:\Users\ambrogioc\AppData\Local\Android\Sdk\build-tools\28.0.3\zipalign.exe -v 4 app-release-unsigned.apk app-release-signed.apk 
4. C:\Users\ambrogioc\AppData\Local\Android\Sdk\build-tools\28.0.3\apksigner verify app-release-signed.apk 

(Warnings are ok) 

## Run Application 

1. *Run in browser:* ionic serve 
2. *Run emulator:* ionic cordova emulate android 
3. *Run emulator (live):* ionic cordova emulate android –l 

If Emulator does not work try: 

1. PS C:\Tfs\Employee-center-mobile> Cordova platform rm android 
2. PS C:\Tfs\Employee-center-mobile> Cordova platform add android 
3. Change: C:\Tfs\Employee-center-mobile\platforms\android\app\src\main\AndroidManifest.xml 
4. Add: <activity android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale" 
android:label="@string/activity_name" android:launchMode="singleTop" android:name="MainActivity" 
android:screenOrientation="portrait"android:theme="@android:style/Theme.DeviceDefault.NoActionBar" *android:windowSoftInputMode="adjustResize"*> 
 

## Phone manual installation 

1. Connect phone to USB 
2. Copy apk to directory on phone 
3. On phone: uninstall previous version, find copied apk, double click to install 


## Phone Google Play installation 

Google Play store login

1. https://play.google.com/apps/publish/?account=8255834637912778368#AppListPlace 
2. Click: Employee Portal Payroll Relief 
3. Must be a signed apk 
4. Release apk 
5. Release management -> App releases -> Internal test track -> Manage 
6. Add apk to Production track (we should try to use other testing tracks 
 

## FireBase (Phone notifications) 

https://console.FireBase.google.com/u/0/ 

One app per platform 

Android 
1. Copy google-services.json from FireBase to C:\Tfs\Employee-center-mobile and C:\Tfs\Employee-center-mobile\platforms\android\app 

IOS 
1. COPY GoogleService-Info.plist FROM FireBase to (team id has to match 5XHV282W84 in the apple app developer account)  

C:\Tfs\Employee-center-mobile 
              And on the Mac  

Phone dash board request register user/employee into tblemployeesfrebase.. 
 

## PUSHNOTIFICATION CONSOLE APP (send the "you got paid" notification) 

Run in window scheduler  


## Other
npm uninstall -g angular/cli  
npm update 
ng -version angular/cli 

https://ionicframework.com/docs/v3/intro/deploying/ 

 

 