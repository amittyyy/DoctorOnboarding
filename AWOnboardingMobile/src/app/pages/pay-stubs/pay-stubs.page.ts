
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { AppError } from './../../errors/AppError';
import { Storage } from '@ionic/storage';
import { NavController, LoadingController, IonSelect } from '@ionic/angular';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { GenericApiService } from '../../services/api/generic-api.service';
import { UtilitiesService } from '../../services/utilities/utilities.service';
import { Location } from '@angular/common';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { User } from '../../models/user';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-pay-stubs',
  templateUrl: './pay-stubs.page.html',
  styleUrls: ['./pay-stubs.page.scss'],
})
export class PayStubsPage implements OnInit {

  @ViewChild(IonSelect) select: IonSelect;
  private unsubscribe: Subject<void> = new Subject<void>();
  private loading;
  public payStubs: any[];
  public selectedPayStub: any;
  public dropdownSelectedPayStub: any;
  public selectedPaystubText: any;
  public emptyMessage: string;
  public user: User;

  constructor(public navCtrl: NavController, private loadingCtrl: LoadingController,
    private api: GenericApiService, private utilities: UtilitiesService,
    private storage: Storage, private file: File, private fileOpener: FileOpener,
    public location: Location, private route: ActivatedRoute, private cdr: ChangeDetectorRef) {

  }

  async ngOnInit() {


  }

  async ionViewWillEnter() {
    this.loading = await this.loadingCtrl.create({
      spinner: 'dots',
      message: 'Please wait...',
      duration: 10000
    });
    this.loading.present();
    this.user = await this.storage.get('dashboard');

    this.loadPaystubList();
  }

  // openFile() {
  //   if (this.plt.is('android')) {
  //     let dir = this.file.dataDirectory + '/myFile.pdf'
  //     this.fileOpener.open(dir, 'application/pdf')
  //         .then(() => console.log('File is opened'))
  //         .catch(e => console.log('Error opening file', e));
  //     // const browser = this.iab.create(dir, '_system');
  //     // browser.show();
  //   }
  //   console.log("opening");
  //   this.file.checkFile(this.file.dataDirectory, 'myFile.pdf')
  //      .then(_ => console.log('Directory exists')).catch(err => console.log('Directory doesnt exist'));

  // }

  ionViewWillLeave() {

    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private loadPaystubList(): void {
    this.api.get('/employees/paystubs')
      .pipe(
        takeUntil(this.unsubscribe)
      )
      .subscribe(res => {

        this.payStubs = <any[]>res;
        this.setEmptyMessage();
        this.loading.dismiss();

      //   this.dropdownSelectedPayStub = this.payStubs[0].value;
      //  this.selectedPaystubText = this.payStubs[0].text;
        this.route.params.subscribe(params => {
          if (params['paystubId']) {
            
            this.dropdownSelectedPayStub = params['paystubId'];

            // this.loadSpecificPayStub();
          } else {
            this.dropdownSelectedPayStub = this.payStubs[0].value;
            this.selectedPaystubText = this.payStubs[0].text;

           }

         });
      }, (error: AppError) => {
        this.loading.dismiss();
        this.utilities.showToast('Could not load pay stubs', 3000, 'top', 'error');
        console.log('There was an error loading list of paystubs in the paystubs page: ' + error.description);
        this.navCtrl.navigateRoot('/dashboard');
      });
  }

  public async loadSpecificPayStub() {

    if ( this.dropdownSelectedPayStub != null) {
      this.loading = await this.loadingCtrl.create({
        spinner: 'dots',
        message: 'Loading Pay Stub'
      });
      this.loading.present();
      this.api.post('/employees/paystubinfo', { 'paystubId': this.dropdownSelectedPayStub })
        .pipe(
          takeUntil(this.unsubscribe)
        )
        .subscribe(res => {
  
          this.selectedPayStub = <any>res;
          this.cdr.detectChanges();
          this.loading.dismiss();
        }, (error: AppError) => {
          this.utilities.showToast('Could not load pay stub information', 3000, 'top', 'error');
          console.log('There was an error loading specific pay stub in the paystubs page: ' + error.description);
          this.loading.dismiss();
        });
    }
  }

  private async downloadPDF() {

    this.loading = await this.loadingCtrl.create({
      spinner: 'dots',
      message: 'Please wait...'
    });
    this.loading.present();

    const storageValue = await this.storage.get('PDFDownloaded');

    if (storageValue === undefined || storageValue !== this.dropdownSelectedPayStub) {


      try {
        const downloadResponse = await this.api.downloadPDF('/employees/printpaystub', { 'paystubId': this.dropdownSelectedPayStub })
          .toPromise();

        const blob = new Blob([downloadResponse], { type: 'application/pdf' });
        const fileEntry = await this.file.writeFile(this.file.dataDirectory, 'paystub.pdf', blob, { replace: true });

        const storageValue2 = await this.storage.set('PDFDownloaded', this.dropdownSelectedPayStub);

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
        this.utilities.showToast('Could not download pay stub', 3000, 'top', 'error');
        console.log('There was an error loading specific pay stub in the paystubs page: ' + e);
      }
    } else {

      if (this.utilities.isAndroid) {

        try {
          const fileOpened = await this.fileOpener.open(this.file.dataDirectory + '/paystub.pdf', 'application/pdf');

          this.loading.dismiss();
        } catch (e) {
          this.loading.dismiss();
          console.error('Error opening file: ' + e);
          this.utilities.showToast('Could not open PDF', 3000, 'top', 'error');
        }

      }
    }

    // from(this.storage.get('PDFDownloaded')).subscribe(
    //   value => {

    //     if ( value === undefined || value !== this.dropdownSelectedPayStub) {
    //       console.log('Opening from API');
    //       this.api.downloadPDF('/employees/printpaystub', { 'paystubId': this.dropdownSelectedPayStub})
    //       .pipe(
    //         takeUntil(this.unsubscribe)
    //       )
    //       .subscribe( res => {
    //         console.log(res); 
    //         const blob = new Blob([res], { type: 'application/pdf' });
    //         from(this.file.writeFile(this.file.dataDirectory, 'paystub.pdf', blob, { replace: true }))
    //         .subscribe((fileEntry: any) => {
    //           console.log('File created!');
    //           from(this.storage.set('PDFDownloaded', this.dropdownSelectedPayStub));
    //           if ( this.utilities.isAndroid) {
    //             console.log(fileEntry);
    //             this.fileOpener.open(fileEntry.nativeURL, 'application/pdf')
    //             .then(() => {
    //             console.log('File is opened');
    //             this.loading.dismiss();
    //             })
    //             .catch(err => {
    //               this.loading.dismiss();
    //               console.error('Error openening file: ' + err);
    //               this.utilities.showToast('Could not open PDF', 3000, 'top', 'error');
    //             });
    //           }
    //         }, (err) => {
    //           console.error('Error creating file: ' + err);
    //           throw err;  
    //         });  

    //       }, ( error: AppError) => {
    //         this.loading.dismiss();
    //         this.utilities.showToast('Could not load pay stub information', 3000, 'top', 'error');
    //         console.log('There was an error loading specific pay stub in the paystubs page: ' + error.description);
    //       });
    //     } else {
    //       console.log('Opening from cached pdf');
    //       if ( this.utilities.isAndroid) {
    //         this.fileOpener.open(this.file.dataDirectory + '/paystub.pdf', 'application/pdf')
    //         .then(() => {
    //         console.log('File is opened');
    //         this.loading.dismiss();
    //         })
    //         .catch(err => {
    //           this.loading.dismiss();
    //           console.error('Error opening file: ' + err);
    //           this.utilities.showToast('Could not open PDF', 3000, 'top', 'error');
    //         });
    //       }
    //     }

    //   }
    // );

  }

  private getPaystubSelectText(id) {

    return this.payStubs.find(x => x.value === id);
  }
  private setEmptyMessage(): void {
    if (this.payStubs.length === 0) {
      this.emptyMessage = 'You don\'t have any pay stubs available';
    } else {
      this.emptyMessage = 'No Pay Stub Selected';
    }

  }

} 
