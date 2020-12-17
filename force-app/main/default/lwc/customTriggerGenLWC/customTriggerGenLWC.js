import { api, LightningElement, track, wire } from "lwc"; // Import "api, wire, track, LightningElement" library from "Lightning Web Component"
import getObjFields from "@salesforce/apex/NetsuiteSFTriggerMapping.getObjFields"; // Call "getObjFields" method situated in the backend class "NetsuiteSFTriggerMapping"
import getAllObjects from "@salesforce/apex/NetsuiteSFTriggerMapping.getAllObjects"; // Call "getAllObjects" method situated in the backend class "NetsuiteSFTriggerMapping"
import { ShowToastEvent } from "lightning/platformShowToastEvent"; // Import "Toast Event" library from "Lightning PlatformShowToastEvent"

export default class CustomTriggerGenLWC extends LightningElement {
  @track isLoading = true; // Make this variable to "True" for showing Spinner
  @track netSuitObjLabel = ""; //Store Label of Netsuite object without Space - picklist1
  @track netSuitObjLabelWithSpace = ""; //Store Label of Netsuite object with Space - picklist1
  @track netSuitObjApiName = ""; //Store value/APIname of Netsuite object - picklist1
  @track sfObjLabel = ""; //Store Label of Salesforce object with Space - picklist2
  @track sfObjWithOutSpaceLabel = ""; //Store Label of Salesforce object without Space - picklist2
  @track sfObjAPIName = ""; //Store value/APIname of Salesforce object - picklist2
  @track selectedSFFieldName = "";
  @track createEditLabel = ""; //Store Label of section "TWO" - picklist3
  @track createEditLabelValue = ""; //Store value of section "TWO" - picklist3
  @track triggerButtonFlowLabel = ""; //Store Label of section "THREE" - picklist4
  @track triggerButtonFlowLabelValue = ""; //Store value of section "THREE" - picklist4
  @track afterTriggerLabel = ""; //Store Label of section "FOUR-ONE" - picklist5
  @track afterTriggerLabelValue = ""; //Store value of section "FOUR-ONE" - picklist5
  @track afterButtonLabel = ""; //Store Label of section "FOUR-TWO" - picklist6
  @track afterButtonLabelValue = ""; //Store value of section "FOUR-TWO" - picklist6
  @track afterWorkflowLabel = ""; //Store Label of section "FOUR-THREE" - picklist7
  @track afterWorkflowLabelValue = ""; //Store value of section "FOUR-THREE" - picklist7
  @track afterTriggerFutureQueueLabel = ""; //Store Label of section "FIVE" - picklist8
  @track afterTriggerFutureQueueLabelValue = ""; //Store value of section "FIVE" - picklist8
  @track nsFieldName = ""; //Store API name of Netsuite field
  @track fieldMapping = []; //Store data of selected Netsuite field such as name, type and list salesforce obejct fields which is related to Netsuite field type for third page.
  @track nsObjFieldList = []; //Store data of selected Netsuite field such as name, type and list salesforce obejct fields which is related to Netsuite field type for second page.
  @track error;
  @track boolSelectObjVisible = true; //Boolean value used for first page to be shown in the front-end.
  @track boolFieldMapVisible = false; //Boolean value used for second page to be shown in the front-end.
  @track objects = []; //Store all salesforce objects which we can see in the picklist of section "One" in first page.
  @track messsage = ""; //Show error message which comes from backend apex class
  @track isMessageVisible = false; //Boolean variable used for error message to be visible.
  @track boolSectionOne = true; //Boolean variable used for section "ONE" - picklist1 and picklist2.
  @track boolSectionTwo = false; //Boolean variable used for section "TWO" - picklist3.
  @track boolSectionThree = false; //Boolean variable used for section "THREE" - picklist4.
  @track boolSectionFour = false; //Boolean variable used for section "FOUR-ONE", "SECTION-TWO", "SECTION-THREE".
  @track boolSectionFourOne = false; //Boolean variable used for section "FOUR-ONE" - picklist5.
  @track boolSectionFourTwo = false; //Boolean variable used for section "FOUR-TWO" - picklist6.
  @track boolSectionFourThree = false; //Boolean variable used for section "FOUR-THREE" - picklist7.
  @track boolSectionFive = false; //Boolean variable used for section "FIVE" - picklist8.
  @track isSectionOneDisabled = false; //Boolean variable used for section "ONE" to be disabled after click on "Next" button at 1st time. 
  @track isSectionTwoDisabled = false; //Boolean variable used for section "TWO" to be disabled after click on "Next" button at 2nd time. 
  @track isSectionThreeDisabled = false; //Boolean variable used for section "THREE" to be disabled after click on "Next" button at 3rd time. 
  @track isSectionFourOneDisabled = false; //Boolean variable used for section "FOUR-ONE" to be disabled after click on "Next" button at 4th time. 
  @track isSectionFourTwoDisabled = false; //Boolean variable used for section "FOUR-TWO" to be disabled after click on "Next" button at 4th time. 
  @track isSectionFourThreeDisabled = false; //Boolean variable used for section "FOUR-THREE" to be disabled after click on "Next" button at 4th time. 
  @track isSectionFiveDisabled = false; //Boolean variable used for section "FIVE" to be disabled after click on "Next" button at 5th time. 
  @track boolIdWithChild = false; //Boolean variable if user selects fields of "ID" Type with child and allows to show String type fields.
  @track boolIdWithoutChild = false; //Boolean variable if user selects fields of "ID" Type with no child and allows to show String type fields.
  @track boolReferenceWithChild = false; //Boolean variable if user selects fields of "REFERENCE" Type with child and allows to show String type fields.
  @track boolReferenceWithoutChild = false; //Boolean variable if user selects fields of "REFERENCE" Type with no child and allows to show String type fields.
  @track boolDateWithChild = false; //Boolean variable if user selects fields of "DATE" Type with child and allows to show String type fields.
  @track boolDateWithoutChild = false; //Boolean variable if user selects fields of "DATE" Type with no child and allows to show String type fields.
  @track boolDateTimeWithChild = false; //Boolean variable if user selects fields of "DATETIME" Type with child and allows to show String type fields.
  @track boolDateTimeWithoutChild = false; //Boolean variable if user selects fields of "DATETIME" Type with no child and allows to show String type fields.
  @track boolStringWithChild = false; //Boolean variable if user selects fields of "STRING" Type with child and allows to show String type fields.
  @track boolStringWithoutChild = false; //Boolean variable if user selects fields of "STRING" Type with no child and allows to show String type fields.
  @track boolDoubleWithChild = false; //Boolean variable if user selects fields of "DOUBLE" Type with child and allows to show String type fields.
  @track boolDoubleWithoutChild = false; //Boolean variable if user selects fields of "DOUBLE" Type with no child and allows to show String type fields.
  @track boolBooleanWithChild = false; //Boolean variable if user selects fields of "BOOLEAN" Type with child and allows to show String type fields.
  @track boolBooleanWithoutChild = false; //Boolean variable if user selects fields of "BOOLEAN" Type with no child and allows to show String type fields.
  @track boolBillingAddress = false; //Boolean variable if user selects Billing Address field and allows to show Billing Address fields.
  @track boolShippingAddress = false; //Boolean variable if user selects Shipping Address field and allows to show Shipping Address fields.
  @track boolBillBillAddress = false; //Boolean variable if user selects Billing Address on NetSuite side and Billing Address on Salesforce side and allows to show address fields. 
  @track boolBillShipAddress = false; //Boolean variable if user selects Billing Address on NetSuite side and Shipping Address on Salesforce side and allows to show address fields. 
  @track boolShipBillAddress = false; //Boolean variable if user selects Shipping Address on NetSuite side and Billing Address on Salesforce side and allows to show address fields. 
  @track boolShipShipAddress = false; //Boolean variable if user selects Shipping Address on NetSuite side and Shipping Address on Salesforce side and allows to show address fields. 
  @track apexIdWithChildGenerator = []; //Store selected mapping fields of "ID" datatype if field has a child
  @track apexIdWithoutChildGenerator = []; //Store selected mapping fields of "ID" datatype if field has no child
  @track apexReferenceWithChildGenerator = []; //Store selected mapping fields of "REFERENCE" datatype if field has a child
  @track apexReferenceWithoutChildGenerator = []; //Store selected mapping fields of "REFERENCE" datatype if field has no child
  @track apexDateWithChildGenerator = []; //Store selected mapping fields of "DATE" datatype if field has a child
  @track apexDateWithoutChildGenerator = []; //Store selected mapping fields of "DATE" datatype if field has no child
  @track apexDateTimeWithChildGenerator = []; //Store selected mapping fields of "DATETIME" datatype if field has a child
  @track apexDateTimeWithoutChildGenerator = []; //Store selected mapping fields of "DATETIME" datatype if field has no child
  @track apexStringWithChildGenerator = []; //Store selected mapping fields of "STRING" datatype if field has a child
  @track apexStringWithoutChildGenerator = []; //Store selected mapping fields of "STRING" datatype if field has no child
  @track apexDoubleWithChildGenerator = []; //Store selected mapping fields of "DOUBLE" datatype if field has a child
  @track apexDoubleWithoutChildGenerator = []; //Store selected mapping fields of "DOUBLE" datatype if field has no child
  @track apexBooleanWithChildGenerator = []; //Store selected mapping fields of "BOOLEAN" datatype if field has a child
  @track apexBooleanWithoutChildGenerator = []; //Store selected mapping fields of "BOOLEAN" datatype if field has no child
  @track apexBillingAddressGenerator = []; //Store selected Billing mapping fields of "ADDRESS" datatype
  @track apexShippingAddressGenerator = []; //Store selected Shipping mapping fields of "ADDRESS" datatype
  @track sfObjApi = ""; // Store selected Salesforce Object API Name

  @track generateApex = false; // Close the Dialog(Modal) box after set to "False"
  @track boolCreateTriggerOnCreate = false; //boolean value to show the fieldmapping for "Create"-"Trigger"-"On Create" Picklist Values
  @track boolCreateTriggerOnCreateQueueable = false; // boolean value to show the fieldmapping for "Create"-"Trigger"-"On Create"-"Queueable" Picklist Values
  @track boolCreateTriggerOnCreateFuture = false; // boolean value to show the fieldmapping for "Create"-"Trigger"-"On Create"-"Future" Picklist Values
  @track boolCreateTriggerOnEdit = false; // boolean value to show the fieldmapping for "Create"-"Trigger"-"On Edit" Picklist Values
  @track boolCreateButton = false; // boolean value to show the fieldmapping for "Create"-"Button"-"" Picklist Values
  @track isStartOverButtonVisible = false; //Boolean value to show the button "Start Over" in 1st page.
  @track netSuitePackageNamespace = '';
  @track boolNetSuiteCompany = false;//Boolean value if user choose "NetSuite Company" in picklist1
  @track boolNetSuiteItem = false;//Boolean value if user choose "NetSuite Item" in picklist1

  //static Netsuite object name and show the picklist1
  nSuiteObjectApiName = [
    { key: "1", apiKey: "ns_api_test05__BW_Company__c", label: "NetSuite Company", isSelected: false },
    { key: "2", apiKey: "ns_api_test05__BW_Item__c", label: "NetSuite Item", isSelected: false }
  ];

  //Show the Created, Edit and Create and Edit Drop down.
  createEditOption = [
    { key: "1", apiKey: "create", label: "Create", isDisabled: false, isSelected: false },
    { key: "2", apiKey: "edit", label: "Edit (to be developed...)", isDisabled: true, isSelected: false },
    { key: "3", apiKey: "createandoredit", label: "Create and/or Edit (to be developed...)", isDisabled: true, isSelected: false }
  ];

  //Show the Trigger, Button and WorkFlow.
  triggerButtonFlowOption = [
    { key: "1", apiKey: "trigger", label: "Trigger", isDisabled: false, isSelected: false },
    { key: "2", apiKey: "button", label: "Button Click (to be developed...)", isDisabled: true, isSelected: false },
    { key: "3", apiKey: "workflow", label: "Workflow or Flow (to be developed...)", isDisabled: true, isSelected: false },
  ];
  
  // Show this picklist5 after selecting "trigger" option in "triggerButtonFlowOption" picklist 4
  afterTriggerCreateEditOption = [
    { key: "1", apiKey: "createTriggerOnCreate", label: "Created", isDisabled: false, isSelected: false },
    { key: "2", apiKey: "editTriggerOnEdit", label: "Edited (to be developed...)", isDisabled: true, isSelected: false },
  ];

  // Show this picklist6 after selecting "button" option in "triggerButtonFlowOption" picklist 4
  afterButtonOption = [
    { key: "1", apiKey: "createButton", label: "On Create Button", isDisabled: false, isSelected: false },
    { key: "2", apiKey: "editButton", label: "On Edit Button (to be developed...)", isDisabled: true, isSelected: false },
  ];

  // Show this picklist7 after selecting "Workflow" option in "triggerButtonFlowOption" picklist 4
  afterWorkFlowOption = [
    { key: "1", apiKey: "createWorkflow", label: "On Create Workflow", isDisabled: false, isSelected: false },
    { key: "2", apiKey: "editWOrkflow", label: "On Edit Workflow (to be developed...)", isDisabled: true, isSelected: false },
  ];

    // Show this picklist8 after selecting "Created" option in "afterTriggerCreateEditOption" picklist 5
    afterTriggerFutureQueueableOption = [
      { key: "1", apiKey: "createTriggerOnQueueable", label: "Enqueueable", isDisabled: false, isSelected: false },
      { key: "2", apiKey: "createTriggerOnFuture", label: "Future", isDisabled: false, isSelected: false },
    ];

  //Get all salesforce objects
  connectedCallback() {
    getAllObjects()
      .then((result) => {
        for (let key in result) {
          if (result.hasOwnProperty(key)) {
            this.objects.push({
              value: result[key],
              key: key,
              isSelected: false, //Default selected value false
            });
          }
        }

        //Sort salesforce objectname by Label from A-Z
        this.objects.sort(function (x, y) {
          if (x.value < y.value) {
            return -1;
          }
          if (x.value > y.value) {
            return 1;
          }
          return 0;
        });
        this.isLoading = false;
      })
      .catch((error) => {
        this.error = error;
      });
  }

  //If Option is Selected set selected true
  isOptionSelected(arr, val) {
    for (var i in arr) {
      if (arr[i].apiKey == val) {
        arr[i].isSelected = true;
      } else {
        arr[i].isSelected = false;
      }
    }
  }

  //Hide previous Drop Down if selected Option is None.
  hideSelectedOption(startClass, endClass, value) {
    for (var i = startClass; i <= endClass; i++) {
      if (this.boolSectionTwo && i == 3) {
        this.isOptionSelected(this.createEditOption, value); //Set Default selected value false
        this.template.querySelector('.piclistOption3').value = 'select'; //Set selected picklist value default selected
        this.boolSectionTwo = false; // Hide Bottom Section
        this.createEditLabelValue = '';
        this.createEditLabel = "";
      }
      if (this.boolSectionThree && i == 4) {
        this.isOptionSelected(this.triggerButtonFlowOption, value); //Set Default selected value false
        this.template.querySelector('.piclistOption4').value = 'select';
        this.boolSectionThree = false;
        this.createEditLabelValue = '';
        this.triggerButtonFlowLabelValue = "";
      }
      if (this.boolSectionFourOne && i == 5 && this.boolSectionFour) {
        this.isOptionSelected(this.afterTriggerCreateEditOption, value); //Set Default selected value false
        this.template.querySelector('.piclistOption5').value = 'select';
        this.boolSectionFourOne = false;
        this.boolSectionFour = false;
        this.triggerButtonFlowLabelValue = '';
        this.afterTriggerLabelValue = "";
      }
      if (this.boolSectionFourTwo && i == 6 && this.boolSectionFour) {
        this.isOptionSelected(this.afterButtonOption, value); //Set Default selected value false
        this.template.querySelector('.piclistOption6').value = 'select';
        this.boolSectionFourTwo = false;
        this.boolSectionFour = false;
        this.afterTriggerLabelValue = "";
        this.triggerButtonFlowLabelValue = '';
      }
      if (this.boolSectionFourThree && i == 7 && this.boolSectionFour) {
        this.isOptionSelected(this.afterWorkFlowOption, value); //Set Default selected value false
        this.template.querySelector('.piclistOption7').value = 'select';
        this.boolSectionFourThree = false;
        this.boolSectionFour = false;
        this.afterButtonLabelValue = '';
        this.triggerButtonFlowLabelValue = '';
      }
      console.log('this.boolSectionFive :: ',this.boolSectionFive);
      console.log('this.boolSectionFourOne :: ',this.boolSectionFourOne);
      if (this.boolSectionFive && i == 8 && this.boolSectionFourOne) {
        this.isOptionSelected(this.afterTriggerFutureQueueableOption, value); //Set Default selected value false
        this.template.querySelector('.piclistOption8').value = 'select';
        this.afterTriggerFutureQueueLabelValue = '';
      }
    }
  }

  //Call method on change in object/field dropdown list
  changeHandler(event) {
    const field = event.target.name; // Name of selected option in dropdown list
    var index = parseInt(event.target.dataset.index); // Index of selected Object
    var parentIndex = parseInt(event.target.dataset.parentIndex); // Index of Parent Object
    var apiKey = "";
    if (field === "piclistOption1") {

      if(event.target.value === "ns_api_test05__BW_Company__c"){
        this.boolNetSuiteCompany = true;
        this.boolNetSuiteItem = false;
      }else if(event.target.value === "ns_api_test05__BW_Item__c"){
        this.boolNetSuiteCompany = false;
        this.boolNetSuiteItem = true;
      }

      // to see the value of picklist1 as it is after click on "Previous" or "Next" button
      for (var i in this.nSuiteObjectApiName) {
        if (this.nSuiteObjectApiName[i].apiKey == event.target.value) {
          this.nSuiteObjectApiName[i].isSelected = true;
          this.netSuitObjLabelWithSpace = this.nSuiteObjectApiName[i].label;
          this.netSuitObjLabel = this.nSuiteObjectApiName[i].label.replaceAll(/\s/g, ''); //Replace multiple Spaces
        } else {
          this.nSuiteObjectApiName[i].isSelected = false;
        }
      }

      // if picklist1 value is "-- Please Select an Object --" then it set "" to "netSuitObjLabel"
      if (event.target.value == 'select' || event.target.value == '') {
        this.hideSelectedOption(3, 8, event.target.value); // Hide Secton and set default val of Drop Down.
        this.netSuitObjLabel = "";
        this.netSuitObjLabelWithSpace = "";
        this.netSuitObjApiName = "";
        this.boolNetSuiteCompany = false;
        this.boolNetSuiteItem = false;
      } else {
        this.netSuitObjApiName = event.target.value;      // set picklist1 value(API Name) to "netSuitObjApiName"
      }

    } else if (field === "piclistOption2") {
      // Change handler for Salesforce Standard and Custom object.
      // To see the value of picklist2 as it is after click on "Previous" or "Next" button
      for (var i in this.objects) {
        if (this.objects[i].key == event.target.value) {
          this.sfObjApi = this.objects[i].key;
          this.sfObjLabel = this.objects[i].value;
          this.sfObjWithOutSpaceLabel = this.objects[i].value.replaceAll(/\s/g, '');
          this.objects[i].isSelected = true;
        } else {
          this.objects[i].isSelected = false;
        }
      }

      // if picklist3 value is "-- Please Select an Option --" then it set "" to "createEditLabel"
      if (event.target.value === 'select' || event.target.value === '') {
        this.hideSelectedOption(3, 8, event.target.value); // Hide Secton and set default val of Drop Down.
        this.sfObjAPIName = "";
        this.sfObjLabel = "";
        this.sfObjApi = '';
        this.sfObjWithOutSpaceLabel = '';
      } else {
        this.sfObjAPIName = event.target.value; // set picklist3 value(API Name) to "createEditLabelValue"
      }
    } else if (field === "piclistOption3") {
      // to see the value of picklist3 as it is after click on "Previous" or "Next" button
      for (var i in this.createEditOption) {
        if (this.createEditOption[i].apiKey == event.target.value) {
          this.createEditLabel = this.createEditOption[i].label.replaceAll(/\s/g, '');
          this.createEditOption[i].isSelected = true;
        } else {
          this.createEditOption[i].isSelected = false;
        }
      }

      // if picklist3 value is "-- Please Select an Option --" then it set "" to "createEditLabel"
      if (event.target.value === 'select' || event.target.value === '') {
        this.hideSelectedOption(4, 8, event.target.value);
        this.createEditLabelValue = '';
      } else {
        this.createEditLabelValue = event.target.value;
      }

    } else if (field === "piclistOption4") {
      // to see the value of picklist4 as it is after click on "Previous" or "Next" button
      for (var i in this.triggerButtonFlowOption) {
        if (this.triggerButtonFlowOption[i].apiKey == event.target.value) {
          this.triggerButtonFlowLabel = this.triggerButtonFlowOption[i].label;
          this.triggerButtonFlowOption[i].isSelected = true;
        } else {
          this.triggerButtonFlowOption[i].isSelected = false;
        }
      }

      if(event.target.value == "" || event.target.value == "select"){
        this.hideSelectedOption(5, 8, event.target.value);
        this.triggerButtonFlowLabelValue = '';
      } else{
        this.triggerButtonFlowLabelValue = event.target.value;
      }

    } else if (field === "piclistOption5") {
      // to see the value of picklist5 as it is after click on "Previous" or "Next" button
      for (var i in this.afterTriggerCreateEditOption) {
        if (this.afterTriggerCreateEditOption[i].apiKey == event.target.value) {
          this.afterTriggerLabel = this.afterTriggerCreateEditOption[i].label;
          this.afterTriggerCreateEditOption[i].isSelected = true;
        } else {
          this.afterTriggerCreateEditOption[i].isSelected = false;
        }
      }

      // if picklist5 value is "Run this Trigger on the Salesforce" then it set "" to "afterTriggerLabel"
      event.target.value === "select" ? (this.afterTriggerLabel = "") : (this.afterTriggerLabel = event.target.value);

      // if picklist1 value is "-- Please Select an Object --" then it set "" to "netSuitObjLabel"
      if(event.target.value === 'select' || event.target.value === ''){
        this.hideSelectedOption(6, 8, event.target.value);
        this.afterTriggerLabelValue = '';
      } else{
        this.afterTriggerLabelValue = event.target.value;
      }

    } else if (field === "piclistOption6") {
      // to see the value of picklist6 as it is after click on "Previous" or "Next" button
      for (var i in this.afterButtonOption) {
        if (this.afterButtonOption[i].apiKey == event.target.value) {
          this.afterButtonLabel = this.afterButtonOption[i].label;
          this.afterButtonOption[i].isSelected = true;
        } else {
          this.afterButtonOption[i].isSelected = false;
        }
      }

      // if picklist6 value is "Run this Trigger on the Salesforce" then it set "" to "afterButtonLabel"
      this.afterButtonLabel = event.target.value === "select" ? "" : event.target.value;

      if(event.target.value === 'select' || event.target.value === ''){
        this.hideSelectedOption(7, 8, event.target.value);
        this.afterButtonLabelValue = '';
      } else{
        this.afterButtonLabelValue = event.target.value;
      }

    } else if (field === "piclistOption7") {
      // to see the value of picklist7 as it is after click on "Previous" or "Next" button
      for (var i in this.afterWorkFlowOption) {
        if (this.afterWorkFlowOption[i].apiKey == event.target.value) {
          this.afterWorkflowLabel = this.afterWorkFlowOption[i].label;
          this.afterWorkFlowOption[i].isSelected = true;
        } else {
          this.afterWorkFlowOption[i].isSelected = false;
        }
      }

      // if picklist7 value is "Run this Trigger on the Salesforce" then it set "" to "afterWorkflowLabel"
      if (event.target.value === "select"){
        this.afterWorkflowLabel = "";           
      } else{
        this.afterWorkflowLabel = event.target.value;
      }

      if (event.target.value === 'select' || event.target.value === '') {
        this.hideSelectedOption(7, 8, event.target.value);
        this.afterWorkflowLabelValue = '';
      } else {
        this.afterWorkflowLabelValue = event.target.value;
      }

    } else if (field === "piclistOption8") {
      // to see the value of picklist8 as it is after click on "Previous" or "Next" button
      for (var i in this.afterTriggerFutureQueueableOption) {
        if (this.afterTriggerFutureQueueableOption[i].apiKey == event.target.value) {
          this.afterTriggerFutureQueueLabel = this.afterTriggerFutureQueueableOption[i].label;
          this.afterTriggerFutureQueueableOption[i].isSelected = true;
        } else {
          this.afterTriggerFutureQueueableOption[i].isSelected = false;
        }
      }
      console.log('afterTriggerFutureQueueableOption :: ',JSON.stringify(this.afterTriggerFutureQueueableOption));
      // if picklist8 value is "Run this Trigger on the Salesforce" then it set "" to "afterTriggerFutureQueueLabel"
      if (event.target.value === "select"){
        this.afterTriggerFutureQueueLabel = "";           
      } else{
        //this.afterTriggerFutureQueueLabel = event.target.value;
      }

      if (event.target.value === 'select' || event.target.value === '') {
        console.log('Test');
        this.hideSelectedOption(8, 8, event.target.value);
        this.afterTriggerFutureQueueLabelValue = '';
      } else {
        this.afterTriggerFutureQueueLabelValue = event.target.value;
      }
    }else if (field === "getObjFieldForParent") {
      // for child field in second page on change of picklist value
      this.selectedSFFieldName = event.target.value;
      this.nsFieldName = event.target.dataset.keyId;

      //Delete pre-selected selected field from the Drop down list
      for (var i in this.fieldMapping) {
        for(var j in this.fieldMapping[i].value){
          if (this.fieldMapping[i].apiKey == this.nsObjFieldList[parentIndex].key && this.fieldMapping[i].value[j].key == event.target.dataset.keyId) {
            this.fieldMapping[i].value.splice(j, 1);
          }
        }
      }
      
      
      if (event.target.value == "-- None --" || event.target.value == "none") {
      } else {
        //Get Parent Netsuite Field API Name(apiKey) and Salesforce Field API Name(childKey)
        var childKey = '';
        if(this.nsObjFieldList[parentIndex].fieldType!=undefined && this.nsObjFieldList[parentIndex].fieldType[index].sfFields!=undefined){
          for (var i in this.nsObjFieldList[parentIndex].fieldType[index].sfFields) {
            if (this.nsObjFieldList[parentIndex].fieldType[index].sfFields[i].value == event.target.value) {
              apiKey = this.nsObjFieldList[parentIndex].key;
              childKey = this.nsObjFieldList[parentIndex].fieldType[index].sfFields[i].key;
            }
          }
        }
        
        var currentFieldMappingObj = {};
        var allFieldMappingList = [];
        currentFieldMappingObj.value = event.target.value; //Selected Salesforce field Lable/Value (Rightside)
        currentFieldMappingObj.key = event.target.dataset.keyId; //Netsuite Child Field API Name (Leftside)
        currentFieldMappingObj.apiKey = apiKey; //Netsuite Parent Field API Name (Leftside)
        currentFieldMappingObj.fType = event.target.dataset.fieldType; //Netsuite child field type (Leftside)
        currentFieldMappingObj.childKey = childKey; //Selected Salesforce field APIName (Rightside)
        currentFieldMappingObj.isChild = true; //True if field has a child
        allFieldMappingList.push(currentFieldMappingObj);

        var flag = false;
        for(var i in this.fieldMapping){
          if(this.fieldMapping[i].apiKey == apiKey){
            for(var j in this.fieldMapping[i].value){
              var oldFieldMappingObj ={};
              oldFieldMappingObj.value = this.fieldMapping[i].value[j].value; //Selected Salesforce field Lable/Value (Rightside)
              oldFieldMappingObj.key = this.fieldMapping[i].value[j].key; //Netsuite Child Field API Name (Leftside)
              oldFieldMappingObj.apiKey = this.fieldMapping[i].value[j].apiKey; //Netsuite Parent Field API Name (Leftside)
              oldFieldMappingObj.fType = this.fieldMapping[i].value[j].fType; //Netsuite child field type (Leftside)
              oldFieldMappingObj.childKey = this.fieldMapping[i].value[j].childKey; //Selected Salesforce field APIName (Rightside)
              oldFieldMappingObj.isChild = true; //True if field has a child
              allFieldMappingList.push(oldFieldMappingObj);
            }
            this.fieldMapping[i].value = allFieldMappingList;
            flag = true;
          }
        }
        if(!flag){
          this.fieldMapping.push({
            value: allFieldMappingList, //Data of child field
            key: event.target.dataset.keyId, //Netsuite Child Field API Name (Leftside)
            apiKey: apiKey, //Netsuite Parent Field API Name (Leftside)
            fType: event.target.dataset.fieldType,//Netsuite child field type (Leftside)
            childKey:childKey,//Selected Salesforce field APIName (Rightside)
            isChild: true //Selected field type
          });
        }
      }
    }else if (field === "getObjField") {
      // Change handler for Salesforce field change.
      this.selectedSFFieldName = event.target.value;
      this.nsFieldName = event.target.dataset.keyId;

      //Enable or disable boolean variable according to address choice
      if(this.nsFieldName === "BillingAddress" && event.target.value == "none"){
        this.boolBillBillAddress = false;
        this.boolBillShipAddress = false;
      }else if(this.nsFieldName === "ShippingAddress" && event.target.value == "none"){
        this.boolShipBillAddress = false;
        this.boolShipShipAddress = false;
      }else if(this.nsFieldName === "BillingAddress" && event.target.value === "Billing Address"){
        this.boolBillBillAddress = true;
        this.boolBillShipAddress = false;
      }else if(this.nsFieldName === "BillingAddress" && event.target.value === "Shipping Address"){
        this.boolBillBillAddress = false;
        this.boolBillShipAddress = true;
      }else if(this.nsFieldName === "ShippingAddress" && event.target.value === "Billing Address"){
        this.boolShipBillAddress = true;
        this.boolShipShipAddress = false;
      }else if(this.nsFieldName === "ShippingAddress" && event.target.value === "Shipping Address"){
        this.boolShipBillAddress = false;
        this.boolShipShipAddress = true;
      }

      //Delete pre-selected selected field from the Drop down list
      for (var i in this.fieldMapping) {
        if (this.fieldMapping[i].key == event.target.dataset.keyId) {
          this.fieldMapping.splice(i, 1);
        }
      }

      if (event.target.value == "-- None --" || event.target.value == "none") {
      } else {
        //Get Netsuite Field API Name(apiKey)
        for (var i in this.nsObjFieldList[index].sfFields) {
          if (this.nsObjFieldList[index].sfFields[i].value == event.target.value) {
            apiKey = this.nsObjFieldList[index].sfFields[i].key;
          }
        }
        
        this.fieldMapping.push({
          value: event.target.value, //Selected Field label
          key: event.target.dataset.keyId, //Object Key
          apiKey: apiKey, //Field API
          fType: event.target.dataset.fieldType, //Selected field type
          isChild:false,
          childKey:'',
        });
      }
    }
  }

  //This method called after click on "Next" button in 1st page after selectig Netsuite and Salesforce Objects.
  next() {
    this.isLoading = true;
    this.generateApex = false;
    //First & Second Selectoion Before Next click
    if (this.netSuitObjApiName != "" && this.netSuitObjApiName != "select" && this.sfObjAPIName != "" && this.sfObjAPIName != "select") {
      //Third Selection Befre Next
      if (this.createEditLabelValue != "" && this.createEditLabelValue != "select") {
        //Fourth Selection before Next
        if (this.triggerButtonFlowLabelValue != "" && this.triggerButtonFlowLabelValue != "select") {
          //Fifth Selection before Next
            if (this.afterTriggerLabelValue != "" && this.afterTriggerLabelValue != "select"){
              //Sixth Selection before Next
              console.log(this.afterTriggerFutureQueueLabelValue);
              if(this.afterTriggerFutureQueueLabelValue != "" && this.afterTriggerFutureQueueLabelValue != "select"){
                window.scrollTo(0, 0); // go to top of the page
                //Retrive selected object fields.
                getObjFields({
                  nsObjName: this.netSuitObjApiName,
                  singleSFObjName: this.sfObjAPIName,
                })
                  .then((data) => {
                    if (data) {
                      if (data.message != undefined) {
                        this.messsage = data.message.message;
                        this.isMessageVisible = true;
                      } else {
                        this.isMessageVisible = false;
                        this.boolFieldMapVisible = true;
                        this.boolSelectObjVisible = false;

                        let nsMap = data.NetsuitObject; // get selected Netsuite object field Info.
                        let sfMap = data.SalesforceObject; // get selected Salesforce object field Info.
                        if (data.NetsuiteNamespaceLabel != undefined) {
                          this.netSuitePackageNamespace = data.NetsuiteNamespaceLabel.NetsuiteNamespaceLabel;
                        }

                        for (let nsKey in nsMap) {
                          if (nsMap.hasOwnProperty(nsKey)) {
                            var nsFieldInfoList = {};
                            nsFieldInfoList.value = nsMap[nsKey].split(":")[0]; //get selected Netsuite object field label
                            nsFieldInfoList.key = nsKey; //get selected Netsuite object field API name
                            nsFieldInfoList.sfFields = [];
                            //nsFieldInfoList.fieldType = nsMap[nsKey].split(":")[1]; //get selected Netsuite object field Datatype

                            var parentNSObjectList = [];
                            var parentNSObjectField = [];
                            var parentNSObjectFieldObject = [];
                            if (nsMap[nsKey].split("||")[1] != undefined) {
                              parentNSObjectFieldObject = JSON.parse(nsMap[nsKey].split("||")[1]);
                              if (parentNSObjectFieldObject.SubMap != undefined) {
                                for (let parentNSObjectFieldKey in parentNSObjectFieldObject.SubMap) {
                                  for (let parentNSObj in parentNSObjectFieldObject.SubMap[parentNSObjectFieldKey]) {
                                    var obj = {};
                                    obj.value = parentNSObjectFieldObject.SubMap[parentNSObjectFieldKey][parentNSObj].split(":")[0]; //get selected Netsuite object field label
                                    obj.key = parentNSObj; //get selected Netsuite object field API name
                                    obj.sfFields = [];
                                    obj.fieldType = parentNSObjectFieldObject.SubMap[parentNSObjectFieldKey][parentNSObj].split(":")[1]; //get selected Netsuite object field Datatype
                                    parentNSObjectList.push(obj);
                                  }
                                }
                                nsFieldInfoList.value = nsMap[nsKey].split("||")[0];
                                nsFieldInfoList.fieldType = parentNSObjectList;
                                nsFieldInfoList.isArray = true;
                              }
                            } else {
                              parentNSObjectList.push(nsMap[nsKey].split(":")[1]);
                              nsFieldInfoList.fieldType = parentNSObjectList; //get selected Netsuite object field Datatype
                              nsFieldInfoList.isArray = false;
                            }//milan

                            this.nsObjFieldList.push(nsFieldInfoList);
                          }
                        }

                        var tempMap = new Map();
                        for (let sfKey in sfMap) {
                          if (sfMap.hasOwnProperty(sfKey)) {
                            let fieldList = [];
                            if (tempMap.has(sfMap[sfKey].split(":")[1])) {
                              fieldList = tempMap.get(sfMap[sfKey].split(":")[1]);
                            }
                            //Add field label and API.
                            var obj = {};
                            obj.value = sfMap[sfKey].split(":")[0]; //get selected Salesforce object field label
                            obj.key = sfKey;
                            obj.isSelected = false; //get selected Salesforce object field API name
                            fieldList.push(obj);
                            tempMap.set(sfMap[sfKey].split(":")[1], fieldList); //get selected Salesforce object field Datatype, list of fieldname
                          }
                        }                    

                        for (let test in this.nsObjFieldList) {
                          for (let addFType in this.nsObjFieldList[test].fieldType) {
                            if (tempMap.has(this.nsObjFieldList[test].fieldType[addFType]) && !this.nsObjFieldList[test].isArray) {
                              this.nsObjFieldList[test].sfFields = tempMap.get(this.nsObjFieldList[test].fieldType[addFType]);
                            } else if (!tempMap.has(this.nsObjFieldList[test].fieldType.addFType) && this.nsObjFieldList[test].isArray) {
                              for (let parentFType in this.nsObjFieldList[test].fieldType[addFType]) {
                                this.nsObjFieldList[test].fieldType[addFType].sfFields = tempMap.get(this.nsObjFieldList[test].fieldType[addFType].fieldType);
                              }
                            } else {
                              this.nsObjFieldList[test].sfFields = [];
                            }
                          }
                        }
                      }

                      //Sort selected Salesforce object fields in Drop Down by Label name
                      for (var i in this.nsObjFieldList) {
                        if (this.nsObjFieldList[i].sfFields != undefined && this.nsObjFieldList[i].sfFields.length > 0) {
                          this.nsObjFieldList[i].sfFields.sort(function (x, y) {
                            if (x.value < y.value) {
                              return -1;
                            }
                            if (x.value > y.value) {
                              return 1;
                            }
                            return 0;
                          });
                        }
                      }
                    }
                    this.isLoading = false; // Turn off spinner
                  })
                  .catch((error) => {
                    this.isLoading = false; // Turn off spinner
                    console.log("Error::", error);
                  });
                this.isSectionFiveDisabled = true;
              }else{
                if ((this.afterTriggerFutureQueueLabelValue == "" || this.afterTriggerFutureQueueLabelValue == "select") && this.boolSectionFive) {
                  this.showToast();
                }
                this.isLoading = false;
              }
              this.boolSectionFive = true;
              this.isSectionFourOneDisabled = true;
              this.isStartOverButtonVisible = true;
            }else if((this.afterButtonLabelValue != "" && this.afterButtonLabelValue != "select") ||
              (this.afterWorkflowLabelValue != "" && this.afterWorkflowLabelValue != "select")){
                //c/triggerFormatDialogthis.fieldMappingAfterNextButton();
                this.isSectionFourTwoDisabled = true;
                this.isSectionFourThreeDisabled = true;
                this.isStartOverButtonVisible = true;
            }else {
              if ((this.afterTriggerLabelValue == "" || this.afterTriggerLabelValue == "select") && this.boolSectionFour) {
                this.showToast();
              } else if ((this.afterButtonLabelValue == "" || this.afterButtonLabelValue == "select") && this.boolSectionFour) {
                this.showToast();
              } else if ((this.afterWorkflowLabelValue == "" || this.afterWorkflowLabelValue == "select") && this.boolSectionFour) {
                this.showToast();
              }
              this.isLoading = false;
            }
            this.boolSectionFour = true;
            this.isSectionThreeDisabled = true;
            this.isStartOverButtonVisible = true;
            if (this.triggerButtonFlowLabelValue === "trigger") {
              this.boolSectionFourOne = true;
            } else if (this.triggerButtonFlowLabelValue === "button") {
              this.boolSectionFourTwo = true;
            } else if (this.triggerButtonFlowLabelValue === "workflow") {
              this.boolSectionFourThree = true;
            }
            //this.template.querySelector("lightning-button").label = "Start Over";
          }else {
            ((this.triggerButtonFlowLabelValue == "" || this.triggerButtonFlowLabelValue == "select") && this.boolSectionThree) ? this.showToast() : '';
            this.isLoading = false;
          }
          this.isSectionTwoDisabled = true;
          this.boolSectionThree = true;                 
		      this.isStartOverButtonVisible = true;
        } else {
          ((this.createEditLabelValue == "" || this.createEditLabelValue == "select") && this.boolSectionTwo) ? this.showToast() : '';
          this.isLoading = false;
        }
        this.isSectionOneDisabled = true;
        this.boolSectionTwo = true;
	      this.isStartOverButtonVisible = true;
      } else {
        (this.netSuitObjApiName == "" || this.netSuitObjApiName == "select" || this.sfObjAPIName == "" || this.sfObjAPIName == "select") ? this.showToast() : '';
        this.isLoading = false; // Turn off spinner
      }
    }

  //This method call after click on "Generate Apex" button after mapping fields in second page.
  apexGeneration() {
    window.scrollTo(0, 0); // go to top of the page
    this.isLoading = true;

    //Reinitilize all list
    this.apexIdWithChildGenerator = [];
    this.apexIdWithoutChildGenerator = [];
    this.apexReferenceWithChildGenerator = [];
    this.apexReferenceWithoutChildGenerator = [];
    this.apexDateWithChildGenerator = [];
    this.apexDateWithoutChildGenerator = [];
    this.apexDateTimeWithChildGenerator = [];
    this.apexDateTimeWithoutChildGenerator = [];
    this.apexStringWithChildGenerator = [];
    this.apexStringWithoutChildGenerator = [];
    this.apexDoubleWithChildGenerator = [];
    this.apexDoubleWithoutChildGenerator = [];
    this.apexBooleanWithChildGenerator = [];
    this.apexBooleanWithoutChildGenerator = [];
    this.apexAddressGenerator = [];

    //Field mapping based on Netsuite object field type.
    for (let singleField in this.fieldMapping) {
      if (this.fieldMapping[singleField] != undefined && this.fieldMapping[singleField] != null) {
        if (this.fieldMapping[singleField].fType == "ID") { //for "ID" data type
          if(this.fieldMapping[singleField].isChild){
            this.boolIdWithChild = true;
            var apexChildValueGenerator = [];
            for(let singleChildRec in this.fieldMapping[singleField].value){
              apexChildValueGenerator.push({
                value: this.fieldMapping[singleField].value[singleChildRec].value,
                key: this.fieldMapping[singleField].value[singleChildRec].key,
                apiKey: this.fieldMapping[singleField].value[singleChildRec].apiKey,
                fType: this.fieldMapping[singleField].value[singleChildRec].fType,
                isChild: this.fieldMapping[singleField].value[singleChildRec].isChild,
                childKey: this.fieldMapping[singleField].value[singleChildRec].childKey,
              });
            }
            this.apexIdWithChildGenerator.push({
              value: apexChildValueGenerator,
              key: this.fieldMapping[singleField].key,
              apiKey: this.fieldMapping[singleField].apiKey,
              fType: this.fieldMapping[singleField].fType,
              isChild: this.fieldMapping[singleField].isChild,
              childKey: this.fieldMapping[singleField].childKey,
            });
          }else{
              this.boolIdWithoutChild = true;
              this.apexIdWithoutChildGenerator.push({
              value: this.fieldMapping[singleField].value,
              key: this.fieldMapping[singleField].key,
              apiKey: this.fieldMapping[singleField].apiKey,
              fType: this.fieldMapping[singleField].fType,
              isChild: this.fieldMapping[singleField].isChild,
            });
          }
        } else if (this.fieldMapping[singleField].fType == "REFERENCE") { //for "REFERENCE" data type
            if(this.fieldMapping[singleField].isChild){
              this.boolReferenceWithChild = true;
              var apexChildValueGenerator = [];
              for(let singleChildRec in this.fieldMapping[singleField].value){
                apexChildValueGenerator.push({
                  value: this.fieldMapping[singleField].value[singleChildRec].value,
                  key: this.fieldMapping[singleField].value[singleChildRec].key,
                  apiKey: this.fieldMapping[singleField].value[singleChildRec].apiKey,
                  fType: this.fieldMapping[singleField].value[singleChildRec].fType,
                  isChild: this.fieldMapping[singleField].value[singleChildRec].isChild,
                  childKey: this.fieldMapping[singleField].value[singleChildRec].childKey,
                });
              }
              this.apexReferenceWithChildGenerator.push({
                value: apexChildValueGenerator,
                key: this.fieldMapping[singleField].key,
                apiKey: this.fieldMapping[singleField].apiKey,
                fType: this.fieldMapping[singleField].fType,
                isChild: this.fieldMapping[singleField].isChild,
                childKey: this.fieldMapping[singleField].childKey,
              });
            }else{
                this.boolReferenceWithoutChild = true;
                this.apexReferenceWithoutChildGenerator.push({
                value: this.fieldMapping[singleField].value,
                key: this.fieldMapping[singleField].key,
                apiKey: this.fieldMapping[singleField].apiKey,
                fType: this.fieldMapping[singleField].fType,
                isChild: this.fieldMapping[singleField].isChild,
              });
            }
        } else if (this.fieldMapping[singleField].fType == "DATE") { //for "DATE" data type
            if(this.fieldMapping[singleField].isChild){
              this.boolDateWithChild = true;
              var apexChildValueGenerator = [];
              for(let singleChildRec in this.fieldMapping[singleField].value){
                apexChildValueGenerator.push({
                  value: this.fieldMapping[singleField].value[singleChildRec].value,
                  key: this.fieldMapping[singleField].value[singleChildRec].key,
                  apiKey: this.fieldMapping[singleField].value[singleChildRec].apiKey,
                  fType: this.fieldMapping[singleField].value[singleChildRec].fType,
                  isChild: this.fieldMapping[singleField].value[singleChildRec].isChild,
                  childKey: this.fieldMapping[singleField].value[singleChildRec].childKey,
                });
              }
              this.apexDateWithChildGenerator.push({
                value: apexChildValueGenerator,
                key: this.fieldMapping[singleField].key,
                apiKey: this.fieldMapping[singleField].apiKey,
                fType: this.fieldMapping[singleField].fType,
                isChild: this.fieldMapping[singleField].isChild,
                childKey: this.fieldMapping[singleField].childKey,
              });
            }else{
                this.boolDateWithoutChild = true;
                this.apexDateWithoutChildGenerator.push({
                value: this.fieldMapping[singleField].value,
                key: this.fieldMapping[singleField].key,
                apiKey: this.fieldMapping[singleField].apiKey,
                fType: this.fieldMapping[singleField].fType,
                isChild: this.fieldMapping[singleField].isChild,
                //childKey: this.fieldMapping[singleField].childKey,
              });
            }
        } else if (this.fieldMapping[singleField].fType == "DATETIME") { //for "DATETIME" data type
            if(this.fieldMapping[singleField].isChild){
              this.boolDateTimeWithChild = true;
              var apexChildValueGenerator = [];
              for(let singleChildRec in this.fieldMapping[singleField].value){
                apexChildValueGenerator.push({
                  value: this.fieldMapping[singleField].value[singleChildRec].value,
                  key: this.fieldMapping[singleField].value[singleChildRec].key,
                  apiKey: this.fieldMapping[singleField].value[singleChildRec].apiKey,
                  fType: this.fieldMapping[singleField].value[singleChildRec].fType,
                  isChild: this.fieldMapping[singleField].value[singleChildRec].isChild,
                  childKey: this.fieldMapping[singleField].value[singleChildRec].childKey,
                });
              }
              this.apexDateTimeWithChildGenerator.push({
                value: apexChildValueGenerator,
                key: this.fieldMapping[singleField].key,
                apiKey: this.fieldMapping[singleField].apiKey,
                fType: this.fieldMapping[singleField].fType,
                isChild: this.fieldMapping[singleField].isChild,
                childKey: this.fieldMapping[singleField].childKey,
              });
            }else{
                this.boolDateTimeWithoutChild = true;
                this.apexDateTimeWithoutChildGenerator.push({
                value: this.fieldMapping[singleField].value,
                key: this.fieldMapping[singleField].key,
                apiKey: this.fieldMapping[singleField].apiKey,
                fType: this.fieldMapping[singleField].fType,
                isChild: this.fieldMapping[singleField].isChild,
              });
            }
        } else if (this.fieldMapping[singleField].fType == "STRING") { //for "STRING" data type
            if(this.fieldMapping[singleField].isChild){
              var boolSubsidiaryList = false;
              var boolCustomFieldList = false;
              if(this.fieldMapping[singleField].apiKey === "subsidiaryList"){
                boolSubsidiaryList = true;
              }
              if(this.fieldMapping[singleField].apiKey === "customFieldList"){
                boolCustomFieldList = true;
              }
              this.boolStringWithChild = true;
              var apexChildValueGenerator = [];
              for(let singleChildRec in this.fieldMapping[singleField].value){
                var boolCustomFieldValueLookupList = false;
                if(this.fieldMapping[singleField].value[singleChildRec].key === "valueLookup"){
                  boolCustomFieldValueLookupList = true;
                }
                apexChildValueGenerator.push({
                  value: this.fieldMapping[singleField].value[singleChildRec].value,
                  key: this.fieldMapping[singleField].value[singleChildRec].key,
                  apiKey: this.fieldMapping[singleField].value[singleChildRec].apiKey,
                  fType: this.fieldMapping[singleField].value[singleChildRec].fType,
                  isChild: this.fieldMapping[singleField].value[singleChildRec].isChild,
                  childKey: this.fieldMapping[singleField].value[singleChildRec].childKey,
                  isSubsidiaryList: boolSubsidiaryList,
                  isCustomFieldList: boolCustomFieldList,
                  isCustomFieldValueLookupList: boolCustomFieldValueLookupList,
                });
              }
              this.apexStringWithChildGenerator.push({
                value: apexChildValueGenerator,
                key: this.fieldMapping[singleField].key,
                apiKey: this.fieldMapping[singleField].apiKey,
                fType: this.fieldMapping[singleField].fType,
                isChild: this.fieldMapping[singleField].isChild,
                childKey: this.fieldMapping[singleField].childKey,
                isSubsidiaryList: boolSubsidiaryList,
                isCustomFieldList: boolCustomFieldList,
              });
            }else{
                this.boolStringWithoutChild = true;
                this.apexStringWithoutChildGenerator.push({
                value: this.fieldMapping[singleField].value,
                key: this.fieldMapping[singleField].key,
                apiKey: this.fieldMapping[singleField].apiKey,
                fType: this.fieldMapping[singleField].fType,
                isChild: this.fieldMapping[singleField].isChild,
              });
            }
        } else if (this.fieldMapping[singleField].fType == "DOUBLE") { //for "DOUBLE" data type
            if(this.fieldMapping[singleField].isChild){
              this.boolDoubleWithChild = true;
              var apexChildValueGenerator = [];
              for(let singleChildRec in this.fieldMapping[singleField].value){
                apexChildValueGenerator.push({
                  value: this.fieldMapping[singleField].value[singleChildRec].value,
                  key: this.fieldMapping[singleField].value[singleChildRec].key,
                  apiKey: this.fieldMapping[singleField].value[singleChildRec].apiKey,
                  fType: this.fieldMapping[singleField].value[singleChildRec].fType,
                  isChild: this.fieldMapping[singleField].value[singleChildRec].isChild,
                  childKey: this.fieldMapping[singleField].value[singleChildRec].childKey,
                });
              }
              this.apexDoubleWithChildGenerator.push({
                value: apexChildValueGenerator,
                key: this.fieldMapping[singleField].key,
                apiKey: this.fieldMapping[singleField].apiKey,
                fType: this.fieldMapping[singleField].fType,
                isChild: this.fieldMapping[singleField].isChild,
                childKey: this.fieldMapping[singleField].childKey,
              });
            }else{
                this.boolDoubleWithoutChild = true;
                this.apexDoubleWithoutChildGenerator.push({
                value: this.fieldMapping[singleField].value,
                key: this.fieldMapping[singleField].key,
                apiKey: this.fieldMapping[singleField].apiKey,
                fType: this.fieldMapping[singleField].fType,
                isChild: this.fieldMapping[singleField].isChild,
              });
            }
        } else if (this.fieldMapping[singleField].fType == "BOOLEAN") { //for "BOOLEAN" data type
            if(this.fieldMapping[singleField].isChild){
              this.boolBooleanWithChild = true;
              var apexChildValueGenerator = [];
              for(let singleChildRec in this.fieldMapping[singleField].value){
                apexChildValueGenerator.push({
                  value: this.fieldMapping[singleField].value[singleChildRec].value,
                  key: this.fieldMapping[singleField].value[singleChildRec].key,
                  apiKey: this.fieldMapping[singleField].value[singleChildRec].apiKey,
                  fType: this.fieldMapping[singleField].value[singleChildRec].fType,
                  isChild: this.fieldMapping[singleField].value[singleChildRec].isChild,
                  childKey: this.fieldMapping[singleField].value[singleChildRec].childKey,
                });
              }
              this.apexBooleanWithChildGenerator.push({
                value: apexChildValueGenerator,
                key: this.fieldMapping[singleField].key,
                apiKey: this.fieldMapping[singleField].apiKey,
                fType: this.fieldMapping[singleField].fType,
                isChild: this.fieldMapping[singleField].isChild,
                childKey: this.fieldMapping[singleField].childKey,
              });
            }else{
                this.boolBooleanWithoutChild = true;
                this.apexBooleanWithoutChildGenerator.push({
                value: this.fieldMapping[singleField].value,
                key: this.fieldMapping[singleField].key,
                apiKey: this.fieldMapping[singleField].apiKey,
                fType: this.fieldMapping[singleField].fType,
                isChild: this.fieldMapping[singleField].isChild,
              });
            }
        } else if (this.fieldMapping[singleField].fType == "ADDRESS") { //for "ADDRESS" data type          
          if(this.fieldMapping[singleField].key === "BillingAddress"){
            this.boolBillingAddress = true;
            this.apexBillingAddressGenerator.push({
              value: this.fieldMapping[singleField].value,
              key: this.fieldMapping[singleField].key,
              apiKey: this.fieldMapping[singleField].apiKey,
              fType: this.fieldMapping[singleField].fType,
              isChild: this.fieldMapping[singleField].isChild,
              childKey: this.fieldMapping[singleField].childKey,
            });
          }else if(this.fieldMapping[singleField].key === "ShippingAddress"){
            this.boolShippingAddress = true;
            this.apexShippingAddressGenerator.push({
              value: this.fieldMapping[singleField].value,
              key: this.fieldMapping[singleField].key,
              apiKey: this.fieldMapping[singleField].apiKey,
              fType: this.fieldMapping[singleField].fType,
              isChild: this.fieldMapping[singleField].isChild,
              childKey: this.fieldMapping[singleField].childKey,
            });
          }
        }
      }
    }

    if (this.createEditLabelValue == "create") {
      if (this.triggerButtonFlowLabelValue == "trigger") {
        if (this.afterTriggerLabelValue == "createTriggerOnCreate") {
          this.boolCreateTriggerOnCreate = true;
          if(this.afterTriggerFutureQueueLabelValue == "createTriggerOnQueueable"){
            this.boolCreateTriggerOnCreateQueueable = true;
          }else if(this.afterTriggerFutureQueueLabelValue == "createTriggerOnFuture"){
            this.boolCreateTriggerOnCreateFuture = true;
          }
        } else if (this.afterTriggerLabelValue == "editTriggerOnEdit") {
          this.boolCreateTriggerOnEdit = true;
        }
      } else if (this.triggerButtonFlowLabelValue == "button") {
        if (this.afterTriggerLabelValue == "createButton") {
          this.boolCreateButton = true;
        } else if (this.afterTriggerLabelValue == "editButton") {
          this.boolCreateButton = true;
        }
      }
    }

    setTimeout(() => {
      this.isLoading = false; // Turn off spinner
    }, 1000);
  
    this.boolSelectObjVisible = false;
    this.boolFieldMapVisible = false;
    this.generateApex = true;
  }

  // This method call to display list of field Mapping for "Create"-Trigger"-"On Create" picklist values in child component
  get hasCreateTriggerOnCreateRendered() {
    if (this.boolCreateTriggerOnCreate) {
      return true;
    }
    return false;
  }
  
  // This method call to display list of field Mapping for "Create"-Trigger"-"On Create" picklist values in child component
  get hasCreateTriggerOnCreateQueueableRendered() {
    if (this.boolCreateTriggerOnCreateQueueable) {
      return true;
    }
    return false;
  }

  // This method call to display list of field Mapping for "Create"-Trigger"-"On Create" picklist values in child component
  get hasCreateTriggerOnCreateFutureRendered() {
    if (this.boolCreateTriggerOnCreateFuture) {
      return true;
    }
    return false;
  }

  // This method call to display list of field Mapping for "Create"-Trigger"-"On Edit" picklist values in child component
  get hasCreateTriggerOnEditRendered() {
    if (this.boolCreateTriggerOnEdit) {
      return true;
    }
    return false;
  }

  // This method call to display list of field of datatype "ID" without child
  get hasIdWithoutChildRendered() {
    if (this.boolIdWithoutChild) {
      return true;
    }
    return false;
  }

  // This method call to display list of field of datatype "ID" with child
  get hasIdWithChildRendered() {
    if (this.boolIdWithChild) {
      return true;
    }
    return false;
  }

  // This method call to display list of field of datatype "REFERENCE" without child
  get hasReferenceWithoutChildRendered() {
    if (this.boolReferenceWithoutChild) {
      return true;
    }
    return false;
  }

  // This method call to display list of field of datatype "REFERENCE" with child
  get hasReferenceWithChildRendered() {
    if (this.boolReferenceWithChild) {
      return true;
    }
    return false;
  }

  // This method call to display list of field of datatype "DATE" without child
  get hasDateWithoutChildRendered() {
    if (this.boolDateWithoutChild) {
      return true;
    }
    return false;
  }

  // This method call to display list of field of datatype "DATE" with child
  get hasDateWithChildRendered() {
    if (this.boolDateWithChild) {
      return true;
    }
    return false;
  }

  // This method call to display list of field of datatype "DATETIME" without child
  get hasDateTimeWithoutChildRendered() {
    if (this.boolDateTimeWithoutChild) {
      return true;
    }
    return false;
  }

  // This method call to display list of field of datatype "DATETIME" with child
  get hasDateTimeWithChildRendered() {
    if (this.boolDateTimeWithChild) {
      return true;
    }
    return false;
  }

  // This method call to display list of field of datatype "STRING" without child
  get hasStringWithoutChildRendered() {
    if (this.boolStringWithoutChild) {
      return true;
    }
    return false;
  }

  // This method call to display list of field of datatype "STRING" with child
  get hasStringWithChildRendered() {
    if (this.boolStringWithChild) {
      return true;
    }
    return false;
  }

  // This method call to display list of field of datatype "DOUBLE" without child
  get hasDoubleWithoutChildRendered() {
    if (this.boolDoubleWithoutChild) {
      return true;
    }
    return false;
  }

  // This method call to display list of field of datatype "DOUBLE" with child
  get hasDoubleWithChildRendered() {
    if (this.boolDoubleWithChild) {
      return true;
    }
    return false;
  }

  // This method call to display list of field of datatype "BOOLEAN" without child
  get hasBooleanWithoutChildRendered() {
    if (this.boolBooleanWithoutChild) {
      return true;
    }
    return false;
  }

  // This method call to display list of field of datatype "BOOLEAN" with child
  get hasBooleanWithChildRendered() {
    if (this.boolBooleanWithChild) {
      return true;
    }
    return false;
  }

  // This method call to display list of field of datatype "BILLING ADDRESS" in child component
  get hasBillingAddressRendered() {
    if (this.boolBillingAddress) {
      return true;
    }
    return false;
  }

  // This method call to display list of field of datatype "SHIPPING ADDRESS" in child component
  get hasShippingAddressRendered() {
    if (this.boolShippingAddress) {
      return true;
    }
    return false;
  }

  // Reload whole Lightning Web Component
  // This method called after click on "Start Over" button
  onLoad(event){
    this.isLoading = true; // Turn on spinner
    window.location.reload();
  }

  //Display Toast on error for first page of the parent component
  showToast() {
    const errorToast = new ShowToastEvent({
      title: "Error",
      message: "Please select below drop down value.",
      variant: "error",
      mode: "dismissable",
      duration: 3000,
    });
    this.dispatchEvent(errorToast);
  }

  //This method called after click on "Copy" button in modal box in the third page(child component) and show toast of "Message copied".
  showToastForCopy() {
    console.log('In toast');
    const copyEvent = new ShowToastEvent({
      title: 'Copied',
      message: 'Message Copied.',
      variant: 'success',
      mode: 'dismissable',
      duration: 3000,
    });
    this.dispatchEvent(copyEvent);
  }

  //This method called after click on "Copy" button in modal box in the third page(child component).
  copyToTrigger(event) {
    window.scrollTo(0, 0); // Back to Top of the Page
    this.showToastForCopy(); // Call Toast method to show the toast for "Message Copied"
    const copyTrigger = this.template.querySelector(".copy-trigger");
    const areaRange = document.createRange();
    areaRange.selectNode(copyTrigger);
    //source.set('v.label', 'Copy');
    const windowSelection = window.getSelection();
    windowSelection.removeAllRanges();
    windowSelection.addRange(areaRange);
    document.execCommand('copy');
  }
  
  //This method called after click on "Copy" button in modal box in the third page(child component).
  copyToApex(event) {
    window.scrollTo(0, 0); // Back to Top of the Page
    this.showToastForCopy(); // Call Toast method to show the toast for "Message Copied"
    const copyApex = this.template.querySelector(".copy-apex");
    const areaRange = document.createRange();
    areaRange.selectNode(copyApex);
    //source.set('v.label', 'Copy');
    const windowSelection = window.getSelection();
    windowSelection.removeAllRanges();
    windowSelection.addRange(areaRange);
    document.execCommand('copy');
  }
}