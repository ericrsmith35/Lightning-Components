/**
     * Get Flow details from the FlowDefinitionView, FlowVersionView and FlowVariableView objects
     * 
     * 05/09/20 -   Eric Smith -    Version 1.0
     * 
     */

public with sharing class FlowDefinitionController {

    Static Final Integer QUERY_LIMIT = 20;        // Batch size for reading FlowDefinitionView records
    Static Final String ACTIVE_THEME = 'slds-theme_shade';    // DIsplay theme for Active Flows when displaying both Active & Inactive

    public class Requests {

        @InvocableVariable(label='Type: "Flow", "ProcessBuilder" or "Both"')
        public String typeSelection;

        @InvocableVariable(label='Status: "Active", "Inactive" or "Both"')
        public String statusSelection;
       
        @InvocableVariable(label='Select API Names greater than or equal to this value')
        public String lowerBoundary; 
        
        @InvocableVariable(label='Select API Names less than or equal to this value')
        public String upperBoundary;
    }

    public class Results {

        @InvocableVariable
        public String FlowVersionRecords;
    }

    // Fields in FlowDefinitionView Object
    public class FlowDefInfo {
        String DurableId;
        String Label;
        String Description;
        String ApiName;
        String ProcessType;
        String LastModifiedBy;
        Datetime LastModifiedDate;
        String TriggerType;
    }

    // Fields in FlowVersionView Object
    public class FlowVerInfo {
        String DurableId;
        String Description;
        String FlowDefinitionViewId;
        Boolean IsTemplate;
        String Label;
        Datetime LastModifiedDate;
        String ProcessType;
        String Status;
        Integer VersionNumber;

        //From FlowDefInfo
        String ApiName;
        String LastModifiedBy;
        String TriggerType;

        //From FlowVarInfo
        String WorkflowObject;      // Process Builder

        //Additional Fields
        String LastModifiedDateString;
        String FlowTypeIcon;
        String FlowStatusIcon;
        String RowShadeValue;
        String Label_name;
        String Label_lookup;
    }
    
    // Fields in FlowVariableView Object
    public class FlowVarInfo {
        String ApiName;
        String DataType;
        String Description;
        String DurableId;
        String FlowVersionId;
        Boolean IsCollection;
        Boolean IsInput;
        Boolean IsOutput;
        String ObjectType;
    }

    @InvocableMethod
    public static List<Results> getFlowDetails(List<Requests> requestList) {

        Results response = new Results();
        String typeSelection = requestList[0].typeSelection;
        String statusSelection = requestList[0].statusSelection;
        String lowerBoundary = requestList[0].lowerBoundary;
        String upperBoundary = requestList[0].upperBoundary;

        FlowDefInfo fdi = new FlowDefInfo();
        FlowVerInfo fvi = new FlowVerInfo();
        FlowVarInfo fvv = new FlowVarInfo();
        String lastDefinitionView;
        List<FlowDefInfo> fdRecords = new List<FlowDefInfo>();
        List<FlowVerInfo> fvRecords = new List<FlowVerInfo>();
        List<String> pbTypes = new List<String>();
        pbTypes.add('CustomEvent');
        pbTypes.add('InvocableProcess');
        pbTypes.add('Workflow');
        String pbTypeList = 'CustomEvent, InvocableProcess, Workflow';
        String ActiveString = 'Active';
        Boolean isMatch = true;
        String saveObjectType = '';
        String saveIconType = '';
        String saveIconStatus = '';
        String saveRowShadeValue;

        if(String.isEmpty(lowerBoundary)) {
            lowerBoundary = 'A';
        }
        if(String.isEmpty(upperBoundary)) {
            upperBoundary = 'Z'.repeat(255);
        }

        // Set batch size for FLowDefinitionView Query
        Integer recordCount = [SELECT count() FROM FlowDefinitionView];
        Integer sizeBlock = recordCount/QUERY_LIMIT + (math.mod(recordCount,QUERY_LIMIT)!=0?1:0);
System.Debug('rc,sb: '+recordCount+', '+sizeBlock);
        Set<Id> fdvids = new Set<Id>();     // Store all FlowDefinitionView Ids
        Set<Id> fdvBatch = new Set<Id>();   // Store only current iteration of FlowDefinitionView Ids

        for(Integer i=0;i<sizeBlock;i++){
System.Debug('i - '+i);
            for(FlowDefinitionView fd : [
                SELECT  DurableId,
                        ActiveVersionId,
                        ApiName,
                        Builder,
                        Description,
                        InstalledPackageName,
                        IsActive,
                        IsOutOfDate,
                        IsTemplate,
                        Label,
                        LastModifiedBy,
                        LastModifiedDate,
                        LatestVersionId,
                        ManageableState,
                        NamespacePrefix,
                        ProcessType,
                        TriggerType
                FROM    FlowDefinitionView 
                WHERE   DurableId NOT IN:fdvids
                ORDER BY Label ASC 
                LIMIT   :QUERY_LIMIT]) {
                try{
System.Debug('L-A-U: ['+lowerBoundary+']'+fd.ApiName+'['+upperBoundary+']');   
                    fdvids.add(fd.DurableId);            
                    if (lowerBoundary <= fd.ApiName && fd.ApiName <= upperBoundary) {
                        fdvBatch.add(fd.DurableId); 
                        fdi.DurableId = fd.DurableId;
                        fdi.ApiName = fd.ApiName;                    
                        fdi.LastModifiedBy = fd.LastModifiedBy;
                        fdi.TriggerType = fd.TriggerType;
                        fdRecords.add(fdi);
                        fdi = new FlowDefInfo();
                    }
                } catch(Exception e) {
                    System.Debug('Exception('+fd.DurableId+') '+e); 
                }
            }
System.Debug('fdvBatch - '+fdvBatch);
            lastDefinitionView = '';

            for(FlowVersionView fv : [
                SELECT  DurableId, 
                        Description, 
                        FlowDefinitionViewId, 
                        IsTemplate, 
                        Label, 
                        LastModifiedDate, 
                        ProcessType, 
                        RunInMode, 
                        Status, 
                        VersionNumber
                FROM    FlowVersionView
                WHERE   FlowDefinitionViewId IN:fdvBatch 
                ORDER BY FlowDefinitionViewId ASC
                ]) {

                // Check Type and Status parameters
                isMatch = true;
                if(typeSelection == 'Flow' && pbTypes.indexOf(fv.ProcessType) != -1) isMatch = false;
                if(typeSelection == 'ProcessBuilder' && pbTypes.indexOf(fv.ProcessType) == -1) isMatch = false;
                if(statusSelection == 'Active' && fv.Status != 'Active') isMatch = false;
                if(statusSelection == 'Inactive' && fv.Status == 'Active') isMatch = false;
                                
                if(isMatch) {
                    // FlowVersionView Fields
                    fvi.DurableId = fv.DurableId;
                    fvi.Description = fv.Description;
                    fvi.FlowDefinitionViewId = fv.FlowDefinitionViewId;
                    fvi.IsTemplate = fv.IsTemplate;
                    fvi.Label = fv.Label;
                    fvi.Label_name = fv.Label;
                    fvi.Label_lookup = (pbTypeList.contains(fv.ProcessType)) 
                        ? '.lightning.force.com/processui/processui.app' 
                        : '.lightning.force.com/builder_platform_interaction/flowBuilder.app?flowId='+fv.DurableId;
                    fvi.LastModifiedDateString = String.valueOf(fv.LastModifiedDate);       
                    fvi.LastModifiedDate = Datetime.valueOf(fvi.LastModifiedDateString);
                    fvi.ProcessType = fv.ProcessType;
                    fvi.Status = fv.Status;
                    fvi.VersionNumber = fv.VersionNumber;
                    fvi.FlowStatusIcon = (fv.status == 'Active') ? 'utility:undeprecate' : 'utility:deprecate';

                    // FlowDefinitionView Fields
                    for(FlowDefInfo fdr : fdRecords) {
                        if(fdr.DurableId == fv.FlowDefinitionViewId) {
                            fvi.ApiName = fdr.ApiName;
                            fvi.LastModifiedBy = fdr.LastModifiedBy;
                            fvi.TriggerType = fdr.TriggerType;
                            break;
                        }
                    }

                    // FlowVariableView Fields
                    saveRowShadeValue = 'slds-theme_default';
                    if(lastDefinitionView != fv.FlowDefinitionViewId) {   
                        saveRowShadeValue = (statusSelection == 'Both' && fv.Status == 'Active') ? ACTIVE_THEME : 'slds-theme_default' ;
                        switch on fv.ProcessType {
                            when 'CustomEvent', 'InvocableProcess', 'Workflow' {    //Process Builder
                                saveIconType = 'utility:process';
                                for(FlowVariableView fr : [
                                    SELECT  ObjectType 
                                    FROM    FlowVariableView 
                                    WHERE   (FlowVersionViewId = :fv.DurableId) AND 
                                            (ApiName = 'myVariable_current')
                                    LIMIT   1]) {
                                    saveObjectType = fr.ObjectType;
                                } 
                            }
                            when else {                                             //Flow
                                saveObjectType = '';
                                saveIconType = 'utility:flow';
                            }
                             
                        }                
                    }
                    fvi.WorkflowObject = saveObjectType;
                    fvi.FlowTypeIcon = saveIconType;
                    fvi.RowShadeValue = saveRowShadeValue;
                    fvRecords.add(fvi);
                    fvi = new FlowVerInfo();
                    lastDefinitionView = fv.FlowDefinitionViewId;
                }
            }
            fdvBatch = new Set<Id>();
            fdRecords = new List<FlowDefInfo>();
System.Debug('fvRecords: '+fvRecords);
        }
System.Debug('response: '+response);
        List<Results> responseWrapper = new List<Results>();
        response.FlowVersionRecords = JSON.serialize(fvRecords);
        responseWrapper.add(response);
        return responseWrapper;
    }

}