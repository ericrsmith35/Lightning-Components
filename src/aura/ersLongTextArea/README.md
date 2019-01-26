# ersLongTextArea

This is a generic Lightning Component that allows for the display or editing of a Long Text Area field on the record page with a larger input box than what is standard and the ability to toggle it on and off.

Additional parameters include setting the width and height of the field display area and setting startup mode to on or off and the maximum size of the field.  The Button can be placed anywhere on a Lightning Record Page.

## Using the Component

You can use this Lightning Component on a Record Page.

### Parameters

#### _(Required)_

- **Long Text Area Field API Name** - API Name of the Long Text Area field

#### _(Optional)_

- **Toggle Button Label** - Text to appear to the left of the toggle button

- **Starting Phase for Toggle** - Start with the field Displayed (On) or Hidden (Off) [Default: On]

- **Component Width** - Display the text box in the (Full) or (Half) width of the component [Default: Full]

- **Component Height** - Display the text box height as 4rem (Small), 8rem (Medium) or 12rem (Large) [Default: Medium]

- **View or Edit Mode** - (View) mode displays the field only, (Edit) mode adds an Update button [Default: Edit]

- **Maximum Field Length** - Set this to be the size of your Long Text Area field in characters [Default: 32000]

## Sample Usage

Here a Toggle is being added to a Record Page to change what is being displayed.  The Record Page components are filtered based on the value of the toggled field.

![Setup Page](Setup.PNG?raw=true)

The value of the field being toggled can be used to filter which components are displayed on the page.

![Setup Filter](Filter.PNG?raw=true)

This is what the page looks like when the toggle is inactive.

![Inactive](Inactive.PNG?raw=true)

This is what the page looks like when the toggle is active.

![Active](Active.PNG?raw=true)

