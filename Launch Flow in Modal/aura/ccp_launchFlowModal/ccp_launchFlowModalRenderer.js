({

// Your renderer method overrides go here
    afterRender : function(component, helper) {
        this.superAfterRender();
        // Write your custom code here. 
        var autoLaunchFlow = component.get("v.autoLaunchFlow");
        if(autoLaunchFlow)
        {
            helper.showModal(component,event,helper);
        }
    }

})