({
    doInit:function(component, event, helper){
        var flow = component.find("flowRenderer");
        /*var inputVariables = [
            { 
                name : "currRecordId", type : "String", value: component.get("v.sprdRecordId") 
            }
        ];*/
        var flowName = component.get("v.flowName");
        var flowInputVariables = component.get("v.flowInputVariables");
        if($A.util.isEmpty(flowInputVariables))
        {
            flow.startFlow(flowName);
        }
        else
        {
            flow.startFlow(flowName, flowInputVariables);
        }
        
    },
    
    handleStatusChange : function (component, event) {
        if(event.getParam("status") === "FINISHED") {
            component.set("v.flowStatus", "FINISHED");
            var flowOutputVariables = event.getParam("outputVariables");
            component.set("v.flowOutputVariables",flowOutputVariables);
            component.find("overlayLib").notifyClose();
            
        }
    }
    
})