declare module "@salesforce/apex/SObjectController2.getReturnResults" {
  export default function getReturnResults(param: {records: any, fieldNames: any}): Promise<any>;
}
declare module "@salesforce/apex/SObjectController2.getColumnData" {
  export default function getColumnData(param: {curRR: any, fields: any, objName: any}): Promise<any>;
}
declare module "@salesforce/apex/SObjectController2.getLookupData" {
  export default function getLookupData(param: {curRR: any, records: any, lookupFields: any, objName: any}): Promise<any>;
}
declare module "@salesforce/apex/SObjectController2.getRowData" {
  export default function getRowData(param: {curRR: any, records: any, dataMap: any, objNameFieldMap: any, lookupFields: any, percentFields: any, objName: any}): Promise<any>;
}
