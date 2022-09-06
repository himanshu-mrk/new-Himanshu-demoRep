import { LightningElement, wire} from 'lwc';
import getProperty from '@salesforce/apex/propertyController.getProperty'

//Lightning message channel
import {publish, subscribe, MessageContext, unsubscribe} from 'lightning/messageService'
import PROPERTY_FILTERED_MESSAGE from '@salesforce/messageChannel/PropertyFiltered__c'
import PROPERTY_SELECTED_MESSAGE from '@salesforce/messageChannel/PropertySelected__c'

export default class PropertyTileList extends LightningElement {
    property=[]
    error
    filters = {};
    propertyFilterSubscription

    @wire(getProperty, {filters: '$filters'})

    propertyHandler({data,error}){
        if(data){
            console.log(data)
            this.property = data
        }
        if(error){
            console.error(error)
            this.error = error
        }
    }

     //Load context for LMS
     @wire(MessageContext)
     messageContext

     connectedCallback(){
        this.subscribeHandler()
     }

     subscribeHandler(){
        this.propertyFilterSubscription = subscribe(this.messageContext, PROPERTY_FILTERED_MESSAGE, (message)=>this.handleFilterChanges(message))
     }
     handleFilterChanges(message){
        console.log(message.filters)
        this.filters = {...message.filters}
     }
     handlePropertySelected(event){
        console.log("Selected Property Id", event.detail)
        publish(this.messageContext, PROPERTY_SELECTED_MESSAGE, {
            propertyId:event.detail
        })
     }
     disconnectedCallback(){
        unsubscribe(this.propertyFilterSubscription)
        this.propertyFilterSubscription = null
    }
}