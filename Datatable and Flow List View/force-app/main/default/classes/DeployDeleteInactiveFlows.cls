public with sharing class DeployDeleteInactiveFlows {

    public static void DeployDeleteInactiveFlows(List<String> flowNames, String testLevel) {

        MetadataService.MetadataPort service = new MetadataService.MetadataPort();
        service.SessionHeader = new MetadataService.SessionHeader_element();
        service.SessionHeader.sessionId = UserInfo.getSessionId();
        if (String.isEmpty(testLevel))
            testLevel = 'NoTestRun';

        String zippedFile = generateZipfile(flowNames);
        MetadataService.AsyncResult deployResult= service.deploy(zippedFile, getDeployOptions());

        String jobId = deployResult.id;
        MetadataService.DeployResult result = service.checkDeployStatus(jobId,true);
        System.debug('deploy status is: ' + result.status + ' ' + result.stateDetail); 

    }   

    public static String generateZipfile(List<String> flowNames) {
        Zippex sampleZip = new Zippex();
        Blob fileData = Blob.valueOf(getPackageXml());
        sampleZip.addFile('package.xml', fileData, null);
        fileData = Blob.valueOf(getDestructiveChangesXml(flowNames));
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
        // lvDeployOption.testLevel = 'NoTestRun';
            
        return lvDeployOption;
    }

    public static String getPackageXml() {
        return  '<?xml version="1.0" encoding="UTF-8"?>' + 
                '<Package xmlns="http://soap.sforce.com/2006/04/metadata">' +
                    '<version>41.0</version>' +
                '</Package>';	
    }
    
    public static String getDestructiveChangesXml(List<String> flowNames) {
        String retFile;
        retFile =   '<?xml version="1.0" encoding="UTF-8"?>' +
                    '<Package xmlns="http://soap.sforce.com/2006/04/metadata">' +
                        '<types>';
        
        for (String fn:flowNames) {
            retFile = retFile + '<members>'+fn+'</members>';
        }

        retFile = retFile +
                            '<name>Flow</name>' + 
                        '</types>' + 
                    '</Package>';
        
        return retFile;
    }

}
