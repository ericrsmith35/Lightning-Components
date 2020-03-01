import { LightningElement, api, track, wire } from 'lwc';
// import { FlowAttributeChangeEvent, FlowNavigationNextEvent } from 'lightning/flowSupport';

const MYDOMAIN = 'https://' + window.location.hostname.split('.')[0].replace('--c','');

export default class DatatableLwcFsc extends LightningElement {

    // Component Input & Output Attributes
    @api tableData;
    @api columnDefinitions;
    @api columnIcons = [];
    @api columnLookups = [];
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
    @api originalFieldName = [];
    @track lookupName;

    // Component working variables
    @api savePreEditData = [];

    connectedCallback() {
        // Build Column Definitions 
        // (This could change depending on how I build the Custom Property Editor)
        // Current Format is column attributes separated by , and columns separated by |
        let columnNumber = 0;

        // Parse icon attribute
        const icons = [];
        const parseIcons = (this.columnIcons.length > 0) ? this.columnIcons.split(',') : [];
        parseIcons.forEach(icon => {
            icons.push({
                column: Number(icon.split(':')[0])-1,
                icon: icon.slice(icon.search(':')+1)
            });
        });

        // Parse lookup attribute
        const lookups = [];
        const parseLookups = (this.columnLookups.length > 0) ? this.columnLookups.split(',') : [];
        parseLookups.forEach(lookup => {
            lookups.push({
                column: Number(lookup.split(':')[0])-1,
                displayField: lookup.slice(lookup.search(':')+1)
            });
        });

        // Parse column definitions
        const cols = [];
        const colEachDef = this.columnDefinitions.split('|');
        console.log('colEachDef:',colEachDef);
        colEachDef.forEach(colDef => {
            this.originalFieldName.push({});
            let colAttrib = colDef.split(',');
            let iconAttrib = icons.find(i => i['column'] == columnNumber);
            let label = colAttrib[0];
            let fieldName = colAttrib[1];
            let type = colAttrib[2].toLowerCase();
            let lookupAttrib = lookups.find(i => i['column'] == columnNumber);
            let typeAttributes = colAttrib[3];
            let editable = colAttrib[4].toLowerCase() === 'true';
            let initialWidth = Number(colAttrib[5]);
            if(lookupAttrib && type == 'lookup') {
                this.originalFieldName[columnNumber] = fieldName;
                type = 'url';
                fieldName = 'Lookup_' + columnNumber;
                typeAttributes = { label: { fieldName: lookupAttrib.displayField }, target: '_blank' };
            }
            cols.push({
                label: label,
                iconName: (iconAttrib) ? iconAttrib.icon : null,
                fieldName: fieldName,
                type: type,
                typeAttributes: typeAttributes,
                editable: editable,
                sortable: 'true',
                initialWidth: initialWidth
            });
            columnNumber += 1;
        });
        this.columns = cols;
        console.log('columns:',this.columns);
       
        // Handle pre-selected records
        this.outputSelectedRows = this.preSelectedRows;
        const selected = JSON.parse(JSON.stringify([...this.preSelectedRows]));
        selected.forEach(record => {
            this.selectedRows.push(record[this.keyField]);            
        });

        // Process Incoming Data Collection
        const data = (this.tableData) ? JSON.parse(JSON.stringify([...this.tableData])) : [];

        data.forEach(record => {
            // If needed, add fields to datatable records
            // (Useful for Custom Row Actions/Buttons)
            // record['addField'] = 'newValue';

            // Add new columns with correct Lookup urls
            lookups.forEach(lookup => {
                record['Lookup_' + Number(lookup.column)] = MYDOMAIN + '.lightning.force.com/lightning/r/Account/' + record[this.originalFieldName[Number(lookup.column)]] + '/view';
            });

        });

        // Set table data attributes
        this.selectedRows = [...this.selectedRows];
        this.mydata = [...data];
        this.savePreEditData = [...this.mydata];
        console.log('selectedRows',this.selectedRows);
        console.log('keyField:',this.keyField);
        console.log('tableData',this.tableData);
        console.log('mydata:',this.mydata);

        // Set other initial values here
        if (this.singleRowSelection) this.maxRowSelection = 1;

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