import { LightningElement, api, track } from 'lwc';
// import { FlowAttributeChangeEvent, FlowNavigationNextEvent } from 'lightning/flowSupport';

export default class DatatableLwcFsc extends LightningElement {

    // Component Input & Output Attributes
    @api tableData;
    @api columnDefinitions;
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
 
    // Component working variables
    @api savePreEditData = [];

    connectedCallback() {
        // Build Column Definitions 
        // (This could change depending on how I build the Custom Property Editor)
        const cols = [];
        const colEachDef = this.columnDefinitions.split('|');
        console.log('colEachDef:',colEachDef);
        colEachDef.forEach(colDef => {
            let colAttrib = colDef.split(',');
            cols.push({
                label: colAttrib[0],
                fieldName: colAttrib[1],
                type: colAttrib[2],
                typeAttributes: colAttrib[3],
                editable: colAttrib[4].toLowerCase() === 'true',
                sortable: 'true',
                initialWidth: Number(colAttrib[5])
            });
        });
        this.columns = cols;
        console.log('columns:',this.columns);

        // Process Incoming Data Collection
        const data = (this.tableData) ? JSON.parse(JSON.stringify([...this.tableData])) : [];
        data.forEach(record => {
            // If needed, add fields to datatable records
            // (Useful for Custom Row Actions/Buttons)
            // record['addField'] = 'newValue';
        });

        // Handle pre-selected records
        this.outputSelectedRows = this.preSelectedRows;
        const selected = JSON.parse(JSON.stringify([...this.preSelectedRows]));
        console.log('selected',selected);
        selected.forEach(record => {
            this.selectedRows.push(record[this.keyField]);            
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