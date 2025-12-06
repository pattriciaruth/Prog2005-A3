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
    header: 'How to Use This Page',
    message: this.helpText,
    buttons: ['OK']
  });
  await alert.present();
}

helpText = `
• This page displays all items currently stored in the inventory database.<br><br>
• Tap an item to view its details (optional feature).<br>
• Use the search bar to quickly locate items by name.<br>
• Pull down to refresh the list at any time.<br><br>
Note: Items come directly from the backend server.
`;

}
