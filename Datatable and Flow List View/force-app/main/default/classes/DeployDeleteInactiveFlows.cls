public with sharing class DeployDeleteInactiveFlows {

    public class FlowVerInfo {
        String DurableId;
        String Description;
        String FlowDefinitionViewId;
        Boolean IsTemplate;
        String Label;
        Datetime LastModifiedDate;
        String ProcessType;
        String Status;
        Integer VersionNumber;

        //From FlowDefInfo
        String ApiName;
        String LastModifiedBy;
        String TriggerType;

        //From FlowVarInfo
        String WorkflowObject;      // Process Builder

        //Additional Fields
        String FlowTypeIcon;
        String FlowStatusIcon;
        String RowShadeValue;
        String Label_name;
        String Label_lookup;
    }

    public class Requests {

        @InvocableVariable(label='Flow Records Selected for Deletion')
        public String flowRecordString;

    }

    public class Results {

        @InvocableVariable
        public String completedMessage;
    }

    @InvocableMethod
    public static List<Results> DeployDeleteInactiveFlows(List<Requests> requestList) {

        Results response = new Results();
        List<Results> responseWrapper = new List<Results>();

        for (Requests req : requestList) {
            String flowRecordString = req.flowRecordString;
            MetadataService.MetadataPort service = new MetadataService.MetadataPort();
            service.SessionHeader = new MetadataService.SessionHeader_element();
            service.SessionHeader.sessionId = UserInfo.getSessionId();
            String testLevel = 'NoTestRun';

            String zippedFile = generateZipfile(flowRecordString);
            MetadataService.AsyncResult deployResult= service.deploy(zippedFile, getDeployOptions());

            String jobId = deployResult.id;
            MetadataService.DeployResult result = service.checkDeployStatus(jobId,true);
            System.debug('deploy status is: ' + result.status + ' ' + result.stateDetail); 

            response.completedMessage = 'Done';
            responseWrapper.add(response);
        }
        return responseWrapper;

    }   

    public static String generateZipfile(String flowRecordString) {
        Zippex sampleZip = new Zippex();
        Blob fileData = Blob.valueOf(getPackageXml());
        sampleZip.addFile('package.xml', fileData, null);
        fileData = Blob.valueOf(getDestructiveChangesXml(flowRecordString));
        sampleZip.addFile('destructiveChanges.xml', fileData, null);
        return EncodingUtil.base64Encode(sampleZip.getZipArchive());
    }

    public static MetadataService.DeployOptions getDeployOptions(){
                
        MetadataService.DeployOptions lvDeployOption = new MetadataService.DeployOptions();
        lvDeployOption.allowMissingFiles = false;
        lvDeployOption.autoUpdatePackage = true;
        lvDeployOption.checkOnly = false;
        lvDeployOption.ignoreWarnings = true;
        lvDeployOption.performRetrieve = false;
        lvDeployOption.purgeOnDelete = false;
        lvDeployOption.rollbackOnError = true;
        lvDeployOption.runTests = new String[]{};
        lvDeployOption.singlePackage = true;
        lvDeployOption.testLevel = 'NoTestRun';
            
        return lvDeployOption;
    }

    public static String getPackageXml() {
        return  '<?xml version="1.0" encoding="UTF-8"?>' + 
                '<Package xmlns="http://soap.sforce.com/2006/04/metadata">' +
                    '<version>41.0</version>' +
                '</Package>';	
    }
    
    public static String getDestructiveChangesXml(String flowRecordString) {
System.debug('flowRecordString - '+flowRecordString);
        List<FlowVerInfo> flowRecords = (List<FlowVerInfo>)System.JSON.deserialize(flowRecordString, List<FlowVerInfo>.class);
System.debug('flowRecords '+flowRecords);
        String retFile;
        retFile =   '<?xml version="1.0" encoding="UTF-8"?>' +
                    '<Package xmlns="http://soap.sforce.com/2006/04/metadata">' +
                        '<types>';
        
        for (FlowVerInfo fn : flowRecords) {
            if (fn.Status != 'Active') {
                retFile = retFile + '<members>'+fn.ApiName+'-'+String.valueOf(fn.VersionNumber)+'</members>';
            }
        }

        retFile = retFile +
                            '<name>Flow</name>' + 
                        '</types>' + 
                    '</Package>';
System.debug('retFile - '+retFile);        
        return retFile;
    }

}
