import { FileOpener } from '@ionic-native/file-opener/ngx';
import { Component, OnInit } from '@angular/core';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { File } from '@ionic-native/file/ngx';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppError } from '../../errors/AppError';
import { GenericApiService } from '../../services/api/generic-api.service';
import { UtilitiesService } from '../../services/utilities/utilities.service';
import { NavController, LoadingController } from '@ionic/angular';
import { Location } from '@angular/common';
import { User } from '../../models/user';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-taxforms',
  templateUrl: './taxforms.page.html',
  styleUrls: ['./taxforms.page.scss'],
})
export class TaxformsPage implements OnInit {

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
    private photoViewer: PhotoViewer, private fileOpener: FileOpener
  ) {
  }

  async ngOnInit() {
    this.loading = await this.loadingCtrl.create({
      spinner: 'dots',
      message: 'Loading tax forms',
      duration: 30000
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
    this.api.get('/employees/taxforms')
      .pipe(
        takeUntil(this.unsubscribe)
      )
      .subscribe(res => {

        this.forms = <any[]>res;

        this.setEmptyMessage();
        this.loading.dismiss();

        if ( this.forms != null && this.forms.length > 0 ) {
          this.dropdownSelectedForm = this.forms[0].value;
        }
        
      }, (error: AppError) => {
        this.loading.dismiss();
        this.utilities.showToast('Could not load forms', 3000, 'top', 'error');
        console.log('There was an error loading list of forms in the forms page: ' + error.description);
        this.navCtrl.navigateRoot('/dashboard');
      });
  }

  private setEmptyMessage(): void {
    if (this.forms.length === 0) {
      const type = this.user.isContractor ? '1099' : 'W-2';
      this.emptyMessage = 'You don\'t have any ' + type + ' forms available';
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

    const storageValue = await this.storage.get('TaxFormDownloaded');

    if (storageValue === undefined || storageValue !== this.dropdownSelectedForm) {


      try {
        const downloadResponse = await this.api.downloadDocuments('/employees/printtaxforms/' + this.dropdownSelectedForm)
          .toPromise();

        const blob = new Blob([downloadResponse], { type: 'application/pdf' });
        const fileEntry = await this.file.writeFile(this.file.dataDirectory, 'taxform.pdf', blob, { replace: true });

        const storageValue2 = await this.storage.set('TaxFormDownloaded', this.dropdownSelectedForm);

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
        this.utilities.showToast('Could not load pay stub information', 3000, 'top', 'error');
        console.log('There was an error loading specific pay stub in the paystubs page: ' + JSON.stringify(e));
      }
    } else {

      if (this.utilities.isAndroid) {

        try {
          const fileOpened = await this.fileOpener.open(this.file.dataDirectory + '/taxform.pdf', 'application/pdf');

          this.loading.dismiss();
        } catch (e) {
          this.loading.dismiss();
          console.error('Error opening file: ' + JSON.stringify(e));
          this.utilities.showToast('Could not open PDF', 3000, 'top', 'error');
        }

      }
    }

  }

}
