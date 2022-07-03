
import { File } from '@ionic-native/file/ngx';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppError } from '../../errors/AppError';
import { GenericApiService } from '../../services/api/generic-api.service';
import { UtilitiesService } from '../../services/utilities/utilities.service';
import { NavController, LoadingController } from '@ionic/angular';
import { Location } from '@angular/common';
import { User } from '../../models/user';
import { Storage } from '@ionic/storage';
import { FileOpener } from '@ionic-native/file-opener/ngx';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.page.html',
  styleUrls: ['./forms.page.scss'],
})
export class FormsPage implements OnInit {

  private unsubscribe: Subject<void> = new Subject<void>();
  private loading;
  public user: User;
  public forms: any[];
  public dropdownSelectedForm: any;
  public loadedForm: any;
  public emptyMessage: string;

  constructor(public navCtrl: NavController, private loadingCtrl: LoadingController,
    private api: GenericApiService, private utilities: UtilitiesService,
    public location: Location, private storage: Storage, private file: File,
    private fileOpener: FileOpener
  ) {
  }

  async ngOnInit() {
    this.loading = await this.loadingCtrl.create({
      spinner: 'dots',
      message: 'Please wait...'
    });
    this.loading.present();
    this.user = await this.storage.get('dashboard');
    this.loadForms();
  }
  ionViewWillLeave() {

    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private loadForms(): void {
    this.api.get('/employees/uploadedforms')
      .pipe(
        takeUntil(this.unsubscribe)
      )
      .subscribe(res => {
        this.forms = <any[]>res;
        this.setEmptyMessage();
        this.loading.dismiss();
      }, (error: AppError) => {
        this.loading.dismiss();
        this.utilities.showToast('Could not load forms', 3000, 'top', 'error');
        console.log('There was an error loading list of forms in the forms page: ' + error.description);
        this.navCtrl.navigateRoot('/dashboard');
      });
  }

  private setEmptyMessage(): void {
    if (this.forms.length === 0) {
      this.emptyMessage = 'You don\'t have any forms available';
    } else {
      this.emptyMessage = 'No Form Selected';
    }

  }

  private async showDocument() {

    this.loading = await this.loadingCtrl.create({
      spinner: 'dots',
      message: 'Please wait...'
    });
    this.loading.present();

    let storageValue = await this.storage.get('FormDownloaded');

    if (storageValue === undefined || storageValue !== this.dropdownSelectedForm) {


      try {
        const downloadResponse = await this.api.downloadDocuments('/employees/document/' + this.dropdownSelectedForm).toPromise();

        const blob = new Blob([downloadResponse], { type: 'application/pdf' });
        const fileEntry = await this.file.writeFile(this.file.dataDirectory, 'form.pdf', blob, { replace: true });

        this.loading.dismiss();

        storageValue = await this.storage.set('FormDownloaded', this.dropdownSelectedForm);
        // if (this.utilities.isAndroid) {
        //   console.log(fileEntry);
        //   this.photoViewer.show(URL.createObjectURL(blob),
        //     'My image title', { share: false });
        // }
        if (this.utilities.isAndroid) {

          this.fileOpener.open(fileEntry.nativeURL, 'application/pdf')
            .then(() => {

              this.loading.dismiss();
            })
            .catch(err => {
              this.loading.dismiss();
              console.error('Error openening file: ' + err);
              this.utilities.showToast('Could not open PDF', 3000, 'top', 'error');
            });
        }

      } catch (e) {
        this.loading.dismiss();
        this.utilities.showToast('Could not load form', 3000, 'top', 'error');
        console.log('There was an error loading specific form in the forms page: ' + JSON.stringify(e));
      }

    } else {

      try {
        const fileOpened = await this.fileOpener.open(this.file.dataDirectory + '/form.pdf', 'application/pdf');

        this.loading.dismiss();
      } catch (e) {
        this.loading.dismiss();
        console.error('Error opening file: ' + JSON.stringify(e));
        this.utilities.showToast('Could not open PDF', 3000, 'top', 'error');
      }
    }

  }

}
