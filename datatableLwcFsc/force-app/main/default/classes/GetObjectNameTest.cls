/*
    From Matthew Nelson (CapTech) Blog Post (1/20/20)
    https://captechconsulting.com/blogs/set-your-flows-free-use-the-same-flow-on-multiple-objects
*/

@isTest
public class GetObjectNameTest {
 
 @isTest
 public static void testReturnObjectName(){
 //Create and insert lead record
 Lead testLead = new Lead();
 testLead.Status = 'Open';
 testLead.Salutation = 'Mr.';
 testLead.FirstName = 'Tim';
 testLead.LastName = 'Testin';
 testLead.Company = 'Test Company';
 insert testLead;
 
 //Return newly created lead record 
 List LeadList = new List();
 LeadList = [Select Id from Lead where FirstName = 'Tim' AND LastName = 'Testin' AND Company = 'Test Company' LIMIT 1];
 
 List IdList = new List ();
 
 For (Lead l: LeadList){
 IdList.add(l.Id);
 }
 test.startTest();
 List results = GetObjectName.returnObjectName(IdList);
 test.stopTest();
 System.assertEquals('Lead', results[0], 'ERROR IN GetObjectNameTest.testReturnObjectName : sObject Name did not match');
 }

} 