public with sharing class propertyController {
    //wrapper class
    public class Filters{
        @AuraEnabled
        public string searchKey{get;set;}
        @AuraEnabled
        public Decimal maxPrice{get;set;}
        @AuraEnabled
        public String[] categories{get;set;}
        @AuraEnabled
        public String[] areaType{get;set;}
    }
    @AuraEnabled(Cacheable=true)
    public static List<Property__c> getProperty(Filters filters){
        String key, whereClause ='';
        Decimal maxPrice;
        String[] categories, areaType, criteria = new List<String>{};
        if(filters != null){
            maxPrice = filters.maxPrice;
            categories = filters.categories;
            areaType = filters.areaType;
            if(!String.isEmpty(filters.searchKey)){
                key = '%' + filters.searchKey + '%';
                criteria.add('Name LIKE: key');
            }
            if(filters.maxPrice >=0){
                criteria.add('Rent__c <= :maxPrice');
            }
            if(filters.categories != null){
                criteria.add('Category__c IN :categories');
            }
            if(filters.areaType != null){
                criteria.add('Area__c IN :areaType');
            }
            if(criteria.size()>0){
                whereClause = ' WHERE ' + String.join(criteria, ' AND ');
            }
        }

        String query = 'Select id,Additional_room__c, Area__c, Available_from__c, Available_for__c, Name, Rent__c,Carpet_Area_sqft__c, Category__c, Property_Main_Image__c, Facing__c from Property__c' + whereClause + ' WITH SECURITY_ENFORCED ORDER BY Name';
        return Database.query(query);
    }
    @AuraEnabled(Cacheable=true)
    public static Property__c[] getSimilarProperty(Id propertyId, String[] areaType){
        return [SELECT id, Name, Rent__c, Area__c, Category__c, Carpet_Area_sqft__c, Available_for__c, Property_Main_Image__c FROM Property__c WHERE Area__c IN :areaType AND Id != :propertyId];
    }
}
