import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-toast/paper-toast.js';
import '@polymer/paper-input/paper-input.js';
import { sharedStyles } from './shared-styles.js';
class BuysellStock extends PolymerElement{
    constructor(){
        super();
    }
    ready(){
        
        super.ready();
        this.isVisible = true;
        
    }
    static get properties(){
        return {
            pageTitle:{
                type: String,
                value: "This is for Buying/Selling page"
            },
            
            users:{
                type: Array,
                value: ["user1", "user2", "user3"]
            },
            stockCompanies:{
                type: Array,
                value: ["HCL", "TCS", "ING"]
            },
            responseData: {
                type: Object,                
                observer: '_getFormattedArray'
                
            },
            res: {
                type: Array,
                value: []
            }
            
        }
    }
    _getFormattedArray( newValue){
        console.log("changed key values", newValue);
        let data = Object.keys(newValue);
        var obj = {};
        for(let i=0; i< data.length; i++){
            //this.set('obj.name', i);
            this.set('obj', newValue[data[i]]);
            obj[i] = newValue[data[i]];
            
           // obj = {key: data[i],value: newValue[data[i]]};
           //console.log(newValue[data[i]])
           //this.set('obj.'+i,  newValue[data[i]]);
            
        }
        //res.push(obj);
        console.log(obj)
        this.push('res', obj);
        //console.log(this.res)
        //this.responseData = res;
    }
    getStockDetails(event){
        this.isActive = true;
        console.log(event.target.selectedItem.textContent);
        ////console.log("on change triggering"); 
        if(this.$.stockselection.validate()){
           //console.log("on change triggering 2"); 
           //console.log("selected stock", event.target.selectedItem.textContent);
           //console.log(this.selectedCategory, this.amount, this.description, this.selectedDate, this.selectedType);
           let stockselectionajax = this.$.ajax;
           //stockselectionajax.method = "POST";
           stockselectionajax.contentType = "application/json";
           
           stockselectionajax.url = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol="+ event.target.selectedItem.textContent +"&apikey=AEKVPK1QUWETJHLM";
           //ticketCreateajax.body = {"name": this.selectedFranchise}; 
           this.requestType = 'getStock';
           stockselectionajax.generateRequest(); 
        }
    }
    handleResponse(event, requestType ){
        switch(this.requestType){
            case 'getStock':
                this.isActive = false;
                this.isVisible = false;
                this.userName = this.selectedUser;
                this.stockName = event.detail.response['Global Quote']['01. symbol'];
                this.unitPrice = event.detail.response['Global Quote']['05. price'];
                break;
            case 'buyStock':
                this.toastMessage = "This transaction is successful"
                this.$.messageHandle.toggle();

               console.log("response message",event.response.message);
                
                break;    
        }
       
       //this.set('responseData', event.detail.response['Global Quote']);
       
    }
    handleError(event){
        this.$.messageHandle.toggle();
        this.toastMessage = "Failed to make transaction";
    }
    buyStock(event){
        
        if(this.$.stockselection.validate()){
            this.TotalPrice = (this.unitPrice * this.qty); 
            let buyStockajax = this.$.ajax;
            buyStockajax.method = "POST";
           buyStockajax.contentType = "application/json";
           buyStockajax.url = "http://13.234.20.255:9080/rmisecurity/tradestock";
           buyStockajax.body = 
           {
               "userName": this.userName,
               "stockName": this.stockName,
               "qty": this.qty,
               "type": "cr",
               "unitPrice": this.unitPrice,
               "TotalPrice": this.TotalPrice
           }
            this.requestType = 'buyStock';
            buyStockajax.generateRequest();
         }
    }
    _getData(item) {
            console.log("inside", item);
            return 1;
    }
    static get template(){
        return html `
            ${sharedStyles}
            <h2>[[pageTitle]]</h2>
            <!--<paper-toast id="messageHandle" text="[[toastMessage]]" horizontal-align="center" vertical-align="middle"></paper-toast>-->
            <paper-toast id="messageHandle" text="[[toastMessage]]" horizontal-align="center" vertical-align="middle"></paper-toast>
            <iron-form id="stockselection" class="col-md-4 offset-md-4 border border-secondary pt-3 pb-3">
                <form>
                    <paper-dropdown-menu label="Users" name="selectUser">
                        <paper-listbox slot="dropdown-content" selected="{{selectedUser}}" attr-for-selected="name" selected-attribute="visible">
                            <template is="dom-repeat" items="[[users]]">
                                <paper-item name={{item}}>{{item}}</paper-item>
                            </template>
                        </paper-listbox>
                    </paper-dropdown-menu>
                    <paper-dropdown-menu  id="paper-listbox" label="Stock Companies" name="selectStock"  on-iron-select="getStockDetails">
                        <paper-listbox slot="dropdown-content"  selected="{{selectedStock}}" attr-for-selected="name" selected-attribute="visible">
                            <template is="dom-repeat" items="[[stockCompanies]]">
                                <paper-item name={{item}}>{{item}}</paper-item>
                            </template>
                        </paper-listbox>
                    </paper-dropdown-menu>
                    <paper-spinner active={{isActive}}></paper-spinner><br/>
                    <div hidden$=[[isVisible]]>Stock Price: {{unitPrice}}</div><br/>
                    <paper-input label="Qty" hidden$=[[isVisible]] value="{{qty}}"></paper-input>
                    <paper-button label="Submit" required raised on-click="buyStock">Submit</paper-input>
                   
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
