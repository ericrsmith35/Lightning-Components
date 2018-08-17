({
  closeTabs: function (cmp, evt, hlp) {
    const workspaceAPI = cmp.find("workspace");
    const closedPinned = cmp.get('v.closePinned');

    // these return promises, so we can concurrently run them in promise.all
    const isConsoleNavPromise = workspaceAPI.isConsoleNavigation();
    const allTabPromise = workspaceAPI.getAllTabInfo();


    // execute isConsoleNavPromise and allTabPromise, no need for them to be syncronous
    Promise.all([isConsoleNavPromise, allTabPromise]).then((values) => {

      const isConsole = values[0];
      if (!isConsole) return; // early return if not in console.

      const allTabs = values[1]; // tabs
      // now go through and close all tabs, return all tabs again for focus and refresh steps.
      return Promise.all(hlp.dispatchTabs(workspaceAPI, allTabs, closedPinned)).then(() => allTabs);

    }).then((tabs) => {
      const firstTabId = tabs[0].tabId;
      // focus and refresh. Let any Catch Bubble up.
      Promise.all([hlp.focusTab(workspaceAPI, firstTabId), hlp.refreshTab(workspaceAPI, firstTabId)]);
    });
  },
})
