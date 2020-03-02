/**
 * Based on a component (FlatTable) created by: J. Pipkin (OpFocus, Inc)
 * 
 * Description: Take a List of Records and a List of Lookup Field Names and
 *              use the recordId values in the lookup fields get the values
 *              of the Name fields in the corresponding records. Return the
 *              records that now include both the Id and Name for each lookup.
 * 
 * xx/xx/20 -   Eric Smith -    Version 1.0
 * 
 **/

public with sharing class AddRelatedNames {
    @AuraEnabled
    public static List<SObject> getNameFromIds(List<SObject> records, List<String> fields) {
        String objName = records[0].getSObjectType().getDescribe().getName();
        Map<String, Set<Id>> objIdMap = new Map<String, Set<Id>>();

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

        return records;
    }
}