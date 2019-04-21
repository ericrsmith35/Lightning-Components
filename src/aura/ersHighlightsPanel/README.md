# ersHighlightsPanel

This is a generic Lightning Component that displays a Highlights Panel of up to 10 fields.  The component can be placed anywhere on a Lightning Record Page.

## Using the Component

You can use this Lightning Component on a Record Page.

### Parameters

#### _(Required)_

- **Object API Name** - API Name of the Record Page Object

- **Field 01 API Name** - API Name of the first field to display in the panel

#### _(Optional)_

- **Object Icon** - Salesforce designation for an icon to display (example standard:account)

- **Highlights Panel Title** - Header text to appear to the right of the icon

- **Field 02 API Name** - API Name of the next field to display in the panel

- ...

- **Field 10 API Name** - API Name of the next field to display in the panel

## Sample Usage

Sample parameter values when adding the component to the page

![Setup Page](Configure.PNG?raw=true)

Sample Highlights Panel (see ersToggleField for the Toggle Button component)

![Sample Panel](Example.PNG?raw=true)
