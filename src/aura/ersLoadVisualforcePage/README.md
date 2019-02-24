# ersLoadVisualforcePage

This is a generic Lightning Component that will load a Visualforce page in a new tab, passing in the RecordId and other user defined parameters. The original page will be redisplayed when the Visualforce page closes. The component supports both standard and console pages.

## Using the Component

You can use this Lightning Component on a Record Page

### Parameters

#### _(Required)_

- **Button Label** – Text to appear on the Button
- **Button Variant** – Button styling: base, neutral, brand, destructive, success
- **Domain Name** – Your Production or Sandbox domain name (mydomain or mydomain–mysandbox)
- **Visualforce Page Name** – The API Name of the Visualforce Page
- **RecordId Parameter Name** – The name of the URL parameter for the RecordId
- **Additional URL Parameters** – Any other URL parameters & values

## Sample Usage

This screen shows the parameters being set when adding the component to a page.


Here is the component in action in a Console.


