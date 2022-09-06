import { LightningElement, api } from 'lwc';

export default class PropertyTile extends LightningElement {
    @api pro={}

    handleClick(){
        this.dispatchEvent(new CustomEvent('selected', {
            detail:this.pro.Id
        }))
    }
}