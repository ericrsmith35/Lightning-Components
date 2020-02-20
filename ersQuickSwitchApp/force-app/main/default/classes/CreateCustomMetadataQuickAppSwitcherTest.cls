@IsTest
public with sharing class CreateCustomMetadataQuickAppSwitcherTest {

     static testMethod void testMyCallback_fail() {
         // Instantiate the callback.
         Metadata.DeployCallback callback = new CreateCustomMetadataQuickAppSwitcher();
       
         // Create test result and context objects.
         Metadata.DeployResult result = new Metadata.DeployResult();
         result.numberComponentErrors = 1;
         Metadata.DeployCallbackContext context = new Metadata.DeployCallbackContext();
        
         // Invoke the callback's handleResult method.
         callback.handleResult(result, context);
     }

    static testMethod void testMyCallback_success() {
        // Instantiate the callback.
        Metadata.DeployCallback callback = new CreateCustomMetadataQuickAppSwitcher();

        // Create test result and context objects.
        Metadata.DeployResult result = new Metadata.DeployResult();
        result.status = Metadata.DeployStatus.Succeeded;
        Metadata.DeployCallbackContext context = new Metadata.DeployCallbackContext();

        // Invoke the callback's handleResult method.
        callback.handleResult(result, context);
    }

    static testMethod void testDeployment() {
        List<String> md = new List<String>();
        md.add('Test~Test~Value1~Value2~Value3');
        CreateCustomMetadataQuickAppSwitcher.createCustomMetadata(md);
    }

    static testMethod void testCustomMetadataController() {
        QuickAppSwitcher__mdt[] qas = [Select MasterLabel from QuickAppSwitcher__mdt LIMIT 1];
        String label;
        if(qas.size() > 0) {
            label = qas[0].MasterLabel;
        }
        CustomMetadataController.getQuickAppSwitcher(label);
    }
}