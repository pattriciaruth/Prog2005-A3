import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
  standalone: false,
})
export class Tab4Page {

  constructor(private alertCtrl: AlertController) {}

  async showHelp() {
    const alert = await this.alertCtrl.create({
      header: 'Help – Privacy & Security',
      message: `
        This page explains the key privacy and security requirements for mobile applications,
        especially those handling customer or inventory data. 
        Review each section to gain an understanding of how your app protects user information.
      `,
      buttons: ['OK']
    });
    await alert.present();
  }
}
