import { LightningElement, api, track } from 'lwc';

    // datatable columns Label, LogoUrl, NavType | UiType, DeveloperName, NamespacePrefix
    const COLUMNS = [
        {
            label: 'App Name',
            fieldName: 'Label',
            type: 'text',
            sortable: 'true',
            initialWidth: 280
        },
        {
            label: 'Nav Type',
            fieldName: 'NavType',
            type: 'text',
            sortable: 'true',
            initialWidth: 100
        },
        {
            label: 'Image Link',
            fieldName: 'LogoUrl',
            type: 'url',
            typeAttributes: { target: '_blank'},
            sortable: 'true',
            initialWidth: 550
        },
        {
            label: 'Select Apps',
            type: 'button',
            typeAttributes: { 
                label: 'Select',
                name: 'select',
                title: 'Click to Add this App to your Quick Switcher list',
                disabled: { fieldName: 'buttonDisabled' }
            },
            initialWidth: 90
        },
    ];

    const MYDATA = [
        {
            DeveloperName: '',
            Label: '',
            NavType: '',
            LogoUrl: '',
            buttonLabel: '',
            buttonDisabled: ''
        }
    ];

export default class QuickAppSwitcherDt extends LightningElement {

    @api tableData;
    @api selectedData;
    @api AppAPINames;
    @api AppImageNames;
    @api AppAlternateTexts;
    @api displayAppLabel;
    @api modalExitMode;
    @api columns = COLUMNS;
    @api keyfield = 'DeveloperName';
    @api sortedBy;
    @api sortedDirection;
    @api maxRowSelection;
    @api hideCheckboxColumn;
    @track preSelectedIds = [];
    @track mydata = MYDATA;
    @track requestImageNameModal = false;

    connectedCallback() {
        // Add fields to datatable records
        this.mydata = this.tableData.map(tableRecord => ({
            DeveloperName: tableRecord.DeveloperName,
            Label: tableRecord.Label,
            NavType: tableRecord.NavType,
            LogoUrl: tableRecord.LogoUrl,
            buttonDisabled: false        
            })
        );
        this.hideCheckboxColumn = true;
    }
   
    handleRowAction(event) {
        // Disable the button and process the record here
        const action = event.detail.action;
        const row = JSON.parse(JSON.stringify(event.detail.row));
        const keyValue = row[this.keyfield];
        this.mydata = this.mydata.map(rowData => {
            if (rowData[this.keyfield] === keyValue) {
                switch (action.name) {
                    case 'select':
                        // Call function to process the selected row
                        if (this.processRowSelection(rowData)) {    // ***** This is where I want to wait and determine if the modal was closed with Save or Cancel *****

                            // Disable the button from being selected again
                            rowData.buttonDisabled = true;

                            // If not already selected, highlight the row as selected
                            if(this.preSelectedIds.indexOf(rowData[this.keyfield]) === -1) {
                                this.preSelectedIds.push(rowData[this.keyfield]);
                                this.preSelectedIds = [...this.preSelectedIds];
                            }
                        }
                        break;

                    default:
                }
            }
            return rowData;
        });
    }

    processRowSelection(rowData) {
        // Add to the QuickSwitchApp metadata parameters
        this.displayAppLabel = rowData.Label;
        this.requestImageNameModal = true;
        return this.modalExitMode;
    }

    handleCancelModal() {
        this.requestImageNameModal = false;
        this.modalExitMode = false;
    }

    handleSaveModal() {
        this.requestImageNameModal = false;
        this.modalExitMode = true;
    }

    handleSave(event) {
        // Only used with inline editing
    }

    cancelChanges(event) {
        // Only used with inline editing
    }

    getSelectedName(event) {
        // Only used with row selection
    }
   
    updateColumnSorting(event) {
        // Handle column sorting
        this.sortedBy = event.detail.fieldName;
        this.sortedDirection = event.detail.sortDirection;
        let fieldValue = row => row[this.sortedBy] || '';
        let reverse = this.sortedDirection === 'asc'? 1: -1;
        this.mydata = [...this.mydata.sort(
            (a,b)=>(a=fieldValue(a),b=fieldValue(b),reverse*((a>b)-(b>a)))
        )];
    }

}
