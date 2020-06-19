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

public with sharing class TranslateApexDefinedRecords {         // *** Apex Class Name ***

    // Attributes passed in from the Flow
    public class Requests {
    
        @InvocableVariable(label='Input Record String')
        public String inputString;

        @InvocableVariable(label='Input Record Collection')
        public List<SampleClassDescriptor> inputCollection;     // *** Apex-Defined Class Descriptor Name ***

    }

    // Attributes passed back to the Flow
    public class Results {

        @InvocableVariable
        public String outputString;

        @InvocableVariable
        public List<SampleClassDescriptor> outputCollection;    // *** Apex-Defined Class Descriptor Name ***
    }

    // Expose this Action to the Flow
    @InvocableMethod
    public static List<Results> translateADR(List<Requests> requestList) {

        // Instantiate the record collection
        List<SampleClassDescriptor> tcdList = new List<SampleClassDescriptor>();    // *** Apex-Defined Class Descriptor Name ***

        // Prepare the response to send back to the Flow
        Results response = new Results();
        List<Results> responseWrapper = new List<Results>();

        // Bulkify proccessing of multiple requests
        for (Requests req : requestList) {

            // Get Input Value(s)
            String inputString = req.inputString;
            tcdList = req.inputCollection;


// BEGIN APEX ACTION PROCESSING LOGIC

            // Convert Serialized String to Record Collection
            List<SampleClassDescriptor> collectionOutput = new List<SampleClassDescriptor>();   // *** Apex-Defined Class Descriptor Name ***
            if (inputString != null && inputString.length() > 0) {
                collectionOutput = (List<SampleClassDescriptor>)System.JSON.deserialize(inputString, List<SampleClassDescriptor>.class);    // *** Apex-Defined Class Descriptor Name ***
            }

            // Convert Record Collection to Serialized String
            String stringOutput = JSON.serialize(tcdList);

// END APEX ACTION PROCESSING LOGIC


            // Set Output Values
            response.outputString = stringOutput;
            response.outputCollection = collectionOutput;
            responseWrapper.add(response);

        }
        // Return values back to the Flow
        return responseWrapper;
    }
}