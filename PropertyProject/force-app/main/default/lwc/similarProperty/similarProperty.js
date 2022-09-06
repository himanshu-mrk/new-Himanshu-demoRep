import { LightningElement, api, wire } from 'lwc';
import getSimilarProperty from '@salesforce/apex/propertyController.getSimilarProperty'
import { getRecord } from 'lightning/uiRecordApi';
import AREA_TYPE from '@salesforce/schema/Property__c.Area__c'
import {NavigationMixin} from 'lightning/navigation'
export default class SimilarProperty extends NavigationMixin(LightningElement) {
    similarProperty
    @api recordId
    @api objectApiName

    @wire(getRecord,{recordId: '$recordId', fields:[AREA_TYPE]})
    property

    fetchSimilarProperties(){
        getSimilarProperty({
            propertyId:this.recordId,
            areaType:this.property.data.fields.Area__c.value
        }).then(result=>{
            this.similarProperty = result
            console.log(this.similarProperty)
        }).catch(error=>{
            console.error(error)
        })
    }
    handleViewDetailsClick(event){
        this[NavigationMixin.Navigate]({
            type:'standard__recordPage',
            attributes:{
                recordId:event.target.dataset.id,
                objectApiName:this.objectApiName,
                actionName:'view'
            }
        })
    }
}