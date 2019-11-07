({
    doInit : function(component, event, helper) {
        
    },
    
    callFlow : function(component, event, helper) {
        // Find the component whose aura:id is "flowData"
        var flow = component.find("flowData");
        var inputVariables = [
            { name : component.get('v.inputVariable'), type : "String", value: component.get("v.recordId") }
        ];
        
        // Call Flow - (Flow finishes with navigate to SObject record)
        flow.startFlow(component.get('v.flowAPIName'), inputVariables);
    },    
})
