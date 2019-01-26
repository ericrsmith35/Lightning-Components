({   
    doInit : function(component, event, helper) {
        
        // Set component width
        var init = (component.get("v.default") == "On");
        component.set("v.checked", init);
        var size = "slds-size_4-of-4 slds-m-top_xxx-small";
        if (component.get("v.width") == "Half"){
            size = "slds-size_2-of-4 slds-m-top_xxx-small";
        }
        
        // Set component height
        component.set("v.sldsSize", size);
        var height = "largeArea8";
        if (component.get("v.height") == "Small"){
            height = "largeArea4";
        }        
        if (component.get("v.height") == "Large"){
            height = "largeArea12";
        }
        component.set("v.areaHeight", height);
        
        // Set View/Edit mode
        component.set("v.editMode", (component.get("v.mode") == "Edit"));
    },

    handleLoad : function(component, event, helper) {
        // Save current value of the field
        var currentValue = component.find("LTAField").get("v.value");
        component.set("v.fieldValue", currentValue);
        component.set("v.loaded", true);
    },
    
    handleSubmit : function(component, event, helper) {
        // Update record with new field value
        var newValue = component.get("v.fieldValue");
        component.find("LTAField").set("v.value", newValue);
        event.preventDefault(); 							// Prevent default submit
        var fields = event.getParam("fields");
        var fname = component.get("v.fieldName");
        fields[fname] = newValue;
        component.find('recordEditForm').submit(fields); 	// Submit form
    },
    
    handleSaved: function(component, event, helper) {
        // Show Saved Success Message
        component.find("notificationsLibrary").showToast({
            "variant": "success",
            "title": "Success!",
            "message": "The field has been updated."
        });
    },
    
    handleError: function(component, event, helper) {
        // Handle errors
        console.log("Error"); 
    },
    
    handleToggleChanged: function(component, event, helper) {
        // Process Toggle Button
        console.log("Checked: " + component.get("v.checked"));
    },
        
})
