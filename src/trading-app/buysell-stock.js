import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-toast/paper-toast.js';
import { sharedStyles } from './shared-styles.js';
class BuysellStock extends PolymerElement{
    constructor(){
        super();
    }
    ready(){
        
        super.ready();
        let ticketCreateajax = this.$.ajax;
           ticketCreateajax.method = "get";
           ticketCreateajax.contentType = "application/json";
           ticketCreateajax.url = "http://10.117.189.53:8081/bank/breach/getFranchise";
           this.requestType = 'franchise';
           ticketCreateajax.generateRequest(); 
    }
    static get properties(){
        return {
            pageTitle:{
                type: String,
                value: "This is for Buying/Selling page"
            },
            
            businessCategory:{
                type: Array,
                value: ["Customer Experience", "Risk", "Finance", "Payments"]
            },
            breachCategory:{
                type: Array,
                value: ["Loss of device/physical files", "PIN/Card Issues", "Loss of device/physical files"]
            }
        }
    }
    createTicket(event){
        if(this.$.ticketCreate.validate()){
            
           //console.log(this.selectedCategory, this.amount, this.description, this.selectedDate, this.selectedType);
           let ticketCreateajax = this.$.ajax;
           ticketCreateajax.method = "POST";
           ticketCreateajax.contentType = "application/json";
           
           ticketCreateajax.url = "http://10.117.189.53:8081/bank/breach/getBusiness";
           ticketCreateajax.body = {"name": this.selectedFranchise}; 
           this.requestType = 'business';
           ticketCreateajax.generateRequest(); 
        }
    }
    handleResponse(event,requestType ){
        console.log(event.detail.response);
        console.log(event.detail.response.details);
        this.franchiseCategory = event.detail.response.details;
    }
    static get template(){
        return html `
            ${sharedStyles}
            <h2>[[pageTitle]]</h2>
            <!--<paper-toast id="messageHandle" text="[[toastMessage]]" horizontal-align="center" vertical-align="middle"></paper-toast>-->
            <iron-form id="ticketCreate" class="col-md-4 offset-md-4 border border-secondary pt-3 pb-3">
                
                <form>
                    <paper-dropdown-menu label="Franchise" name="selectFranchise">
                        <paper-listbox slot="dropdown-content" selected="{{selectedFranchise}}" attr-for-selected="name" selected-attribute="visible">
                            <template is="dom-repeat" items="[[franchiseCategory]]">
                                <paper-item name={{item}}>{{item}}</paper-item>
                            </template>
                        </paper-listbox>
                    </paper-dropdown-menu>
                    <paper-dropdown-menu label="Business Area" name="selectBusiness">
                        <paper-listbox slot="dropdown-content" selected="{{selectedBusiness}}" attr-for-selected="name" selected-attribute="visible">
                            <template is="dom-repeat" items="[[businessCategory]]">
                                <paper-item name={{item}}>{{item}}</paper-item>
                            </template>
                        </paper-listbox>
                    </paper-dropdown-menu>
                    <paper-dropdown-menu label="Breach Category" name="selectBreach">
                        <paper-listbox slot="dropdown-content" selected="{{selectedBreach}}" attr-for-selected="name" selected-attribute="visible">
                            <template is="dom-repeat" items="[[breachCategory]]">
                                <paper-item name={{item}}>{{item}}</paper-item>
                            </template>
                        </paper-listbox>
                    </paper-dropdown-menu><br/>
                    <paper-button label="Submit" required raised on-click="createTicket">Submit</paper-input>
                </form>
            </iron-form>
            <iron-ajax
                id="ajax"
                handle-as="json"
                on-response="handleResponse"
                on-error="handleError"
                debounce-duration="300">
            </iron-ajax>
        `
    }

}
customElements.define("buysell-stock", BuysellStock);