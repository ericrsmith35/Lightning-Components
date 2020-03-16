import { LightningElement, api, track, wire } from 'lwc';
// import { FlowAttributeChangeEvent, FlowNavigationNextEvent } from 'lightning/flowSupport';
import getReturnResults from '@salesforce/apex/SObjectController.getReturnResults';

const MYDOMAIN = 'https://' + window.location.hostname.split('.')[0].replace('--c','');

export default class DatatableLwcFsc extends LightningElement {

    // Component Input & Output Attributes
    @api tableData;
    @api columnFields;
    @api columnDefinitions; //Remove this line and update the test flow
    @api columnIcons = [];
    @api keyField = 'Id';
    @api preSelectedRows = [];
    @api hideCheckboxColumn;
    @api singleRowSelection;
    @api suppressBottomBar;
    @api outputSelectedRows = [];
    @api outputEditedRows = [];

    // Other Datatable attributes
    @api sortedBy;
    @api sortedDirection;
    @api maxRowSelection;
    @track columns = [];
    @track mydata = [];
    @track selectedRows = [];

    // Handle Lookup Field Variables   
    @api lookupId;
    @api objectName;
    @track lookupName;

    // Component working variables
    @api savePreEditData = [];
    @track showSpinner = true;
    @api errorApex;
    @api dtableColumnFieldDescriptorString;

    connectedCallback() {
        // Process Column Details and Data

        // getColumnData({ records: this.tableData, fields: this.columnFields})
        // .then(result => {

        // })
        // .catch(error => {
        //     console.log('Get Object Name Error: ' + JSON.stringify(error));
        //     this.errorApex = 'Apex Error: ' + error.body.message;
        //     return this.errorApex;
        // });

        // Build Column Definitions 
        // (This could change depending on how I build the Custom Property Editor)
        // Current Format is column attributes separated by , and columns separated by |
        // let columnNumber = 0;
              
        // Handle pre-selected records
        this.outputSelectedRows = this.preSelectedRows;
        const selected = JSON.parse(JSON.stringify([...this.preSelectedRows]));
        selected.forEach(record => {
            this.selectedRows.push(record[this.keyField]);            
        });

        // Parse special icon attribute
        const icons = [];
        const parseIcons = (this.columnIcons.length > 0) ? this.columnIcons.split(',') : [];
        parseIcons.forEach(icon => {
            icons.push({
                column: Number(icon.split(':')[0])-1,
                icon: icon.slice(icon.search(':')+1)
            });
        });

        // Set other initial values here
        this.maxRowSelection = (this.singleRowSelection) ? 1 : this.tableData.length;
        console.log('Processing Datatable');
        this.processDatatable();
    }

    processDatatable() {
        // Call Apex Controller and get Column Definitions and update Row Data
        getReturnResults({ records: this.tableData, fieldNames: this.columnFields })
        .then(result => {
            let returnResults = JSON.parse(result);
            this.dtableColumnFieldDescriptorString = returnResults.dtableColumnFieldDescriptorString;
            console.log('columnString: ' + this.dtableColumnFieldDescriptorString);
            // this.columns = JSON.parse(this.datatableColumnFieldDescriptorString);
            this.columns = this.dtableColumnFieldDescriptorString;
            console.log('columns: ', this.columns);

            this.mydata = [...returnResults.rowData];
            console.log('mydata: ', this.mydata);
            // this.rowData = this.generateRowData(returnResults.rowData);

            this.showSpinner = false;
        })
        .catch(error => {
            console.log('getReturnResults error is: ' + JSON.stringify(error));
            this.errorApex = 'Apex Action error: ' + error.body.message;
            return this.errorApex; 
        });
    }

        // // Parse column definitions
        // const cols = [];
        // const colEachDef = this.columnDefinitions.split('|');
        // console.log('colEachDef:',colEachDef);
        // let lufield = '';
        // let lookupFields = [];
        // let lookups = [];
        // colEachDef.forEach(colDef => {
        //     let colAttrib = colDef.split(',');
        //     let iconAttrib = icons.find(i => i['column'] == columnNumber);
        //     let label = colAttrib[0];
        //     let fieldName = colAttrib[1];
        //     let type = colAttrib[2].toLowerCase();
        //     let typeAttributes = colAttrib[3];
        //     let editable = colAttrib[4].toLowerCase() === 'true';
        //     let initialWidth = Number(colAttrib[5]);

        //     // Change lookup to url and reference the new fields that will be added to the datatable object
        //     if(type == 'lookup') {
        //         type = 'url';
        //         lookupFields.push(fieldName);
        //         if(fieldName.toLowerCase().endsWith('id')) {
        //             lufield = fieldName.replace(/Id$/gi,'');
        //         } else {
        //             lufield = fieldName.replace(/__c$/gi,'__r');
        //         }
        //         fieldName = lufield + '_lookup';
        //         typeAttributes = { label: { fieldName: lufield + '_name' }, target: '_blank' };
        //         lookups.push(lufield);
        //     }

        //     cols.push({
        //         label: label,
        //         iconName: (iconAttrib) ? iconAttrib.icon : null,
        //         fieldName: fieldName,
        //         type: type,
        //         typeAttributes: typeAttributes,
        //         editable: editable,
        //         sortable: 'true',
        //         initialWidth: initialWidth
        //     });
        //     columnNumber += 1;
        // });
        // this.columns = cols;
        // console.log('columns:',this.columns);

    //     // Process Incoming Data Collection
    //     let data = (this.tableData) ? JSON.parse(JSON.stringify([...this.tableData])) : [];

    //     // Call Apex to get Name values for all Lookup Id values
    //     getRowData({
    //         records: data,
    //         fields: lookupFields
    //     })
    //     .then(result => {
    //         data = [...result];
    //         let field = '';
    //         data.forEach(record => {
    //             // Flatten returned data
    //             lookups.forEach(lookup => {
    //                 record[lookup + '_name'] = record[lookup]['Name'];
    //                 record[lookup + '_id'] = record[lookup]['Id'];
    //                 // Add new column with correct Lookup urls - the correct record will load even though the object name shows Account
    //                 record[lookup + '_lookup'] = MYDOMAIN + '.lightning.force.com/lightning/r/Account/' + record[lookup + '_id'] + '/view';
    //             });                

    //             // If needed, add more fields to datatable records
    //             // (Useful for Custom Row Actions/Buttons)
    //             // record['addField'] = 'newValue';

    //         });

    //         // Set table data attributes
    //         this.selectedRows = [...this.selectedRows];
    //         this.mydata = [...data];
    //         this.savePreEditData = [...this.mydata];
    //         console.log('selectedRows',this.selectedRows);
    //         console.log('keyField:',this.keyField);
    //         console.log('tableData',this.tableData);
    //         console.log('mydata:',this.mydata);

    //         // Set other initial values here
    //         if (this.singleRowSelection) this.maxRowSelection = 1;
    //         this.showSpinner = false;
    //     })
    //     // Apex failure message
    //     .catch(error => {
    //         console.log('getRowData Error:', error);
    //         this.showSpinner = false;
    //     });
    // }

    // createColumns() {
    //     var fullColumns = '';
    //     // fullColumns = this.createCustomColumns() + this.datatableColumnFieldDescriptorString + this.addRowActionMenu() + ']';
    //     console.log('columns set to ' + fullColumns);
    //     this.columns = JSON.parse(fullColumns);
    // }

    // createCustomColumns() {
    //     var columnDescriptor = '{"label": "Submitter", "fieldName": "Submitter", "type": "text"}';
    //     columnDescriptor = columnDescriptor + ',{"label": "Record Name", "fieldName": "RecordURL", "type": "url", "typeAttributes": { "label": { "fieldName": "RecordName"}, "target": "_blank" }  }';
    //     columnDescriptor = '[' + columnDescriptor ;
    //     return columnDescriptor;
    //     //given an object and a field name, find the type and label and return a valid string structure
    // }

    // getFieldDefinitions() {
    //     // Call Apex and get information about the Object's Fields
    //     getFieldData({ objectName: this.objectName, fieldNames: this.columnFields})
    //     .then(result => {

    //     })
    //     .catch(error => {
    //         console.log('Get Field Data Error: ' + JSON.stringify(error));
    //         this.errorApex = 'Apex Error: ' + error.body.message;
    //         return this.errorApex;
    //     });
    // }

    handleRowAction(event) {
        // Process the row actions here
        const action = event.detail.action;
        const row = JSON.parse(JSON.stringify(event.detail.row));
        const keyValue = row[this.keyField];
        this.mydata = this.mydata.map(rowData => {
            if (rowData[this.keyField] === keyValue) {
                switch (action.name) {
                    // case 'action': goes here
                        //
                        // break;
                    default:
                }
            }
            return rowData;
        });
    }

    handleSave(event) {
        // Only used with inline editing
        const draftValues = event.detail.draftValues;
        console.log('draftValues',draftValues);
        let data = [...this.mydata];
        // apply drafts to mydata
        data = data.map(item => {
            const draft = draftValues.find(d => d[this.keyField] == item[this.keyField]);
            console.log('draft',draft);
            if (draft != undefined) {
                let fieldNames = Object.keys(draft);
                fieldNames.forEach(el => item[el] = draft[el]);
            }
            return item;
        }); 
        // Set output attribute values
        this.outputEditedRows = [...data];
        // Resave the current table values
        this.savePreEditData = [...data];
        // Reset the current table values
        this.mydata = [...data];
        // Force clearing of the edit highlights
        this.columns = [...this.columns];
    }

    cancelChanges(event) {
        // Only used with inline editing
        this.mydata = [...this.savePreEditData];
    }

    handleRowSelection(event) {
        // Only used with row selection
        // Update values to be passed back to the Flow
        this.outputSelectedRows = event.detail.selectedRows;
        console.log('outputselectedrows',this.outputSelectedRows);
    }
   
    updateColumnSorting(event) {
        console.log('Sort:',event.detail.fieldName,event.detail.sortDirection);
        // Handle column sorting
        this.sortedBy = event.detail.fieldName;
        this.sortedDirection = event.detail.sortDirection;
        let fieldValue = row => row[this.sortedBy] || '';
        let reverse = this.sortedDirection === 'asc'? 1: -1;
        this.mydata = [...this.mydata.sort(
            (a,b)=>(a=fieldValue(a),b=fieldValue(b),reverse*((a>b)-(b>a)))
        )];
    }

    // handleGoNext() {
    //     console.log('gonext',this.selectedRows);
    //     // Update values to be passed back to the Flow
    //     const attributeChangeEvent = new FlowAttributeChangeEvent('outputSelectedRows', [...this.selectedRows]);
    //     this.dispatchEvent(attributeChangeEvent);
    //     // check if NEXT is allowed on this screen
    //     if (this.availableActions.find(action => action === 'NEXT')) {
    //         // navigate to the next screen
    //         const navigateNextEvent = new FlowNavigationNextEvent();
    //         this.dispatchEvent(navigateNextEvent);
    //     }
    // }

}