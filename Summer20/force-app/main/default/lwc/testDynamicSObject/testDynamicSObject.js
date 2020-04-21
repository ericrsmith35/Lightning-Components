import { LightningElement, api, track, wire } from 'lwc';

export default class TestDynamicSObject extends LightningElement {

    @api input = [];
    @api output = [];

    @track displayInputCount;
    @track displayOutputCount;
    @track displayInputRec1;
    @track displayOutputRec1;

    connectedCallback() {
        console.log('INIT - Input Record Count:',this.input.length);
        this.displayInputCount = this.input.length;
        this.displayInputRec1 = this.input[0].Name;
    }

    handleClick(event) {
        console.log('CLICK-ENTER - Current Output Record Count:',this.output.length);
        this.output = this.input;
        this.displayOutputCount = this.output.length;
        this.displayOutputRec1 = this.output[0].Name;
        console.log('CLICK-EXIT - New Output Record Count:',this.displayOutputCount);
    }
}