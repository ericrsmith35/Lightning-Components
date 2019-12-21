({
    showModal : function(component,event,helper){

        if($A.util.isEmpty(component.get("v.flowName")))
        {
            helper.showToast(component,'error','ERROR','No Flow Name Defined', 'dismiss');
        }
        else
        {
            var modalBody;
            $A.createComponent("c:ccp_renderFlow", 
                               {
                                    flowName: component.get("v.flowName"),
                                    flowInputVariables: component.get("v.flowInputVariables"),
                                    flowOutputVariables: component.getReference("v.flowOutputVariables"),
                                    hideFlowTransitionOverlay: component.get("v.hideFlowTransitionOverlay")
                               },
                               function(content, status) {
                                   if (status === "SUCCESS") {
                                       modalBody = content;
                                       component.find('overlayLib').showCustomModal({
                                           header: component.get("v.flowModalHeader"),
                                           body: modalBody, 
                                           showCloseButton: true,
                                           cssClass: "",
                                           closeCallback: function() {
                                               //alert('You closed the alert!');
                                           }
                                       })
                                   }                               
                               });
        }

    },
    
    showToast : function(component,type,title,message, mode){
        
        var toastEvent = $A.get("e.force:showToast");
        
        toastEvent.setParams({
            "title": title,
            "message": message,
            "type" : type,
            "mode" : mode,
            "duration" : 8000
            
        });
        toastEvent.fire();        
    }
})