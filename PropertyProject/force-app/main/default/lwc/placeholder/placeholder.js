import { LightningElement, api } from 'lwc';
import Property_placeholder from '@salesforce/resourceUrl/logo'
export default class Placeholder extends LightningElement {
    @api message

    logoUrl = Property_placeholder
}