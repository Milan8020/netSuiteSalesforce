/**
 * @description       : 
 * @author            : Subhash Panchani
 * @group             : 
 * @last modified on  : 12-04-2020
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
 * Modifications Log 
 * Ver   Date         Author                               Modification
 * 1.0   12-01-2020   ChangeMeIn@UserSettingsUnder.SFDoc   Initial Version
 * 1.1   12-02-2020   ChangeMeIn@UserSettingsUnder.SFDoc   Some Changes and Improvements
 * 1.2   12-03-2020   ChangeMeIn@UserSettingsUnder.SFDoc   Some Changes and Improvements
 * 1.3   12-04-2020   ChangeMeIn@UserSettingsUnder.SFDoc   Finalizing Code And Some bug fixes
**/
public class NetsuiteSFTriggerMapping{
    /**
	* @Author:      Subhash Panchani 
	* @Date:        12/01/2020
    * @Description: Get Account Object's Metadata.
	* @Revision(s): [Date] - [Change Reference] - [Changed By] - [Description]
	**/
    @AuraEnabled(cacheable = true)
    public static Map<string, string> getAllObjects(){
        Map<string, string> objectList = new Map<string, string>();
        // TODO: only Get Account data without iterating all Objects
        for (Schema.SObjectType o : Schema.getGlobalDescribe().values()){
            Schema.DescribeSObjectResult objResult = o.getDescribe();
            String objName = objResult.getName();
            String substr = '__';
            String str = objName;
            Integer substrLen = substr.length();
            Integer count = 0;
            Integer index = str.indexOf(substr);
            
            while (index >= 0){
                count++;
                str = str.substring(index + substrLen);
                index = str.indexOf(substr);
            }
            
            if( objName == 'Account' || objName == 'Product2'){
                objectList.put(objName, objResult.getLabel());
            }
        }
        return objectList;
    }
    
    /**
	* @Author:      Subhash Panchani 
	* @Date:        12/01/2020
    * @Description: Get object fields once both objects are selected in UI
	* @Revision(s): [Date] - [Change Reference] - [Changed By] - [Description]
	**/
    @AuraEnabled(cacheable = true)
    public static Map<string, Map<string, object>> getObjFields(String nsObjName, String singleSFObjName){
        if(String.isBlank(nsObjName) || String.isBlank(singleSFObjName)){
            return null;
        }

        // Stores Fields Data for both SF and NetSuite
        Map<string, Map<string, object>> finalMap = new Map<string, Map<string, object>>();

        // Stores NetSuite Objects which is treated as field in NetSuite for "Create Customer"
        Map<string, List<object>> childFieldMap = new Map<string, List<object>>();
        
        // Stores NetSuite Objects which is treated as field in NetSuite for "Create Item"
        Map<string, List<object>> childItemCustomFieldMap = new Map<string, List<object>>();

        // TODO: Change Value type to String
        // Temp map which stores sub objects data for "Create Customer"
        Map<string, object> subMap = new Map<string, object>();
        
        // TODO: Change Value type to String
        // Temp map which stores sub objects data for "Create Item"
        Map<string, object> subItemCustomFieldMap = new Map<string, object>();

        // TODO: Change Value type to String
        // Stores NS Field's Data
        Map<string, object> nsFieldApiNameTypeMap = new Map<string, object>();

        // Stores SF's sObject's Data.
        Map<string, string> sfFieldApiNameTypeMap = new Map<string, string>();

        // Stores Error Messages.
        Map<string, string> errorMessage = new Map<string, string>();
        
        // Stores package Namespace.
        Map<string, string> netsuiteNamespace = new Map<string, string>();
        
        List<Object> listOfObjects = new List<Object>();
        List<Object> listOfItemCustomField = new List<Object>();

        nsFieldApiNameTypeMap = new Map<string, string>();
        sfFieldApiNameTypeMap = new Map<string, string>();
        
        if (nsObjName == 'ns_api_test05__BW_Company__c'){
            //subMap.put('externalId','External Id:STRING');
            //subMap.put('name','Name:STRING');
            //subMap.put('type','Type:Not currently working for this wizard');
            subMap.put('internalId','Internal Id:STRING');
            listOfObjects.add(subMap);
            childFieldMap.put('SubMap',listOfObjects);
            
            //nsFieldApiNameTypeMap.put('dateCreated', 'Date Created:DATETIME');
            //nsFieldApiNameTypeMap.put('lastModifiedDate', 'Last Modified Date:DATETIME');
            //nsFieldApiNameTypeMap.put('entityID', 'Entity ID:STRING');
            //nsFieldApiNameTypeMap.put('internalID', 'Internal ID:STRING');
            nsFieldApiNameTypeMap.put('accountNumber', 'Account Number:STRING');
            nsFieldApiNameTypeMap.put('BillingAddress', 'Billing Address:ADDRESS');
            nsFieldApiNameTypeMap.put('category', 'Category||'+JSON.serialize(childFieldMap));
            nsFieldApiNameTypeMap.put('companyName', 'Company Name:STRING');
            nsFieldApiNameTypeMap.put('creditHoldOverride', 'Credit Hold Override:Not currently working for this wizard');
            nsFieldApiNameTypeMap.put('creditLimit', 'Credit Limit:DOUBLE');
            nsFieldApiNameTypeMap.put('currencyValue', 'Currency Value||'+JSON.serialize(childFieldMap));
            nsFieldApiNameTypeMap.put('customForm', 'Custom Form||'+JSON.serialize(childFieldMap));
            nsFieldApiNameTypeMap.put('email', 'Email:STRING');
            nsFieldApiNameTypeMap.put('endDate', 'End Date:DATETIME');
            nsFieldApiNameTypeMap.put('entityStatus', 'Entity Status||'+JSON.serialize(childFieldMap));
            nsFieldApiNameTypeMap.put('externalID', 'External ID:STRING');
            nsFieldApiNameTypeMap.put('fax', 'Fax:STRING');
            nsFieldApiNameTypeMap.put('firstName', 'First Name:STRING');
            nsFieldApiNameTypeMap.put('isInactive', 'Is Inactive:BOOLEAN');
            nsFieldApiNameTypeMap.put('isPerson', 'Is Person:BOOLEAN');
            nsFieldApiNameTypeMap.put('lastName', 'Last Name:STRING');
            nsFieldApiNameTypeMap.put('middleName', 'Middle Name:STRING');
            nsFieldApiNameTypeMap.put('parent', 'Parent||'+JSON.serialize(childFieldMap));
            nsFieldApiNameTypeMap.put('phone', 'Phone:STRING');
            nsFieldApiNameTypeMap.put('priceLevel', 'Price Level||'+JSON.serialize(childFieldMap));
            nsFieldApiNameTypeMap.put('receivablesAccount', 'Receivable Account||'+JSON.serialize(childFieldMap));
            nsFieldApiNameTypeMap.put('reminderDays', 'Reminder Days:DOUBLE');
            nsFieldApiNameTypeMap.put('resaleNumber', 'Resale Number:STRING');
            nsFieldApiNameTypeMap.put('salesRep', 'Sales Representative||'+JSON.serialize(childFieldMap));
            nsFieldApiNameTypeMap.put('salutation', 'Salutation:Not currently working for this wizard');
            nsFieldApiNameTypeMap.put('ShippingAddress', 'Shipping Address:ADDRESS');
            nsFieldApiNameTypeMap.put('stage', 'Stage:Not currently working for this wizard');
            nsFieldApiNameTypeMap.put('startDate', 'Start Date:DATETIME');
            nsFieldApiNameTypeMap.put('subsidiary', 'Subsidiary||'+JSON.serialize(childFieldMap));
            nsFieldApiNameTypeMap.put('taxItem', 'Tax Item||'+JSON.serialize(childFieldMap));
            nsFieldApiNameTypeMap.put('terms', 'Terms||'+JSON.serialize(childFieldMap));
            nsFieldApiNameTypeMap.put('territory', 'Territory||'+JSON.serialize(childFieldMap));
            nsFieldApiNameTypeMap.put('title', 'Title:STRING');
            nsFieldApiNameTypeMap.put('url', 'URL:STRING');
            nsFieldApiNameTypeMap.put('vatRegNumber', 'VAT Register Number:STRING');
            
        }else if (nsObjName == 'ns_api_test05__BW_Item__c'){
            subMap.put('internalId','Internal Id:STRING');
            listOfObjects.add(subMap);
            childFieldMap.put('SubMap',listOfObjects);
            
            subItemCustomFieldMap.put('fieldType','Field Type:STRING');
            subItemCustomFieldMap.put('scriptId','Script Id:STRING');
            subItemCustomFieldMap.put('valueLookup','Value Lookup:STRING');
            subItemCustomFieldMap.put('value','Value:STRING');
            listOfItemCustomField.add(subItemCustomFieldMap);
            childItemCustomFieldMap.put('SubMap',listOfItemCustomField);

            nsFieldApiNameTypeMap.put('salesforceID', 'Salesforce ID:ID');
            nsFieldApiNameTypeMap.put('account', 'Account||'+JSON.serialize(childFieldMap));
            nsFieldApiNameTypeMap.put('assetAccount', 'Asset Account||'+JSON.serialize(childFieldMap));
            nsFieldApiNameTypeMap.put('classification', 'Classification||'+JSON.serialize(childFieldMap));
            nsFieldApiNameTypeMap.put('cogsAccount', 'COGs Account||'+JSON.serialize(childFieldMap));
            nsFieldApiNameTypeMap.put('cost', 'Cost:DOUBLE');
            //nsFieldApiNameTypeMap.put('customFieldList', 'Custom Field List||'+JSON.serialize(childItemCustomFieldMap));
            nsFieldApiNameTypeMap.put('customForm', 'Custom Form||'+JSON.serialize(childFieldMap));
            nsFieldApiNameTypeMap.put('department', 'Department||'+JSON.serialize(childFieldMap));
            nsFieldApiNameTypeMap.put('description', 'Description:STRING');
            nsFieldApiNameTypeMap.put('displayName', 'Display Name:STRING');
            nsFieldApiNameTypeMap.put('expenseAccount', 'Expense Account||'+JSON.serialize(childFieldMap));
            nsFieldApiNameTypeMap.put('externalId', 'External Id:STRING');
            nsFieldApiNameTypeMap.put('handlingCost', 'Handling Cost:DOUBLE');
            nsFieldApiNameTypeMap.put('incomeAccount', 'Income Account||'+JSON.serialize(childFieldMap));
            nsFieldApiNameTypeMap.put('isInactive', 'Is Inactive:BOOLEAN');
            nsFieldApiNameTypeMap.put('itemId', 'Item Name:STRING');
            nsFieldApiNameTypeMap.put('itemType', 'Item Type:STRING');
            nsFieldApiNameTypeMap.put('location', 'Location||'+JSON.serialize(childFieldMap));
            nsFieldApiNameTypeMap.put('maximumQuantity', 'Maximum Quantity:DOUBLE');
            //nsFieldApiNameTypeMap.put('memberList', 'Member List:No Type');
            nsFieldApiNameTypeMap.put('minimumQuantity', 'Minimum Quantity:DOUBLE');
            nsFieldApiNameTypeMap.put('parent', 'Parent||'+JSON.serialize(childFieldMap));
            nsFieldApiNameTypeMap.put('preferredLocation', 'Preferred Location||'+JSON.serialize(childFieldMap));
            nsFieldApiNameTypeMap.put('pricingGroup', 'Pricing Group||'+JSON.serialize(childFieldMap));
            nsFieldApiNameTypeMap.put('purchaseDescription', 'Purchase Description:STRING');
            nsFieldApiNameTypeMap.put('quantityPricingSchedule', 'Quantity Pricing Schedule||'+JSON.serialize(childFieldMap));
            nsFieldApiNameTypeMap.put('salesDescription', 'Sales Description:STRING');
            nsFieldApiNameTypeMap.put('shippingCost', 'Shipping Cost:DOUBLE');
            //nsFieldApiNameTypeMap.put('subsidiaryList', 'Subsidiary List||'+JSON.serialize(childFieldMap));
            nsFieldApiNameTypeMap.put('includeChildren', 'Include Children:BOOLEAN');
            nsFieldApiNameTypeMap.put('rate', 'Rate:STRING');
            nsFieldApiNameTypeMap.put('unitsType', 'Units Type||'+JSON.serialize(childFieldMap));
            nsFieldApiNameTypeMap.put('useMarginalRates', 'Use Marginal Rates:BOOLEAN');
            nsFieldApiNameTypeMap.put('taxSchedule', 'Tax Schedule||'+JSON.serialize(childFieldMap));
        }
        
        // SF Object Details
        SObjectType sfObjectInfo = Schema.getGlobalDescribe().get(singleSFObjName);
        
        if (sfObjectInfo != null){
            Map<String, Schema.SObjectField> sfObjFieldsInfo = sfObjectInfo.getDescribe().fields.getMap();
            for (String sfFieldName : sfObjFieldsInfo.keySet()){
                System.debug('Type : '+sfObjFieldsInfo.get(sfFieldName).getDescribe().getType());
                if(String.valueOf(sfObjFieldsInfo.get(sfFieldName).getDescribe().getType()) == 'CURRENCY'){
                    String sfFieldNameType = sfObjFieldsInfo.get(sfFieldName).getDescribe().getLabel() + ':DOUBLE';
                    sfFieldApiNameTypeMap.put(String.valueOf(sfObjFieldsInfo.get(sfFieldName)), sfFieldNameType);
                }else{
                    String sfFieldNameType = sfObjFieldsInfo.get(sfFieldName).getDescribe().getLabel() + ':' + sfObjFieldsInfo.get(sfFieldName).getDescribe().getType();
                    sfFieldApiNameTypeMap.put(String.valueOf(sfObjFieldsInfo.get(sfFieldName)), sfFieldNameType);
                }
            }
            finalMap.put('NetsuitObject' , nsFieldApiNameTypeMap); // NS object Map
            finalMap.put('SalesforceObject' , sfFieldApiNameTypeMap); // SF object Map
            netsuiteNamespace.put('NetsuiteNamespaceLabel' , System.Label.BW_Namespace);
            finalMap.put('NetsuiteNamespaceLabel' , netsuiteNamespace);
        } else{
            //If salesforce fields not found.
            errorMessage.put('message', 'No salesforce field found.');
            finalMap.put('message', errorMessage);
        }
        return finalMap;
    }
}