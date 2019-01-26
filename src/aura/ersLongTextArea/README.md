# ersLongTextArea

This is a generic Lightning Component that allows for the display or editing of a Long Text Area field on the record page with a larger input box than what is standard and the ability to toggle it on and off.

Additional parameters include setting the width and starting height of the field display area and setting startup mode to on or off and the maximum size of the field.  The height of the input box can be adjusted by the user by dragging the bottom right corner.

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

Drag the ersLongTextArea component onto your page. **(1)**  Then configure the parameters. **(2)**

![Setup Page](Configure.png?raw=true)

This page shows the component in View mode, Full width, and Medium height. **(1)** 
And it shows another copy of the component in Edit mode, Half width, and Small height. **(2)** 

![Sample 1](ViewEdit.png?raw=true)

This page shows the component in View mode, Half width, and Large height. **(1)**
And it shows another copy of the component Toggled Off. **(2)**

![Sample 2](TallOff.png?raw=true)
