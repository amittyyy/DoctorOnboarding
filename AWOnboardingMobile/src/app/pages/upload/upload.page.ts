import { FileInput } from './../../models/FileInput';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { UtilitiesService } from './../../services/utilities/utilities.service';
import { GenericApiService } from './../../services/api/generic-api.service';
import { NavController, LoadingController, ActionSheetController } from '@ionic/angular';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { User } from '../../models/user';
import { Storage } from '@ionic/storage';
import { Location } from '@angular/common';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import * as jsPDF from 'jspdf';
declare let chooser: any;

@Component({
  selector: 'app-upload',
  templateUrl: './upload.page.html',
  styleUrls: ['./upload.page.scss'],
  animations: [
    trigger('test', [
      transition('void => *', [
        state('in', style({ opacity: 1 })),
        style({ opacity: 0 }),
        animate(300)
      ]),
      transition('* => void', [
        animate(300, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class UploadPage implements OnInit {

  public user: User;
  private loading;
  private options: CameraOptions = {
    quality: 50,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    sourceType: this.camera.PictureSourceType.CAMERA,
    allowEdit: true
  };
  public usingCamera: boolean;
  public pages: any[];
  public totalSelected = 0;


  constructor(public navCtrl: NavController, private api: GenericApiService, private storage: Storage,
    private loadingCtrl: LoadingController, private utilities: UtilitiesService, private androidPermissions: AndroidPermissions,
    public actionSheetCtrl: ActionSheetController, public location: Location, private camera: Camera, private file: File,
    public sanitizer: DomSanitizer, private cdr: ChangeDetectorRef
  ) { }

  async ngOnInit() {
    this.loading = await this.loadingCtrl.create({
      spinner: 'dots',
      message: 'Please wait...'
    });
    this.loading.present();
    this.user = await this.storage.get('dashboard');

    if (!this.user.isContractor) {
      this.pages = [{ text: 'Page One', value: '' }, { text: 'Page Two', value: '' },
      { text: 'Page Three', value: '' }, { text: 'Page Four', value: '' }];
    } else {
      this.pages = [{ text: 'Page One', value: '' }, { text: 'Page Two', value: '' },
      { text: 'Page Three', value: '' }, { text: 'Page Four', value: '' }, { text: 'Page Five', value: '' },
       { text: 'Page Six', value: '' }];
    }
    this.loading.dismiss();
  }

  private chooseFile(documentType: string): void {
    if (this.usingCamera) {
      this.uploadImages(documentType);
    } else {
      this.uploadPDFFile(documentType);
    }

  }

  private async uploadPDFFile(documentType: string) {

    try {
      const permission = await this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE]);

      const file = await chooser.getFile('application/pdf');
      if (file !== undefined) {
        const fileInput: FileInput = {
          employeeName: this.user.firstName,
          employeeNo: this.user.empNum,
          documentType: documentType,
          fileName: file.name,
          fileContent: file.dataURI.slice(28),
          reduceImageSize: false
        };

        await this.uploadFile(fileInput);

      }
    } catch (e) {
      this.loading.dismiss();
      this.utilities.showToast('Error uploading doucument', 3000, 'top', 'error');
      console.log('There was an error uploading the file: ' + JSON.stringify(e));
    }
  }

  private async uploadFile(fileInput) {


    try {
      this.loading = await this.loadingCtrl.create({
        spinner: 'dots',
        message: 'Uploading file'
      });
      this.loading.present();

      const uploadResp = await this.api.uploadFile('/employees/upload', fileInput).toPromise();

      this.loading.dismiss();
      if (uploadResp) {
        this.utilities.showToast('Document was uploaded', 3000, 'top', 'success');
        return true;
      } else {
        this.utilities.showToast('Document could not be uploaded', 3000, 'top', 'error');
        return false;
      }
    } catch (e) {
      this.loading.dismiss();
      this.utilities.showToast('Document could not be uploaded', 3000, 'top', 'error');
      return false;
    }

  }

  private async presentActionSheet() {
    let btns = [];
    if (this.user.isContractor) {
      btns = [
        {
          text: 'W-9',
          handler: () => {

            this.chooseFile('W9');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {

          }
        }
      ];
    } else {
      btns = [
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
      ];
    }
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Choose Document Type',
      buttons: btns
    });
    await actionSheet.present();
  }

  private async useCamera() {
    this.usingCamera = true;
    this.pages.every(x => x.value === '');
  }

  private async getPhoto(index) {
    try {
      const imageData = await this.camera.getPicture(this.options);
      const base64Image = 'data:image/jpeg;base64,' + imageData;
      this.pages[index].value = base64Image;
      this.totalSelected++;
    } catch (e) {
      console.log(e);
    }
  }

  private async openCamera() {
    try {
      const imageData = await this.camera.getPicture(this.options);
      const base64Image = 'data:image/jpeg;base64,' + imageData;
      return base64Image;
    } catch (e) {
      console.log(e);
    }
  }

  private cancelCameraUpload() {
    this.totalSelected = 0;
    this.pages.forEach(x => {
      x.value = '';
    });
    this.usingCamera = false;
    this.cdr.detectChanges();
  }

  private async uploadImages(documentType: string) {
    const pdf = new jsPDF();

    for ( let i = 0 ; i < this.totalSelected ; i ++) {
      pdf.addImage(this.pages[i].value, 'JPEG', 10, 10, 180, 200);
      pdf.addPage();
    }

    // this.pages.forEach(x => {
    //   pdf.addImage(x.value, 'JPEG', 10, 10, 180, 200);
    //   pdf.addPage();
    // });


    const fileInput: FileInput = {
      employeeName: this.user.firstName,
      employeeNo: this.user.empNum,
      documentType: documentType,
      fileName: documentType + '.pdf',
      fileContent: pdf.output('datauristring').slice(28),
      reduceImageSize: false
    };
    const resp = await this.uploadFile(fileInput);
    if (resp) {
      this.cancelCameraUpload();
    }

  }


}
