({
    doInit: function (component, event, helper) {
        console.log('Label 1: [' + component.get("v.buttonLabel1") + ']');
        if (component.get("v.buttonLabel1"))
            component.set("v.isButton1", true);
        console.log('Label 2: [' + component.get("v.buttonLabel2") + ']');
        if (component.get("v.buttonLabel2"))
            component.set("v.isButton2", true);
        console.log('Label 3: [' + component.get("v.buttonLabel3") + ']');
        if (component.get("v.buttonLabel3"))
            component.set("v.isButton3", true);
        console.log('Label 4: [' + component.get("v.buttonLabel4") + ']');
        if (component.get("v.buttonLabel4"))
            component.set("v.isButton4", true);
        console.log('Label 5: [' + component.get("v.buttonLabel5") + ']');
        if (component.get("v.buttonLabel5"))
            component.set("v.isButton5", true);
        var calcCount = 12 / parseInt(component.get("v.buttonCount"),10);
        component.set("v.setSize", calcCount);
        if (component.get("v.buttonSize").toLowerCase() == 'full')
            component.set("v.buttonClass", 'slds-size_full');
    },

    selectAction1 : function( component, event, helper) {
        var actionAPI = component.find("quickActionAPI");
        var quickAction = component.get("v.objectName1")+"."+component.get("v.actionName1");
        console.log(quickAction);
        var args = {actionName: quickAction, entityName: component.get("v.objectName1")};
        actionAPI.selectAction(args).then(function(result) {
            var fields = result.targetableFields;
            console.log(fields);            
        }).catch(function(e){
            if(e.errors){
                console.log(e);
            }
        });
    },

    selectAction2 : function( component, event, helper) {
        var actionAPI = component.find("quickActionAPI");
        var quickAction = component.get("v.objectName2")+"."+component.get("v.actionName2");
        console.log(quickAction);
        var args = {actionName: quickAction, entityName: component.get("v.objectName2")};
        actionAPI.selectAction(args).then(function(result) {
            var fields = result.targetableFields;
            console.log(fields);            
        }).catch(function(e){
            if(e.errors){
                console.log(e);
            }
        });
    },

    selectAction3 : function( component, event, helper) {
        var actionAPI = component.find("quickActionAPI");
        var quickAction = component.get("v.objectName3")+"."+component.get("v.actionName3");
        console.log(quickAction);
        var args = {actionName: quickAction, entityName: component.get("v.objectName3")};
        actionAPI.selectAction(args).then(function(result) {
            var fields = result.targetableFields;
            console.log(fields);            
        }).catch(function(e){
            if(e.errors){
                console.log(e);
            }
        });
    },

    selectAction4 : function( component, event, helper) {
        var actionAPI = component.find("quickActionAPI");
        var quickAction = component.get("v.objectName4")+"."+component.get("v.actionName4");
        console.log(quickAction);
        var args = {actionName: quickAction, entityName: component.get("v.objectName4")};
        actionAPI.selectAction(args).then(function(result) {
            var fields = result.targetableFields;
            console.log(fields);            
        }).catch(function(e){
            if(e.errors){
                console.log(e);
            }
        });
    },

    selectAction5 : function( component, event, helper) {
        var actionAPI = component.find("quickActionAPI");
        var quickAction = component.get("v.objectName5")+"."+component.get("v.actionName5");
        console.log(quickAction);
        var args = {actionName: quickAction, entityName: component.get("v.objectName5")};
        actionAPI.selectAction(args).then(function(result) {
            var fields = result.targetableFields;
            console.log(fields);            
        }).catch(function(e){
            if(e.errors){
                console.log(e);
            }
        });
    },

})
