/** 
 * 
 *  Sample Apex Class Template to get data from a Flow, 
 *  Process the data, and Send data back to the Flow
 * 
 *  This example translates an Apex-Defined Variable 
 *  between a Collection of Object Records and a Seraialized String
 * 
 *  Eric Smith - May 2020
 * 
 * 
**/ 

public with sharing class TranslateApexDefinedRecords {

    // Attributes passed in from the Flow
    public class Requests {
    
        @InvocableVariable(label='Input Record String')
        public String inputString;

        @InvocableVariable(label='Input Record Collection')
        public List<SampleClassDescriptor> inputCollection;

    }

    // Attributes passed back to the Flow
    public class Results {

        @InvocableVariable
        public String outputString;

        @InvocableVariable
        public List<SampleClassDescriptor> outputCollection;
    }

    // Expose translateApexDefinedRecords to the Flow
    @InvocableMethod
    public static List<Results> translateADR(List<Requests> requestList) {

        // Instantiate the record collection
        List<SampleClassDescriptor> tcdList = new List<SampleClassDescriptor>();

        // Prepare the response to send back to the Flow
        Results response = new Results();
        List<Results> responseWrapper = new List<Results>();

        // Bulkify proccessing of multiple requests
        for (Requests req : requestList) {

            // Get Input Value(s)
            String inputString = req.inputString;
            tcdList = req.inputCollection;


// Processing Code Goes Here +++++++++++++++++++++++++++++++++++++++++++++++++++++

            // Convert Serialized String to Record Collection
            List<SampleClassDescriptor> collectionOutput = new List<SampleClassDescriptor>();
            if (inputString != null && inputString.length() > 0) {
                collectionOutput = (List<SampleClassDescriptor>)System.JSON.deserialize(inputString, List<SampleClassDescriptor>.class);
            }

            // Convert Record Collection to Serialized String
            String stringOutput = JSON.serialize(tcdList);

// Processing Code Goes Here +++++++++++++++++++++++++++++++++++++++++++++++++++++


            // Set Output Values
            response.outputString = stringOutput;
            response.outputCollection = collectionOutput;
            responseWrapper.add(response);

        }
        // Return values back to the Flow
        return responseWrapper;
    }
}
