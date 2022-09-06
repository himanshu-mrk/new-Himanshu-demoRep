import { LightningElement, api, wire} from 'lwc';

//Navigation
import {NavigationMixin} from 'lightning/navigation'

import PROPERTY_OBJECT from '@salesforce/schema/Property__c'

//Property__c Schema
import NAME_FIELD from '@salesforce/schema/Property__c.Name'
import PICTURE_FIELD from '@salesforce/schema/Property__c.Property_Main_Image__c'
import CATEGORY_FIELD from '@salesforce/schema/Property__c.Category__c'
import AREA_FIELD from '@salesforce/schema/Property__c.Area__c'
import RENT_FIELD from '@salesforce/schema/Property__c.Rent__c'
import AVAILABLEFROM_FIELD from '@salesforce/schema/Property__c.Available_from__c'
import FACING_FIELD from '@salesforce/schema/Property__c.Facing__c'
import ADITIONALROOM_FIELD from '@salesforce/schema/Property__c.Additional_room__c'
// this function to extract field values
import { getFieldValue } from 'lightning/uiRecordApi'

//lightning message service
import {subscribe, MessageContext, unsubscribe} from 'lightning/messageService'
import PROPERTY_SELECTED_MESSAGE from '@salesforce/messageChannel/PropertySelected__c'

export default class PropertyCard extends NavigationMixin(LightningElement) {

    //load context for LMS
    @wire(MessageContext)
    messageContext

   //Exposing fields to make them available in template
    categoryField = CATEGORY_FIELD
    areaField = AREA_FIELD
    rentField = RENT_FIELD
    availableFromField = AVAILABLEFROM_FIELD
    facingField = FACING_FIELD
    additionalRoomField = ADITIONALROOM_FIELD

    //Id of Property__c to display data
    recordId

    // property field displyed with specific format
    propertyName
    propertyPicture

    //subscription reference for property slected
    propertySelectionSubscription

    handleRecordLoaded(event){
        const {records} = event.detail
        const recordData = records[this.recordId]
        this.propertyName = getFieldValue(recordData, NAME_FIELD)
        this.propertyPicture = getFieldValue(recordData, PICTURE_FIELD)
    }

    connectedCallback(){
        this.subscribeHandler()
    }
    subscribeHandler(){
       this.propertySelectionSubscription = subscribe(this.messageContext, PROPERTY_SELECTED_MESSAGE, (message)=>this.handlePropertySelected(message))
    }
    handlePropertySelected(message){
        this.recordId = message.propertyId
    }

    disconnectedCallback(){
        unsubscribe(this.propertySelectionSubscription)
        this.propertySelectionSubscription = null
    }
    
    handleNavigateToRecord(){
        this[NavigationMixin.Navigate]({
            type:'standard__recordPage',
            attributes:{
                recordId:this.recordId,
                objectApiName:PROPERTY_OBJECT.objectApiName,
                actionName:'view'
            }
        })
    }

    newAcc(){
        this[NavigationMixin.Navigate](
            {
                type:'standard__objectPage',
                attributes: {
                    objectApiName: 'Property__c',
                    actionName: 'new'
                }
            });
    }
    
}