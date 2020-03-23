import { LightningElement, api, track, wire } from 'lwc';

const COLUMNS = [
    {label : "Full Name", fieldName : "Name", type : "text"},
    {label : "Percent", fieldName : "dt_Percent__c", type : "percent",
        typeAttributes: {minimumFractionDigits: 5, minimumIntegerDigits: 5}
    },
]

export default class dtTypeAttrib extends LightningElement {

    // Component Input & Output Attributes
    @api tableData;
    @api keyField = 'Id';
    @api outputSelectedRows = [];

    // Other Datatable attributes
    @track columns = COLUMNS;
    @track mydata = [];
    @track selectedRows = [];

    // Component working variables
    @api outputData = [];
    @api recordData = [];

    connectedCallback() {       
        // Generate datatable
        if (this.tableData) {
            this.processDatatable();
        }
    }

    processDatatable() {
        this.mydata = [...this.tableData];
    }

    handleRowSelection(event) {
        // Only used with row selection
        // Update values to be passed back to the Flow
        let selectedRows = event.detail.selectedRows;
        let sdata = [];
        selectedRows.forEach(srow => {
            const selData = this.tableData.find(d => d[this.keyField] == srow[this.keyField]);
            sdata.push(selData);
        });
        this.outputSelectedRows = [...sdata]; // Set output attribute values
        console.log('outputSelectedRows',this.outputSelectedRows);   
    }

}