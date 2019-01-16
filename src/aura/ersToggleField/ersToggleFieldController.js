({
    doRender : function(component, event, helper) {
        
        //Get Field Value
        var fieldName = component.get("v.fieldName");
        var simpleRecord = component.get("v.simpleRecord");
		component.set("v.checked", simpleRecord [ fieldName ]);       
    },
    
    handleSaveRecord : function(component, event, helper) {
        
        //Field Update
        var fieldName = component.get("v.fieldName");
        var simpleRecord = component.get("v.simpleRecord");        
        simpleRecord [ fieldName ] = component.find('togglebtn').get('v.checked');
        component.set("v.simpleRecord", simpleRecord);
        
        //Standard way to save a record template using Lightning Data Service
        component.find("recordEditor").saveRecord($A.getCallback(function(saveResult){
            if(saveResult.state === "SUCCESS" || saveResult.state === "DRAFT"){
                console.log("Save completed successfully.");       
                $A.get("e.force:closeQuickAction").fire();
            }else if(saveResult.state === "INCOMPLETE"){
                console.log("User is offline, device doesn't support drafts.");
            }else if(saveResult.state === "ERROR"){
                console.log("Problem saving record, error: " + JSON.stringify(saveResult.error));
            }else{
                console.log("Unknown problem, state: " + saveResult.state + ", error: " + JSON.stringify(saveResult.error));
            }
        }));
    },   

})
