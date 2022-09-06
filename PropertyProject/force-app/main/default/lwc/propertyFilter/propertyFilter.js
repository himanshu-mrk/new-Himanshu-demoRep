import { LightningElement, wire } from 'lwc';
import {getObjectInfo, getPicklistValues} from 'lightning/uiObjectInfoApi';
import PROPERTY_OBJECT from '@salesforce/schema/Property__c'
import CATEGORY_FIELD from '@salesforce/schema/Property__c.Category__c'
import AREA_FIELD from '@salesforce/schema/Property__c.Area__c'


const CATEGORY_ERROR = 'Error Loading Categories'
const AREA_ERROR = 'Error Loading Areas'
//Lightning message channel
import {publish, MessageContext} from 'lightning/messageService'
import PROPERTY_FILTERED_MESSAGE from '@salesforce/messageChannel/PropertyFiltered__c'

export default class PropertyFilter extends LightningElement {
    filters={
        searchKey:'',
        maxPrice:999999
    }
    categoryError = CATEGORY_ERROR
    areaError = AREA_ERROR
    timer
    //Load context for LMS
    @wire(MessageContext)
    messageContext

    // fetching category
    @wire(getObjectInfo, {objectApiName:PROPERTY_OBJECT})
    propertyObjectInfo

    @wire(getPicklistValues,{
        recordTypeId:'$propertyObjectInfo.data.defaultRecordTypeId',
        fieldApiName:CATEGORY_FIELD
    })categories

     // fetching area
    @wire(getPicklistValues,{
        recordTypeId:'$propertyObjectInfo.data.defaultRecordTypeId',
        fieldApiName:AREA_FIELD
    })areaType



    handleSearchKeyChange(event){
        console.log(event.target.value)
        this.filters = {...this.filters, "searchKey":event.target.value}
        this.sendDataToPropertyList()
    }

    handleMaxPriceChange(event){
        console.log(event.target.value)
        this.filters = {...this.filters, "maxPrice":event.target.value}
        this.sendDataToPropertyList()
    }

    handleCheckbox(event){
        if(!this.filters.categories){
            const categories = this.categories.data.values.map(item=>item.value)
            const areaType = this.areaType.data.values.map(item=>item.value)
            this.filters = {...this.filters, categories, areaType}
        }
        const {name,value} = event.target.dataset
        // console.log("name", name)
        // console.log("value", value)
         if(event.target.checked){
            if(!this.filters[name].includes(value)){
                this.filters[name] = [...this.filters[name], value]
            }
         }else{
            this.filters[name] = this.filters[name].filter(item=>item !==value)
         }
         this.sendDataToPropertyList()
    }

    sendDataToPropertyList(){
        window.clearTimeout(this.timer)
        this.timer = window.setTimeout(() => {
            publish(this.messageContext, PROPERTY_FILTERED_MESSAGE, {
                filters:this.filters
            })  
        }, 400)
       
    }
}