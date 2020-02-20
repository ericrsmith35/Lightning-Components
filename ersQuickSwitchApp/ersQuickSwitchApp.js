import { LightningElement, api, track, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
const FIELDS = [
    'QuickAppSwitcher__mdt.AppAPINames__c',
    'QuickAppSwitcher__mdt.AppImageNames__c',
    'QuickAppSwitcher__mdt.AppAlternateTexts__c',
];
import { NavigationMixin } from 'lightning/navigation';
import APP_IMAGES from '@salesforce/resourceUrl/App_Images';

export default class ErsQuickSwitchApp extends NavigationMixin(LightningElement) {

    @api recordId;          // Current Record ID
    @api choiceApps;        // List of App API Names
    @api choiceImages;      // List of image names from /images/ sub-directory in the APP_Images Static Resource
    @api choiceAltTexts;    // List of Alternate Text values for the images
    @api quickAppSwitcherId;    // Record Id of the QuickAppSwitcher metadata record
    @api backgroundColor = "transparent";   // Background color for the component

    @api inputApps = "";
    @api inputImages = "";
    @api inputAltTexts = "Alternate Text";
    @api altText = "";
    @track apps = [];
    @track avatar = "slds-avatar slds-avatar--large slds-m-right_small";  // Default display class
    @track mdtValues = {};

    @api mdtId = this.quickAppSwitcherId;
    // console.log('mdtId-', this.mdtId);
    @wire(getRecord, { recordId: 'm0G6C0000008PRI', fields: FIELDS })
    metadatarecord({error, data}) {
        if(data) {
            console.log('data-', data);
            let mdtData = data.fields;
            console.log('mdtData', mdtData);
            this.mdtValues = {
                inputApps : mdtData.AppAPINames__c.value,
                inputImages : mdtData.AppImageNames__c.value,
                // inputAltTexts : mdtData.AppAlternateTexts.value,
                inputAltTexts : 'alt text',
            }
            console.log('mdtValues', this.mdtValues);
//
            let index = 0;
            let apps = [];
    
            // lightning__RecordPage does not allow parameters to be passed into a list variable
            // so we need to parse the entries here
            this.choiceApps = this.mdtValues.inputApps.split(',');
            this.choiceImages = this.mdtValues.inputImages.split(',');
            this.choiceAltTexts = this.mdtValues.inputAltTexts.split(',');
            console.log('CA-', this.choiceApps);
            // Create the attributes for each list item
            this.choiceApps.forEach(app => {
                let selection = index + 1;
                this.altText = (this.choiceAltTexts[index]) ? this.choiceAltTexts[index] : 'Selection #' + selection;
                apps.push({
                    index: index,
                    name: this.choiceApps[index],
                    image: APP_IMAGES + '/images/' + this.choiceImages[index],
                    altText: this.altText
                });
                index += 1;
            });
            this.apps = apps;
//
        }
        else if(error) {
            window.console.log('error ====> '+JSON.stringify(error))
        }
    // }

    // connectedCallback() {
        // let index = 0;
        // let apps = [];

        // // lightning__RecordPage does not allow parameters to be passed into a list variable
        // // so we need to parse the entries here
        // this.choiceApps = this.inputApps.split(',');
        // this.choiceImages = this.inputImages.split(',');
        // this.choiceAltTexts = this.inputAltTexts.split(',');
        // console.log('CA-', this.choiceApps);
        // // Create the attributes for each list item
        // this.choiceApps.forEach(app => {
        //     let selection = index + 1;
        //     this.altText = (this.choiceAltTexts[index]) ? this.choiceAltTexts[index] : 'Selection #' + selection;
        //     apps.push({
        //         index: index,
        //         name: this.choiceApps[index],
        //         image: APP_IMAGES + '/images/' + this.choiceImages[index],
        //         altText: this.altText
        //     });
        //     index += 1;
        // });
        // this.apps = apps;
    }

    handleHover(event) {
        // Display image as the avatar Circle variant
        var app = this.apps.find(app => app.index == event.target.dataset.key);
        app.avatar = "slds-avatar slds-avatar--circle slds-avatar--large slds-m-right_small";
        this.apps = [...this.apps];
    }

    handleMouseOut(event) {
        // Display image as the default Square avatar
        var app = this.apps.find(app => app.index == event.target.dataset.key);
        app.avatar = "slds-avatar slds-avatar--large slds-m-right_small";
        this.apps = [...this.apps];
    }

    navigateToAppPage(event) {

        // Get the attributes for the selected App
        var app = this.apps.find(app => app.index == event.target.dataset.key);

        // Navigate to the specified App and App Page for the same Record
        this[NavigationMixin.Navigate]({
            type: "standard__app",
            attributes: {
                appTarget: app.name,
                pageRef: {
                    type: "standard__recordPage",
                    attributes: {
                        recordId: this.recordId,
                        objectApiName: 'Case',  // Doesn't matter if this Object name doesn't match the Record Id
                        actionName: "view"
                    }
                }
            }
        })
    }
    
    get backgroundStyle() {
        return "background-color: " + this.backgroundColor;
    }
}