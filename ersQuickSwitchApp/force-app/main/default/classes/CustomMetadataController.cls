// CustomMetadataController.cls
public with sharing class CustomMetadataController {
    @AuraEnabled(cacheable=true)
    public static QuickAppSwitcher__mdt getQuickAppSwitcher(String label) {
        return [SELECT Id, Label, AppAPINames__c, AppImageNames__c, AppAlternateTexts__c FROM QuickAppSwitcher__mdt WHERE Label = :label LIMIT 1];
    }
}