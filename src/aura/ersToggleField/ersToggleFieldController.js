({
        doInit : function(component, event, helper) {
       
        //only update the designated field
        var fl = component.get('v.fieldList');
        fl.push(component.get('v.fieldName'));
        console.log(fl);
        component.set('v.fieldList', fl);
        
        //create component using parameters passed in
        $A.createComponent('force:recordData',
            {
                'aura:id' : 'recordEditor',
                fields : fl,
                recordId : component.getReference('v.recordId'),
                targetError : component.getReference('v.recordError'),
                targetRecord : component.getReference('v.record'),
                targetFields : component.getReference('v.simpleRecord'),
                mode : 'EDIT'
            },
            function(cmp, result, err){
                if(result === 'SUCCESS'){
                    component.find('recordDataContainer').set('v.body', cmp);
                }
                else{
                    var t = $A.get('e.force:showToast');
                    t.setParams({
                        title : 'ERROR',
                        message : err,
                        type : 'error'
                    })
                    t.fire();
                }
            }
        )
    },

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
