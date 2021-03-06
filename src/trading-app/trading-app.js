import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/paper-spinner/paper-spinner.js';
import { sharedStyles } from './shared-styles.js';

/**
 * @customElement
 * @polymer
 */
class TradingApp extends PolymerElement {
  static get template() {
    return html`
    ${sharedStyles}
      <style>
        :host {
          display: block;
        }
      </style>
      <h2>Hello [[prop1]]!</h2>
      <app-location route="{{route}}"></app-location>
      <app-route
          route="{{route}}"
          pattern="/:page"
          data="{{routeData}}"
          tail="{{subroute}}">
      </app-route>
      <app-route
          route="{{subroute}}"
          pattern="/:id"
          data="{{subrouteData}}">
      </app-route>
      <div class="container">
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" href="#">Navbar</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item"><a class="nav-link" href="/buysell-stock">Buy/Sell</a></li>
            <li class="nav-item"><a class="nav-link" href="/stock-summary">Stock Summary</a></li>
            <li class="nav-item"><a class="nav-link" href="/stock-statement">Stock Statement</a></li>
          </ul>
          </div>
          </nav> 
          <div class="d-flex justify-content-center">
            <paper-spinner active={{isActive}}></paper-spinner>
          </div> 
        <iron-pages selected=[[page]] attr-for-selected="name" selected-attribute="visible" fallback-selection="404">
          <buysell-stock name="buysell-stock"></buysell-stock>
          <stock-summary name="stock-summary"></stock-summary>
          <stock-statement name="stock-statement"></stock-statement>
        </iron-pages>
      </div>
    `;
  }
  static get properties() {
    return {
      prop1: {
        type: String,
        value: 'trading-app'
      },
      page:{
        type: String,
        observer: '_pageChanged'
      }
    };
  }
  static get observers(){
    
    return ['_routeChanged(routeData.page)'];
    
  }
  _routeChanged(page){
    this.page = (page || ('buysell-stock'))
  }
  _pageChanged(newPage, oldPage){
    this.isActive = true;
    switch(newPage){
      case 'buysell-stock':
        import('./buysell-stock.js');
        this.isActive = false;
        break;
      case 'stock-summary':
        import('./stock-summary.js');
        this.isActive = false;
        break;
      case 'stock-statement':
        import('./stock-statement.js');
        this.isActive = false;
        break;
      default:
        this.page =  'buysell-stock';   
    }
  }
}

window.customElements.define('trading-app', TradingApp);
