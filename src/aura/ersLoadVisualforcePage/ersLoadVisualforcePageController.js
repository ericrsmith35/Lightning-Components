/**
Lightning Component: Load Visualforce Page
Copyright 2019 - Eric R. Smith

Used to load a Visualforce page in a new tab.  The original page will be redisplayed
when the Visualforce page closes.  Supports both standard and console pages.

*/

({
    doInit : function(component, event, helper) {
		var params = new Array();
		params.push(component.get('v.recordIdVar') + '=' + component.get('v.recordId'));
		params.push(component.get('v.otherParams'));
		component.set('v.queryString', params.join('&'))
    },

    openPage : function(component, event, helper) {

        // Show spinner once button is pressed
        var spinner = component.find('spinner');
        $A.util.removeClass(spinner, 'slds-hide');

        // Build url for Visualforce page
        var vfURL = 'https://' + component.get("v.domain") + '--c.visualforce.com/apex/';
        vfURL = vfURL + component.get("v.pageName") + '?';
        vfURL = vfURL + component.get("v.queryString");
        console.log("VF URL: ",vfURL);

        // Check to see if running in a Console
        var workspaceAPI = component.find("workspace");
        workspaceAPI.isConsoleNavigation().then(function(consoleResponse) {            
            console.log("IsConsole: ", consoleResponse);
            if (consoleResponse) {

                // Save current tab info
                workspaceAPI.getFocusedTabInfo().then(function(tabResponse) {
                    var closeTabId = tabResponse.tabId;
                    var closeTitle = tabResponse.title;
                    var parentTabId = tabResponse.parentTabId;
                    var isSubtab = tabResponse.isSubtab;
                    console.log("Current Tab: ", closeTabId + " | " + closeTitle);
                    console.log("Is Sub: ",isSubtab," ParentId: ",parentTabId);

                    // Open Visualforce Page in a new tab
                    if (isSubtab) {
                        workspaceAPI.openSubtab({
                            parentTabId: parentTabId,
                            url: vfURL,
                            focus: true
                        }).then(function(openSubResponse) {
                            console.log("New SubTab Id: ", openSubResponse);
                        })
                        .catch(function(error) {
                            console.log(error);
                        });                        
                    } else {
                        workspaceAPI.openTab({
                            url: vfURL,
                            focus: true
                        }).then(function(openParResponse) {
                            console.log("New ParentTab Id: ", openParResponse);
                        })
                        .catch(function(error) {
                            console.log(error);
                        });                        
                    }

                    // Because exiting the VF page will reopen the object record,
                    // close the tab we started on
                    if (tabResponse.closeable && !tabResponse.pinned) {
                        workspaceAPI.closeTab({
                            tabId: closeTabId
                        }).then(function(closeResponse) {
                            console.log("Closed: ", closeTitle);                      
                        })
                        .catch(function(error) {
                            console.log(error);
                        });                            
                    } else {
                        console.log("Left Open: ", tabResponse.title);
                    }
                })
                .catch(function(error) {
                    console.log(error);
                }); 
            } else {
                // Handle non-console user
                console.log("Not in Console");
                var urlEvent = $A.get("e.force:navigateToURL");
                urlEvent.setParams({
                     "url": vfURL
                });
                urlEvent.fire();
            } 
        })
        .catch(function(error) {
            console.log(error);
        }); 
        
    },
    
})
