/**
 * Lightning Web Component for Flow Screens:       datatableLwcFsc
 * 
 * Copyright (c) 2020, Eric Smith
 * 
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided 
 * that the following conditions are met:
 * 
 * 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 * 
 * 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer 
 * in the documentation and/or other materials provided with the distribution.
 * 
 * 3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived 
 * from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, 
 * BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT 
 * SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL 
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS 
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING 
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *  
 **/

import { LightningElement, api, track, wire } from 'lwc';
// import { FlowAttributeChangeEvent, FlowNavigationNextEvent } from 'lightning/flowSupport';
import getReturnResults from '@salesforce/apex/SObjectController.getReturnResults';

const MAXROWCOUNT = 1000;   // Limit the total number of records to be handled by this component

const MYDOMAIN = 'https://' + window.location.hostname.split('.')[0].replace('--c','');

export default class DatatableLwcFsc extends LightningElement {

    // Component Input & Output Attributes
    @api tableData = [];
    @api columnFields = [];
    @api columnAlignments = [];
    @api columnCellAttribs = [];
    @api columnEdits = '';
    @api columnIcons = [];
    @api columnLabels = [];
    @api columnOtherAttribs = [];
    @api columnTypeAttribs = [];
    @api columnWidths = [];
    @api keyField = 'Id';
    @api preSelectedRows = [];
    @api hideCheckboxColumn;
    @api singleRowSelection;
    @api suppressBottomBar = false;
    @api outputSelectedRows = [];
    @api outputEditedRows = [];

    // Other Datatable attributes
    @api sortedBy;
    @api sortDirection; 
    @api maxRowSelection;
    @api errors;
    @track columns = [];
    @track mydata = [];
    @track selectedRows = [];

    // Handle Lookup Field Variables   
    @api lookupId;
    @api objectName;
    @track lookupName;

    // Component working variables
    @api savePreEditData = [];
    @api editedData = [];
    @api outputData = [];
    @api errorApex;
    @api dtableColumnFieldDescriptorString;
    @api basicColumns = [];
    @api columnArray = [];
    @api percentFieldArray = [];
    @api noEditFieldArray = [];
    @api timeFieldArray = [];
    @api edits = [];
    @api isEditAttribSet = false;
    @api editAttribType = 'none';
    @api alignments = [];
    @api cellAttribs = [];
    @api cellAttributes;
    @api icons = [];
    @api labels = [];
    @api otherAttribs = [];
    @api typeAttribs = [];
    @api typeAttributes;
    @api widths = [];
    @api lookups = [];
    @api cols = [];
    @api recordData = [];
    @track showSpinner = true;

    connectedCallback() {
                   
        // Restrict the number of records handled by this component
        if (this.tableData.length > MAXROWCOUNT) {
            this.tableData = [...this.tableData].slice(0,MAXROWCOUNT);
        }

        // Get array of column field API names
        this.columnArray = (this.columnFields.length > 0) ? this.columnFields.replace(/\s/g, '').split(',') : [];

        // Parse Column Alignment attribute
        const parseAlignments = (this.columnAlignments.length > 0) ? this.columnAlignments.replace(/\s/g, '').split(',') : [];
        parseAlignments.forEach(align => {
            this.alignments.push({
                column: this.columnReference(align),
                alignment: this.columnValue(align)
            });
        });

        // Parse Column Edit attribute
        if (this.columnEdits.toLowerCase() != 'all') {
            const parseEdits = (this.columnEdits.length > 0) ? this.columnEdits.replace(/\s/g, '').split(',') : [];
            this.editAttribType = 'none';
            parseEdits.forEach(edit => {
                let colEdit = (this.columnValue(edit).toLowerCase() == 'true') ? true : false;
                this.edits.push({
                    column: this.columnReference(edit),
                    edit: colEdit
                });
                this.editAttribType = 'cols';
            });
        } else {
            this.editAttribType = 'all';
        }

        // Parse Column Icon attribute
        const parseIcons = (this.columnIcons.length > 0) ? this.columnIcons.replace(/\s/g, '').split(',') : [];
        parseIcons.forEach(icon => {
            this.icons.push({
                column: this.columnReference(icon),
                icon: this.columnValue(icon)
            });
        });

        // Parse Column Label attribute
        const parseLabels = (this.columnLabels.length > 0) ? this.removeSpaces(this.columnLabels).split(',') : [];
        parseLabels.forEach(label => {
            this.labels.push({
                column: this.columnReference(label),
                label: this.columnValue(label)
            });
        });
        
        // Parse Column Width attribute
        const parseWidths = (this.columnWidths.length > 0) ? this.columnWidths.replace(/\s/g, '').split(',') : [];
        parseWidths.forEach(width => {
            this.widths.push({
                column: this.columnReference(width),
                width: parseInt(this.columnValue(width))
            });
        });

        // Parse Column CellAttribute attribute (Because multiple attributes use , these are separated by ;)
        const parseCellAttribs = (this.columnCellAttribs.length > 0) ? this.removeSpaces(this.columnCellAttribs).split(';') : [];
        parseCellAttribs.forEach(cellAttrib => {
            this.cellAttribs.push({
                column: this.columnReference(cellAttrib),
                attribute: this.columnValue(cellAttrib)
            });
        });
        
        // Parse Column Other Attributes attribute (Because multiple attributes use , these are separated by ;)
        const parseOtherAttribs = (this.columnOtherAttribs.length > 0) ? this.removeSpaces(this.columnOtherAttribs).split(';') : [];
            parseOtherAttribs.forEach(otherAttrib => {
            this.otherAttribs.push({
                column: this.columnReference(otherAttrib),
                attribute: this.columnValue(otherAttrib)
            });
        });
         
        // Parse Column TypeAttribute attribute (Because multiple attributes use , these are separated by ;)
        const parseTypeAttribs = (this.columnTypeAttribs.length > 0) ? this.removeSpaces(this.columnTypeAttribs).split(';') : [];
        parseTypeAttribs.forEach(typeAttrib => {
            this.typeAttribs.push({
                column: this.columnReference(typeAttrib),
                attribute: this.columnValue(typeAttrib)
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

        // Handle pre-selected records
        this.outputSelectedRows = this.preSelectedRows;
        const selected = JSON.parse(JSON.stringify([...this.preSelectedRows]));
        selected.forEach(record => {
            this.selectedRows.push(record[this.keyField]);            
        });

    }

    removeSpaces(string) {
        return string
            .replace(/, | ,/g,',')
            .replace(/: | :/g,':')
            .replace(/{ | {/g,'{')
            .replace(/} | }/g,'}')
            .replace(/; | ;/g,';');
    }

    columnReference(attrib) {
        // The column reference can be either the field API name or the column sequence number (1,2,3 ...)
        // Return the actual column # (0,1,2 ...)
        let colDescriptor = attrib.split(':')[0];
        let colRef = Number(colDescriptor)-1;
        if (isNaN(colRef)) {
            colRef = this.columnArray.indexOf(colDescriptor);
            colRef = (colRef != -1) ? colRef : 999; // If no match for the field name, set to non-existent column #
        }
        return colRef;
    }

    columnValue(attrib) {
        // Extract the value from the column attribute
        return attrib.slice(attrib.search(':')+1);
    }

    processDatatable() {
        // Call Apex Controller and get Column Definitions and update Row Data
        let data = (this.tableData) ? JSON.parse(JSON.stringify([...this.tableData])) : [];
        let fieldList = this.columnFields.replace(/\s/g, ''); // Remove spaces
        getReturnResults({ records: data, fieldNames: fieldList })
        .then(result => {
            let returnResults = JSON.parse(result);

            // Assign return results from the Apex callout
            this.recordData = [...returnResults.rowData];
            this.lookups = returnResults.lookupFieldList;
            this.percentFieldArray = (returnResults.percentFieldList.length > 0) ? returnResults.percentFieldList.toString().split(',') : [];
            this.timeFieldArray = (returnResults.timeFieldList.length > 0) ? returnResults.timeFieldList.toString().split(',') : [];
            this.objectName = returnResults.objectName;

            // Update row data for lookup, time and percent fields
            this.updateDataRows();

            // Basic column info (label, fieldName, type) taken from the Schema in Apex
            this.dtableColumnFieldDescriptorString = '[' + returnResults.dtableColumnFieldDescriptorString + ']';
            this.basicColumns = JSON.parse(this.dtableColumnFieldDescriptorString);

            // Custom column processing
            this.noEditFieldArray = (returnResults.noEditFieldList.length > 0) ? returnResults.noEditFieldList.toString().split(',') : [];
            this.updateColumns();

            // Done processing the datatable
            this.showSpinner = false;
        // })
        // .catch(error => {
        //     console.log('getReturnResults error is: ' + JSON.stringify(error));
        //     this.errorApex = 'Apex Action error: ' + error.body.message;
        //     return this.errorApex; 
        });
    }

    updateDataRows() {
        // Process Incoming Data Collection
        let data = (this.recordData) ? JSON.parse(JSON.stringify([...this.recordData])) : [];
        let lookupFields = this.lookups;
        let lufield = '';
        let timeFields = this.timeFieldArray;

        data.forEach(record => {

            // Prepend a date to the Time field so it can be displayed
            timeFields.forEach(time => {
                record[time] = "2020-05-12T" + record[time];
            });

            // Flatten returned data
            lookupFields.forEach(lookup => {
                if(lookup.toLowerCase().endsWith('id')) {
                    lufield = lookup.replace(/Id$/gi,'');
                } else {
                    lufield = lookup.replace(/__c$/gi,'__r');
                }
                if (record[lufield]) {               
                    record[lufield + '_name'] = record[lufield]['Name'];
                    record[lufield + '_id'] = record[lufield]['Id'];
                    // Add new column with correct Lookup urls
                    record[lufield + '_lookup'] = MYDOMAIN + '.lightning.force.com/lightning/r/' + this.objectName + '/' + record[lufield + '_id'] + '/view';
                }
            });                

            // If needed, add more fields to datatable records
            // (Useful for Custom Row Actions/Buttons)
            // record['addField'] = 'newValue';

        });

        // Set table data attributes
        this.mydata = [...data];
        this.savePreEditData = [...this.mydata];
        this.editedData = JSON.parse(JSON.stringify([...this.tableData]));  // Must clone because cached items are read-only
        console.log('selectedRows',this.selectedRows);
        console.log('keyField:',this.keyField);
        console.log('tableData',this.tableData);
        console.log('mydata:',this.mydata);
    }

    updateColumns() {
        // Parse column definitions
        this.cols = [];
        let columnNumber = 0;
        let lufield = '';

        this.basicColumns.forEach(colDef => {

            // Standard parameters
            let label = colDef['label'];
            let fieldName = colDef['fieldName'];
            let type = colDef['type'];
            let scale = colDef['scale'];
            this.cellAttributes = {};
            this.typeAttributes = {};
            let editAttrib = [];

            // Update Alignment attribute overrides by column
            let alignmentAttrib = this.alignments.find(i => i['column'] == columnNumber);
            if (alignmentAttrib) {
                let alignment = alignmentAttrib.alignment.toLowerCase();
                switch (alignment) {
                    case 'left':
                    case 'center':
                    case 'right':
                        break;
                    default:
                        alignment = 'left';
                }
                this.cellAttributes = { alignment:alignment };
            }

            // Update Edit attribute overrides by column
            switch (this.editAttribType) {
                case 'cols':
                    editAttrib = this.edits.find(i => i['column'] == columnNumber);
                    break;
                case 'all': 
                    editAttrib.edit = true;
                    break;
                default:
                    editAttrib.edit = false;
            }

            // Some data types are not editable
            if(editAttrib) {
                switch (type) {
                    case 'location':
                    case 'lookup':
                    case 'time':
                        editAttrib.edit = false;
                        break;
                    case 'text':
                        if (this.noEditFieldArray.indexOf(fieldName) != -1) editAttrib.edit = false;
                        break;
                    default:
                }
            }

            // Update Icon attribute overrides by column
            let iconAttrib = this.icons.find(i => i['column'] == columnNumber);

            // Update Label attribute overrides by column
            let labelAttrib = this.labels.find(i => i['column'] == columnNumber);

            // Update Width attribute overrides by column
            let widthAttrib = this.widths.find(i => i['column'] == columnNumber);

            // Set default typeAttributes based on data type
            switch(type) {
                case 'date':
                    this.typeAttributes = { year:'numeric', month:'numeric', day:'numeric' }
                    break;
                case 'datetime':
                    type = 'date';
                    this.typeAttributes = { year:'numeric', month:'numeric', day:'numeric', hour:'2-digit', minute:'2-digit', timeZoneName:'short' };
                    break;           
                case 'time':
                    type = 'date';
                    this.typeAttributes = { hour:'2-digit', minute:'2-digit', timeZoneName:'short' };
                    break;
                case 'currency':
                case 'number':
                case 'percent':
                    this.typeAttributes = { minimumFractionDigits:scale };   // Show the number of decimal places defined for the field
                    break;
                default:
            }

            // Change lookup to url and reference the new fields that will be added to the datatable object
            if(type == 'lookup') {
                type = 'url';
                if(fieldName.toLowerCase().endsWith('id')) {
                    lufield = fieldName.replace(/Id$/gi,'');
                } else {
                    lufield = fieldName.replace(/__c$/gi,'__r');
                }
                fieldName = lufield + '_lookup';
                this.typeAttributes = { label: { fieldName: lufield + '_name' }, target: '_blank' };
            }

            // Update CellAttribute attribute overrides by column
            this.parseAttributes('cell',this.cellAttribs,columnNumber);

            // Update TypeAttribute attribute overrides by column
            this.parseAttributes('type',this.typeAttribs,columnNumber);

            // Save the updated column definitions
            this.cols.push({
                label: (labelAttrib) ? labelAttrib.label : label,
                iconName: (iconAttrib) ? iconAttrib.icon : null,
                fieldName: fieldName,
                type: type,
                cellAttributes: this.cellAttributes,
                typeAttributes: this.typeAttributes,
                editable: (editAttrib) ? editAttrib.edit : false,
                sortable: 'true',
                initialWidth: (widthAttrib) ? widthAttrib.width : null
            });

            // Update Other Attributes attribute overrides by column
            this.parseAttributes('other',this.otherAttribs,columnNumber);

            // Repeat for next column
            columnNumber += 1;
        });
        this.columns = this.cols;
        console.log('columns:',this.columns);
    }

    parseAttributes(propertyType,inputAttributes,columnNumber) {
        // Parse regular and nested name:value attribute pairs
        let result = [];
        let fullAttrib = inputAttributes.find(i => i['column'] == columnNumber);
        if (fullAttrib) {
            let attribSplit = this.removeSpaces(fullAttrib.attribute.slice(1,-1)).split(',');
            attribSplit.forEach(ca => {
                let subAttribPos = ca.search('{');
                if (subAttribPos != -1) {
                    // This attribute value has another attribute object definition {name: {name:value}}
                    let value = {};
                    let name = ca.split(':')[0];
                    let attrib = ca.slice(subAttribPos).slice(1,-1);
                    let rightName = attrib.split(':')[0];
                    let rightValue = attrib.slice(attrib.search(':')+1);
                    value[rightName] = rightValue.replace(/["']{1}/gi,"");  // Remove single or double quotes
                    result['name'] = name;
                    result['value'] = value;
                } else {
                    // This is a standard attribute definition {name:value}
                    let attrib = ca.split(':');
                    result['name'] = attrib[0];
                    result['value'] = attrib[1].replace(/["']{1}/gi,"");  // Remove single or double quotes;                           
                }

                switch(propertyType) {
                    case 'cell':
                        this.cellAttributes[result['name']] = result['value'];
                        break;
                    case 'type':
                        this.typeAttributes[result['name']] = result['value'];
                        break;
                    default: // 'other'
                        this.cols[columnNumber][result['name']] = result['value'];
                }
            });
        }    
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

    handleCellChange(event) {
        // If suppressBottomBar is false, wait for the Save or Cancel button
        if (this.suppressBottomBar) {
            this.handleSave(event);
        }
    }

    handleSave(event) {
        // Only used with inline editing
        const draftValues = event.detail.draftValues;

        // Apply drafts to mydata
        let data = [...this.mydata];
        data = data.map(item => {
            const draft = draftValues.find(d => d[this.keyField] == item[this.keyField]);
            if (draft != undefined) {
                let fieldNames = Object.keys(draft);
                fieldNames.forEach(el => item[el] = draft[el]);
            }
            return item;
        });

        // Apply drafts to editedData
        let edata = [...this.editedData];
        edata = edata.map(eitem => {
            const edraft = draftValues.find(d => d[this.keyField] == eitem[this.keyField]);
            if (edraft != undefined) {
                let efieldNames = Object.keys(edraft);
                efieldNames.forEach(ef => {
                    if(this.percentFieldArray.indexOf(ef) != -1) {
                        eitem[ef] = Number(edraft[ef])*100; // Percent field
                    } else {
                        eitem[ef] = edraft[ef];
                    }
                });
                // Add/update edited record to output collection
                const orecord = this.outputEditedRows.find(o => o[this.keyField] == eitem[this.keyField]);   // Check to see if already in output collection
                if (orecord) {
                    efieldNames.forEach(ef => orecord[ef] = edraft[ef]);    // Change existing output record
                } else {
                    this.outputEditedRows.push(eitem);  // Add to output attribute collection
                }
            }
            return eitem;
        });  

        this.savePreEditData = [...data];   // Resave the current table values
        this.mydata = [...data];            // Reset the current table values
        if (!this.suppressBottomBar) {
            this.columns = [...this.columns];   // Force clearing of the edit highlights
        }
    }

    cancelChanges(event) {
        // Only used with inline editing
        this.mydata = [...this.savePreEditData];
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

    updateColumnSorting(event) {
        // Handle column sorting
        console.log('Sort:',event.detail.fieldName,event.detail.sortDirection);
        this.sortedBy = event.detail.fieldName;
        let sortField = this.sortedBy;
        // Change sort field from Id to Name for lookups
        if (sortField.endsWith('_lookup')) {
            sortField = sortField.slice(0,sortField.lastIndexOf('_lookup')) + '_name';   
        }
        this.sortedDirection = event.detail.sortDirection;
        let fieldValue = row => row[sortField] || '';
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