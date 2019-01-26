({   
    doInit : function(component, event, helper) {
        var init = (component.get("v.default") == "On");
        component.set("v.checked", init);
        var size = "slds-size_4-of-4 slds-m-top_xxx-small";
        if (component.get("v.width") == "Half"){
            size = "slds-size_2-of-4 slds-m-top_xxx-small";
        }
        component.set("v.sldsSize", size);
        var height = "largeArea8";
        if (component.get("v.height") == "Small"){
            height = "largeArea4";
        }        
        if (component.get("v.height") == "Large"){
            height = "largeArea12";
        }
        component.set("v.areaHeight", height);
        component.set("v.editMode", (component.get("v.mode") == "Edit"));
    },

    handleLoad : function(component, event, helper) {
        var currentValue = component.find("LTAField").get("v.value");
        component.set("v.fieldValue", currentValue);
        component.set("v.loaded", true);
    },
    
    handleSubmit : function(component, event, helper) {
        var newValue = component.get("v.fieldValue");
        component.find("LTAField").set("v.value", newValue);
        event.preventDefault(); 							// Prevent default submit
        var fields = event.getParam("fields");
        var fname = component.get("v.fieldName");
        fields[fname] = newValue;
        component.find('recordEditForm').submit(fields); 	// Submit form
    },
    
    handleSaved: function(component, event, helper) {
        component.find("notificationsLibrary").showToast({
            "variant": "success",
            "title": "Success!",
            "message": "The field has been updated."
        });
    },
    
    handleError: function(component, event, helper) {
        console.log("Error"); 
    },
    
    handleToggleChanged: function(component, event, helper) {
        console.log("Checked: " + component.get("v.checked"));
    },
        
})
