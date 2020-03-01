/*
    From Matthew Nelson (CapTech) Blog Post (1/20/20)
    https://captechconsulting.com/blogs/set-your-flows-free-use-the-same-flow-on-multiple-objects
*/

global class GetObjectName {
    // @InvocableMethod             // Used when creating a Flow Action        
    @AuraEnabled                    // Used when creating a LWC call
    public static List<string> returnObjectName(List<string> recordIdStrings){
    // object Ids to return
    List<string> objectNames = new List<string>();
    // get record name
    Id recordId = Id.valueOf(recordIdStrings[0]);
    String objectName = recordId.getSobjectType().getDescribe().getName();
    // add object name to list
    objectNames.add(recordId.getSobjectType().getDescribe().getName());
    // return
    return objectNames;
    }
}
