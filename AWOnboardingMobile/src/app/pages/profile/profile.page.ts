import { User } from './../../models/user';
import { NavController, LoadingController, ActionSheetController, IonContent } from '@ionic/angular';
import { Profile } from './../../models/Profile';
import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { AppError } from './../../errors/AppError';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { File } from '@ionic-native/file/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { FileInput } from '../../models/FileInput';
import { GenericApiService } from '../../services/api/generic-api.service';
import { UtilitiesService } from '../../services/utilities/utilities.service';
import { Storage } from '@ionic/storage';
declare let chooser: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss']
})
export class ProfilePage implements OnInit {

  @ViewChild(IonContent) content: IonContent;
  public profile: Profile;
  public user: User;
  private cachedProfile;
  private unsubscribe: Subject<void> = new Subject<void>();
  public toEditProfile: boolean;
  private loading;
  public loadFailed = false;

  public regex = /\$|\/hr/g;

  public states = ['AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC',
    'DE', 'FL', 'GA', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA',
    'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE',
    'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY'];


  constructor(public navCtrl: NavController, private loadingCtrl: LoadingController,
    private api: GenericApiService, private utilities: UtilitiesService,
    private cdr: ChangeDetectorRef,  private androidPermissions: AndroidPermissions,
    public actionSheetCtrl: ActionSheetController, private storage: Storage
  ) {
  }

  async ngOnInit() {
    this.loading = await this.loadingCtrl.create({
      spinner: 'dots',
      message: 'Loading profile'
    });
    this.loading.present();
    this.user = await this.storage.get('dashboard');
    this.loadProfileInformation();

  }
  ionViewWillLeave() {

    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private loadProfileInformation(): void {
    this.api.get('/employees/profile')
      .pipe(
        takeUntil(this.unsubscribe)
      )
      .subscribe(res => {
        this.profile = <Profile>res;


        this.loading.dismiss();
      }, (error: AppError) => {
        this.loading.dismiss();
        this.loadFailed = true;
        console.log('There was an error loading employee profile in the profile page: ' + error.description);
      });

  }

  private async loadProfileAsync() {
    try {
      this.profile = <Profile>await this.api.get('/employees/profile').toPromise();

      this.cdr.detectChanges();
      this.loading.dismiss();
    } catch (error) {
      this.loading.dismiss();
      console.log('There was an error loading employee profile in the profile page: ' + error.description);
    }

  }

  private editProfileInfo(): void {
    this.cachedProfile = JSON.stringify(this.profile);
    this.toEditProfile = true;
  }

  private saveEditProfile(values): void {

    this.api.put('/employees/profile/save', values)
      .pipe(
        takeUntil(this.unsubscribe)
      )
      .subscribe(res => {

        if (res) {
          this.utilities.showToast('Profile was saved', 3000, 'top', 'success');
          this.toEditProfile = false;
          this.content.scrollToTop();
        } else {
          this.utilities.showToast('Could not save profile', 3000, 'top', 'error');
        }
      }, (error: AppError) => {
        this.utilities.showToast('Could not save profile', 3000, 'top', 'error');
        console.log('There was an error saving employee profile in the profile page: ' + error.description);
      });


  }

  private cancelEditProfile() {
    this.profile = JSON.parse(this.cachedProfile);
    this.toEditProfile = false;
    this.content.scrollToTop();
  }

  private chooseFile(documentType: string): void {
    if (this.utilities.isAndroid) {
      this.handleAndroidFileUpload(documentType);



      // Observable.from(this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE]))
      //   .subscribe( x => {
      //     console.log(x);
      //     Observable.from(this.fileChooser.open())
      //     .subscribe( uri => {
      //       console.log('uri: ' + uri);
      //       console.log(this.file.externalApplicationStorageDirectory);
      //       Observable.from(this.filePath.resolveNativePath(uri))
      //       .subscribe(
      //         p => { 
      //           const path = p.substring(0, p.lastIndexOf("/") + 1);
      //           console.log(path);
      //           console.log(p);
      //           const arrays = p.split("/");
      //           Observable.from(this.file.readAsDataURL(path , arrays[arrays.length-1]))
      //           .subscribe(
      //             base64 => {
      //               console.log(base64);
      //                   // NOTE: I had to resolve the native path cause the file chooser gives you an URI with the content: path which 
      //                   // can't be accessed
      //             }, (e) => {
      //               console.log(e);
      //             });
      //         });       
      //       // let file: File = new File(uri, 'test');
      //       // let reader: FileReader = new FileReader();
      //       // reader.readAsDataURL
      //     }, (error) => {
      //       console.log(error);
      //     });            
      //   }, (e) => {
      //     console.log(e);
      //   });



    }
  }

  private async handleAndroidFileUpload(documentType: string) {
    // let fileName = '';
    // from(this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE]))
    //     .pipe(
    //       concatMap( x => from(this.fileChooser.open())),
    //       concatMap( uri =>  from(this.filePath.resolveNativePath(uri)) ),
    //       concatMap( p =>  { 
    //         const path = p.substring(0, p.lastIndexOf('/') + 1);
    //         const arrays = p.split('/');
    //         fileName =  arrays[arrays.length - 1];
    //         return from(this.file.readAsDataURL(path , fileName));
    //       }),
    //       concatMap( dataURL =>  { 
    //         const fileInput: FileInput =  {
    //           employeeName: this.profile.name,
    //           employeeNo: this.profile.employeeNumber,             
    //           documentType: documentType,
    //           fileName: fileName,
    //           fileContent: dataURL,
    //           reduceImageSize: false
    //         };
    //         return this.api.uploadFile('/employees/upload', fileInput);
    //       })

    //     )
    //     .pipe(
    //       takeUntil(this.unsubscribe)
    //     )
    //     .subscribe(
    //       res => {
    //         console.log(res);
    //       }, (e) => {
    //         console.log(e);
    //       }
    //     );
    try {
      const permission = await this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE]);

      const file = await chooser.getFile('application/pdf');


      if (file !== undefined) {
        const fileInput: FileInput = {
          employeeName: this.profile.name,
          employeeNo: this.profile.employeeNumber,
          documentType: documentType,
          fileName: file.name,
          fileContent: file.dataURI.slice(28),
          reduceImageSize: false
        };



        this.loading = await this.loadingCtrl.create({
          spinner: 'dots',
          message: 'Uploading file...'
        });
        this.loading.present();

        const uploadResp = await this.api.uploadFile('/employees/upload', fileInput).toPromise();


        this.loading.dismiss();
        if (uploadResp) {
          this.utilities.showToast('Document was uploaded', 3000, 'top', 'success');
        } else {
          this.utilities.showToast('Document could not be uploaded', 3000, 'top', 'error');
        }

      }
    } catch (e) {
      this.loading.dismiss();
      this.utilities.showToast('Error uploading doucument', 3000, 'top', 'error');
      console.log('There was an error uploading the file: ' + e);
    }

    // from(this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE]))
    //     .pipe(
    //       concatMap( async x =>  {
    //        const file = await chooser.getFile();
    //        console.log(file);
    //        if ( file !== undefined) {
    //         const fileInput: FileInput =  {
    //           employeeName: this.profile.name,
    //           employeeNo: this.profile.employeeNumber,             
    //           documentType: documentType,
    //           fileName: file.name,
    //           fileContent: file.dataURI,
    //           reduceImageSize: false
    //         };


    //         console.log(file.dataURI.slice(23));
    //         // this.api.uploadFile('/employees/upload', fileInput).subscribe(
    //         //   res => {
    //         //     console.log(res);
    //         //   }
    //         // );
    //        } 
    //       })         
    //       // concatMap( files =>  { 
    //       //   console.log(files);
    //       //   return files;
    //       //   // const fileInput: FileInput =  {
    //       //   //   employeeName: this.profile.name,
    //       //   //   employeeNo: this.profile.employeeNumber,             
    //       //   //   documentType: documentType,
    //       //   //   fileName: files.name,
    //       //   //   fileContent: dataURL,
    //       //   //   reduceImageSize: false
    //       //   // };
    //       //   // return this.api.uploadFile('/employees/upload', fileInput);
    //       // })       
    //     )
    //     .pipe(
    //       takeUntil(this.unsubscribe)
    //     )
    //     .subscribe(
    //       res => {
    //         console.log(res);
    //       }, (e) => {
    //         console.log(e);
    //       }
    //     );
  }


  private async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Document Type',
      buttons: [
        {
          text: 'W-2',
          handler: () => {

            this.chooseFile('W2');
          }
        },
        {
          text: 'W-4',
          handler: () => {

            this.chooseFile('W4');
          }
        },
        {
          text: 'I-9',
          handler: () => {

            this.chooseFile('I9');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {

          }
        }
      ]
    });
    await actionSheet.present();
  }

  public getConsentPrompt(profile: Profile) {
    if (profile.isContractor) {
      return '1099 Electronic Consent';
    } else {
      return 'W-2 Electronic Consent';
    }
  }

  public async doRefresh(event) {
    await this.loadProfileAsync();
    event.target.complete();
  }

}
