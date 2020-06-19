// Apex-Defined Variable Sample Descriptor Class
public with sharing class SampleClassDescriptor {

    // @AuraEnabled annotation exposes the methods to Lightning Components and Flows
    @AuraEnabled
    public String field1;

    @AuraEnabled
    public String field2;

    @AuraEnabled
    public Boolean field3;

    @AuraEnabled
    public Integer field4;    

    // Define the structure of the Apex-Defined Variable
    public SampleClassDescriptor(
            String field1,
            String field2,
            Boolean field3,
            Integer field4
    ) {
        this.field1 = field1;
        this.field2 = field2;
        this.field3 = field3;
        this.field4 = field4;
    }

    // Required no-argument constructor
    public SampleClassDescriptor() {}
}