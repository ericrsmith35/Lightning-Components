# ersToggleField

This is a generic Lightning Component that allows a Toggle Button to set/clear a checkbox field.  The Button can be placed anywhere on a Lightning Record Page.

## Using the Component

You can use this Lightning Component on a Record Page.

### Parameters

#### _(Required)_

- **Name of Field to Update** - API Name of the checkbox field

- **Toggle Button Label** - Text to appear to the left of the toggle button

- **Toggle Button Active Message** - Text to appear under the Active toggle

- **Toggle Button Inactive Message** - Text to appear under the Inactive toggle

- **Display Width (Out of 12)** - Set the display width of the component in 12ths of its container (Default = 12 ie:Full Width)

## Sample Usage

Here a Toggle is being added to a Record Page to change what is being displayed.  The Record Page components are filtered based on the value of the toggled field.

![Setup Page](Setup.PNG?raw=true)

The value of the field being toggled can be used to filter which components are displayed on the page.

![Setup Filter](Filter.PNG?raw=true)

This is what the page looks like when the toggle is inactive.

![Inactive](Inactive.PNG?raw=true)

This is what the page looks like when the toggle is active.

![Active](Active.PNG?raw=true)

