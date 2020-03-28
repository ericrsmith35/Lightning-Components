# datatableLwcFsc

## Lightning Web Component for Flow Screens    

This component allows the user to configure and display a datatable in a Flow screen.

Features:
* The only required paramters are the SObject collection of records and a list of field API names
* The field label and field type will default to what is defined in the object
* Numeric fields will display with the correct number of decimal places as defined in the object
* Lookup fields are supported and will display the referenced record's name field as a clickable link
* All columns are sortable, including lookups (by name)
* The selection column can be multi-select (Checkboxes), single-select (Radio Buttons), or hidden
* A collection of pre-selected rows can be passed into the component
* Inline editing is supported with changed values passed back to the flow
* Unlike the original datatable component, only the edited records will be passed back to the flow
* Optional attribute overrides are supported and can be specified by column # or by field name, including:
  * Alignment
  * Custom Cell Attributes with nested values {name: {name:value}}
  * Editable
  * Header Icon
  * Header Label
  * Other Custom Column Attributes with nested values {name: {name:value}}
  * Custom Type Attributes with nested values {name: {name:value}}
  * Initial Column Width

xx/xx/20 -  Eric Smith -    Version 1.0

## Beta Release Notes:

*I am still actively adding to this component, but please feel free to test and provide feedback on this snapshot of current features*

The component is written for the Account object

The test Flow assumes that the following custom fields are in the Account object:

LABEL|API NAME|TYPE
-----|--------|----
dt Checkbox|dt_Checkbox__c|Checkbox
dt Currency|dt_Currency__c|Currency(16, 2)
dt Date|dt_Date__c|Date
dt Datetime|dt_Datetime__c|Date/Time
dt Email|dt_Email__c|Email
dt KillaBabySeal|dt_KillaBabySeal__c|Picklist (Multi-Select)	
dt Number|dt_Number__c|Number(10, 2)
dt Percent|dt_Percent__c|Percent(6, 2)
dt Phone|dt_Phone__c|Phone
dt Picklist|dt_Picklist__c|Picklist
dt Text|dt_Text__c|Text(25)
dt Text Area|dt_Text_Area__c|Text Area(255)
dt Text Area Long|dt_Text_Area_Long__c|Long Text Area(32768)
dt Text Area Rich|dt_Text_Area_Rich__c|Rich Text Area(32768)
dt Text Encrypted|dt_Text_Encrypted__c|Text (Encrypted)(20)
dt Time|dt_Time__c|Time		
dt URL|dt_URL__c|URL(255)	
