import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';

class StockSummary extends PolymerElement{
    constructor(){
        super();
    }
    ready(){
        
        super.ready();

    }
    static get properties(){
        return {
            pageTitle:{
                type: String,
                value: "This is Stock Summary page"
            }
        }
    }
    static get template(){
        return html `
            <h2>[[pageTitle]]</h2>
        `
    }

}
customElements.define("stock-summary", StockSummary);