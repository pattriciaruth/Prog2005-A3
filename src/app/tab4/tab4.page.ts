import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
  standalone: false,
})
export class Tab4Page {

  /**
   * The Privacy & Security tab contains static explanatory content
   * but also includes a floating Help button (FAB) for quick-access
   * guidance. The page does not interact with inventory data directly.
   */
  constructor(private alertCtrl: AlertController) {}

  // -------------------------------------------------------------------------
  // HELP POPUP HANDLER
  // -------------------------------------------------------------------------

  /**
   * Opens an Ionic Alert dialog containing helpful information about
   * what this page describes. Triggered when the user taps the Help FAB.
   */
  async showHelp() {
    const alert = await this.alertCtrl.create({
      header: 'How to Use This Page',
      message: this.helpText,   // descriptive information defined below
      buttons: ['OK']
    });
    await alert.present();
  }

  // -------------------------------------------------------------------------
  // HELP TEXT CONTENT
  // -------------------------------------------------------------------------

  /**
   * Informative text shown inside the Help popup.
   * Contains a high-level summary of privacy and security considerations
   * relevant to this application, such as:
   *  - Ethical handling of data
   *  - Secure communication practices
   *  - Backend protections (e.g., nondestructible “Laptop” record)
   *  - Validation and REST API usage
   *
   * This reinforces the learning outcomes of the unit regarding
   * mobile application security requirements.
   */
  helpText = `
Privacy & Security Page

• This page explains how the café inventory app handles data, protects records, and maintains secure operations.

• No personal information, customer data, or user accounts are stored or processed in this app — only inventory items such as names, categories, quantities, suppliers, and stock levels.

• All data operations (viewing, adding, updating, or deleting items) communicate only with the provided backend server using simple REST API requests. 

• The system prevents accidental removal of certain protected items. For example, the item named "Laptop" is locked on the server and cannot be deleted. 

• Inventory changes are validated before sending requests to the server to ensure data consistency and prevent invalid or corrupted entries. 

• Users should avoid sharing sensitive information in item descriptions or notes, as this app is for inventory records only, not personal data storage. 

• For security, all actions are logged server-side, and only legitimate CRUD operations are allowed through approved endpoints. 

• If you experience errors or unexpected behaviour, refresh the page and try again — this ensures the latest data is fetched securely from the server.
`;

}
