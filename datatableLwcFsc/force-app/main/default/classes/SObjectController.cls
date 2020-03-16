/**
 * 
 * Based on a component (ItemsToApprove) created by: Alex Edelstein (Salesforce) 
 * Based on a component (FlatTable) created by: J. Pipkin (OpFocus, Inc)
 * 
 * Description: getColumnData
 *              Get field information from a list of field names in order to build
 *              the column definitions for the datatable
 * 
 *              getRowData
 *              Take a List of Records and a List of Lookup Field Names and
 *              use the recordId values in the lookup fields get the values
 *              of the Name fields in the corresponding records. Return the
 *              records that now include both the Id and Name for each lookup.
 * 
 * xx/xx/20 -   Eric Smith -    Version 1.0
 * 
 **/

public with sharing class SObjectController {

    //this is just a convenient way to return multiple unique pieces of data to the component
    public class ReturnResults {
        List<SObject> rowData;
        String dtableColumnFieldDescriptorString;
        List<String> lookupFieldList;
        String objectName;
    }

    @AuraEnabled
    public static string getReturnResults(List<SObject> records, String fieldNames){
        String objName = records[0].getSObjectType().getDescribe().getName();
        ReturnResults curRR = new ReturnResults();
        curRR = getColumnData(curRR, fieldNames, objName);
        curRR.rowData = getRowData(records, curRR.lookupFieldList);
        curRR.objectName = objName;
        return JSON.serialize(curRR);  
    }

    @AuraEnabled
    public static ReturnResults getColumnData(ReturnResults curRR, String fields, String objectName) {
        
        System.debug('Process Columns for Object: ' + objectName );
        System.debug('------- ------- for fieldnames: ' + fields );

        SObjectType sobjType = ((SObject)(Type.forName('Schema.'+objectName).newInstance())).getSObjectType();
        DescribeSObjectResult objDescribe = sobjType.getDescribe();

        String datatableColumnFieldDescriptor = '';
        String fieldType = '';
        List<Schema.DescribeFieldResult> curFieldDescribes = new List<Schema.DescribeFieldResult>();
        List<String> lookupFields = new List<String>();

        for (String fieldName : fields.split(',')) {
           System.debug('for field: ' + fieldName);

           Map<String, Schema.SObjectField> fieldMap = objDescribe.fields.getMap();
           Schema.SObjectField fieldItem = fieldMap.get(fieldName);
           if (fieldItem == null) 
                throw new MyApexException('could not find the field: ' + fieldName + 'on the object ' + objectName);
           Schema.DescribeFieldResult dfr = fieldItem.getDescribe();
           curFieldDescribes.add(dfr);
           datatableColumnFieldDescriptor = datatableColumnFieldDescriptor + ',{"label" : "' + dfr.getLabel() + '", "fieldName" : "' + fieldName + '", "type" : "' + convertType(dfr.getType().name()) + '"}';
           if (dfr.getType().name() == 'REFERENCE') {
               lookupFields.add(fieldName);
           }
        }
        System.debug('final fieldDescribe string is: ' + datatableColumnFieldDescriptor);
        curRR.dtableColumnFieldDescriptorString = datatableColumnFieldDescriptor.substring(1);   // Remove leading ,
        curRR.lookupFieldList = lookupFields;
        return curRR;
    }

    @AuraEnabled
    public static List<SObject> getRowData(List<SObject> records, List<String> lookupFields) {
        // Update object to include values for the Name field referenced by Lookup fields

        Map<String, Set<Id>> objIdMap = new Map<String, Set<Id>>();
        List<String> fields = lookupFields;

        // Get names of the related objects
        for(SObject so : records) {
            for(String lf : fields) {
                if(so.get(lf) != null) {
                    Id lrid = ((Id) so.get(lf));
                    String relObjName = lrid.getSobjectType().getDescribe().getName();
                    if(!objIdMap.containsKey(relObjName)) {
                        objIdMap.put(relObjName, new Set<Id>());
                    }
                    objIdMap.get(relObjName).add(lrid);
                }
            }
        }

        // Lookup the Name field in the related object
        Map<String, Map<Id, SObject>> dataMap = new Map<String, Map<Id, SObject>>();
        for(String obj : objIdMap.keySet()) {
            Set<Id> ids = objIdMap.get(obj);
            SObject[] recs = Database.query('Select Id, Name from ' + obj + ' where Id in :ids');        
            Map<Id, SObject> somap = new Map<Id, SObject>();
            for(SObject so : recs) {
                somap.put((Id) so.get('Id'), so);
            }
            dataMap.put(obj, somap);
        }

        // Add new field values to the records
        for(SObject so : records) {         
            for(String lf : fields) {             
                if(so.get(lf) != null) {
                    Id lrid = ((Id) so.get(lf));
                    String relObjName = lrid.getSobjectType().getDescribe().getName();
                    Map<Id, SObject> recs = dataMap.get(relObjName);
                    if (recs == null) continue;
                    SObject cso = recs.get(lrid);
                    if (cso == null) continue;
                    String relName;
                    if (lf.toLowerCase().endsWith('id')) {
                        relName = lf.replaceAll('(?i)id$', '');
                    } else {
                        relName = lf.replaceAll('(?i)__c$', '__r');
                    }
                    so.putSObject(relName, cso);
                }
            }
        }
        // System.debug('records: ' + JSON.serializePretty(records));
        return records;
    }

    public class MyApexException extends Exception {
    }

    //convert the apex type to the corresponding javascript type that datatable will understand
    private static String convertType (String apexType){
        System.debug('field type: ' + apexType);
        switch on apexType {
            when 'BOOLEAN' {
                return 'boolean';
            }
            when 'CURRENCY' {
                return 'currency';
            }
            when 'DATE', 'DATETIME' {
                return 'date';
            }
            when 'DECIMAL', 'DOUBLE', 'INTEGER', 'LONG' {
                return 'number';
            }
            when 'EMAIL' {
                return 'email';
            }
            when 'ID' {
                return 'id';
            }
            when 'LOCATION' {
                return 'location';
            }
            when 'PERCENT' {
                return 'percent';
            }
            when 'PHONE' {
                return 'phone';
            }
            when 'REFERENCE' {
                return 'lookup';    // Custom type for this component
            }
            when 'URL' {
                return 'url';
            }
            when else {
                // throw new MyApexException ('you\'ve specified the unsupported field type: ' + apexType );
                return 'text';
            }
        }
    }
    
}