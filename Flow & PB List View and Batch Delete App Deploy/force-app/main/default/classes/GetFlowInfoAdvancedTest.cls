@isTest
public with sharing class GetFlowInfoAdvancedTest {

    static testMethod void test() {

        GetFlowInfoAdvanced.Requests testRequest = new GetFlowInfoAdvanced.Requests();

        testRequest.typeSelection = 'Both';
        testRequest.statusSelection = 'Both';
        testRequest.lowerBoundary = '';
        testRequest.upperBoundary = '';
        testRequest.activeRowTheme = 'warning';

        List<GetFlowInfoAdvanced.Requests> testRequestList = new List<GetFlowInfoAdvanced.Requests>();
        testRequestList.add(testRequest);

        List<GetFlowInfoAdvanced.Results> testResponseList = GetFlowInfoAdvanced.getFlowDetails(testRequestList);
        system.debug('RESPONSE - '+testResponseList);
        
    }

}