import { LightningElement, api, track, wire } from 'lwc';
// import { FlowAttributeChangeEvent, FlowNavigationNextEvent } from 'lightning/flowSupport';
import getReturnResults from '@salesforce/apex/SObjectController.getReturnResults';

const MYDOMAIN = 'https://' + window.location.hostname.split('.')[0].replace('--c','');

export default class DatatableLwcFsc extends LightningElement {

    // Component Input & Output Attributes
    @api tableData;
    @api columnFields;
    @api columnEdits = '';
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
    @api errorApex;
    @api dtableColumnFieldDescriptorString;
    @api basicColumns = [];
    @api edits = [];
    @api isEditAttribSet = false;
    @api editAttribType = 'none';
    @api icons = [];
    @api lookups = [];
    @api recordData = [];
    @track showSpinner = true;

    connectedCallback() {
         
        // Handle pre-selected records
        this.outputSelectedRows = this.preSelectedRows;
        const selected = JSON.parse(JSON.stringify([...this.preSelectedRows]));
        selected.forEach(record => {
            this.selectedRows.push(record[this.keyField]);            
        });

        // Parse special Column Edit attribute
        if (this.columnEdits.toLowerCase() != 'all') {
            const parseEdits = (this.columnEdits.length > 0) ? this.columnEdits.split(',') : [];
            this.editAttribType = 'none';
            parseEdits.forEach(edit => {
                let colEdit = (edit.slice(edit.search(':')+1).toLowerCase() == 'true') ? true : false;
                this.edits.push({
                    column: Number(edit.split(':')[0])-1,
                    edit: colEdit
                });
                this.editAttribType = 'cols';
            });
        } else {
            this.editAttribType = 'all';
        }

        // Parse special Column Icon attribute
        const parseIcons = (this.columnIcons.length > 0) ? this.columnIcons.split(',') : [];
        parseIcons.forEach(icon => {
            this.icons.push({
                column: Number(icon.split(':')[0])-1,
                icon: icon.slice(icon.search(':')+1)
            });
        });

        // Generate datatable
        if (this.tableData) {

            // Set other initial values here
            this.maxRowSelection = (this.singleRowSelection) ? 1 : this.tableData.length;

            console.log('Processing Datatable');
            this.processDatatable();

        } else {
            this.showSpinner = false;
        }
    }

    processDatatable() {
        // Call Apex Controller and get Column Definitions and update Row Data
        let data = (this.tableData) ? JSON.parse(JSON.stringify([...this.tableData])) : [];
        getReturnResults({ records: data, fieldNames: this.columnFields })
        .then(result => {
            let returnResults = JSON.parse(result);
console.log('recordData',[...returnResults.rowData]);
            // Update row data for lookup fields
            this.recordData = [...returnResults.rowData];
            this.lookups = returnResults.lookupFieldList;
            this.objectName = returnResults.objectName;
            this.updateLookups();

            // Basic column info (label, fieldName, type) taken from the Schema in Apex
            this.dtableColumnFieldDescriptorString = '[' + returnResults.dtableColumnFieldDescriptorString + ']';
            this.basicColumns = JSON.parse(this.dtableColumnFieldDescriptorString);

            // Custom column processing
            this.updateColumns();

            // Done processing the datatable
            this.showSpinner = false;
        })
        .catch(error => {
            console.log('getReturnResults error is: ' + JSON.stringify(error));
            this.errorApex = 'Apex Action error: ' + error.body.message;
            return this.errorApex; 
        });
    }

    updateLookups() {
        // Process Incoming Data Collection
        let data = (this.recordData) ? JSON.parse(JSON.stringify([...this.recordData])) : [];
        let lookupFields = this.lookups;
        let lufield = '';

        data.forEach(record => {
            // Flatten returned data
            lookupFields.forEach(lookup => {
                if(lookup.toLowerCase().endsWith('id')) {
                    lufield = lookup.replace(/Id$/gi,'');
                } else {
                    lufield = lookup.replace(/__c$/gi,'__r');
                }                
                record[lufield + '_name'] = record[lufield]['Name'];
                record[lufield + '_id'] = record[lufield]['Id'];
                // Add new column with correct Lookup urls
                record[lufield + '_lookup'] = MYDOMAIN + '.lightning.force.com/lightning/r/' + this.objectName + '/' + record[lufield + '_id'] + '/view';
            });                

            // If needed, add more fields to datatable records
            // (Useful for Custom Row Actions/Buttons)
            // record['addField'] = 'newValue';

        });

        // Set table data attributes
        this.mydata = [...data];
        this.savePreEditData = [...this.mydata];
        // this.savePreEditData = [...this.tableData];
        console.log('selectedRows',this.selectedRows);
        console.log('keyField:',this.keyField);
        console.log('tableData',this.tableData);
        console.log('mydata:',this.mydata);
    }

    updateColumns() {
        // Parse column definitions
        let columnNumber = 0;
        const cols = [];
        let lufield = '';
        this.basicColumns.forEach(colDef => {

            // Standard parameters
            let label = colDef['label'];
            let fieldName = colDef['fieldName'];
            let type = colDef['type'];
            let typeAttributes = '';
            let editAttrib = [];

            // Update Edit attribute overrides by column
            switch (this.editAttribType) {
                case 'cols':
                    editAttrib = this.edits.find(i => i['column'] == columnNumber);
                    break;
                case 'all': 
                    // editAttrib = [{'column': columnNumber, 'edit': true}];
                    editAttrib.edit = true;
                    break;
                default:
                    editAttrib.edit = false;
            }
            // Update Icon attribute overrides by column
            let iconAttrib = this.icons.find(i => i['column'] == columnNumber);

            // Update Width attribute overrides by column

            // Change lookup to url and reference the new fields that will be added to the datatable object
            if(type == 'lookup') {
                type = 'url';
                // lookupFields.push(fieldName);
                if(fieldName.toLowerCase().endsWith('id')) {
                    lufield = fieldName.replace(/Id$/gi,'');
                } else {
                    lufield = fieldName.replace(/__c$/gi,'__r');
                }
                fieldName = lufield + '_lookup';
                typeAttributes = { label: { fieldName: lufield + '_name' }, target: '_blank' };
            }

            // Save the updated column definitions
            cols.push({
                label: label,
                iconName: (iconAttrib) ? iconAttrib.icon : null,
                fieldName: fieldName,
                type: type,
                typeAttributes: typeAttributes,
                editable: (editAttrib) ? editAttrib.edit : false,
                sortable: 'true',
                // initialWidth: initialWidth
            });

            // Repeat for next column
            columnNumber += 1;
        });
        this.columns = cols;
        console.log('columns:',this.columns);
    }

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
        let data = [...this.mydata];
        // apply drafts to mydata
        data = data.map(item => {
            const draft = draftValues.find(d => d[this.keyField] == item[this.keyField]);
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