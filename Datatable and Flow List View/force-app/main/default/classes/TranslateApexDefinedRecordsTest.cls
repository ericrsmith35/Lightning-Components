@isTest
public with sharing class TranslateApexDefinedRecordsTest {

    static testMethod void test() {

        List<SampleClassDescriptor> inputList = new List<SampleClassDescriptor>();

        TranslateApexDefinedRecords.Requests testRequest = new TranslateApexDefinedRecords.Requests();

        testRequest.inputString = '[{"field1":"value1","field2":"value2"},{"field1":"value31","field2":"value4"}]';
        testRequest.inputCollection = inputList;

        List<TranslateApexDefinedRecords.Requests> testRequestList = new List<TranslateApexDefinedRecords.Requests>();
        testRequestList.add(testRequest);

        List<TranslateApexDefinedRecords.Results> testResponseList = TranslateApexDefinedRecords.translateADR(testRequestList);
        system.debug('RESPONSE - '+testResponseList);
        system.assertEquals(testResponseList[0].outputCollection.size(), 2);
    }

}