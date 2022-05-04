import {select, templates} from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';

class Product {
  constructor(id, data) {
    const thisProduct = this;
    thisProduct.id = id;
    thisProduct.data = data;
    thisProduct.renderInMenu();
    thisProduct.getElements();
    thisProduct.initAccordion();
    thisProduct.initOrderForm();
    thisProduct.initAmountWidget();
    thisProduct.processOrder();
    //console.log('new Product: ', thisProduct);
  }
  renderInMenu() {
    const thisProduct = this;
    const generatedHTML = templates.menuProduct(thisProduct.data);
    thisProduct.element = utils.createDOMFromHTML(generatedHTML);
    const menuContainer = document.querySelector(select.containerOf.menu);
    menuContainer.appendChild(thisProduct.element);
  }
  getElements(){
    const thisProduct = this;
    thisProduct.dom = {};
    thisProduct.dom.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
    thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
    thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
    thisProduct.dom.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
    thisProduct.dom.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    thisProduct.dom.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
    thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
  }
  initAccordion() {
    const thisProduct = this;
    thisProduct.dom.accordionTrigger.addEventListener('click', function(event) {
      event.preventDefault();
      const activeProducts = document.querySelectorAll(select.all.menuProductsActive);
      for(let activeProduct of activeProducts) {
        if(activeProduct != thisProduct.element) {
          activeProduct.classList.remove('active');
        }
      }

      thisProduct.element.classList.toggle('active');
    });
  }
  initOrderForm() {
    const thisProduct = this;
    thisProduct.form.addEventListener('submit', function(event){
      event.preventDefault();
      thisProduct.processOrder();
    });

    for(let input of thisProduct.formInputs){
      input.addEventListener('change', function(){
        thisProduct.processOrder();
      });
    }

    thisProduct.dom.cartButton.addEventListener('click', function(event){
      event.preventDefault();
      thisProduct.processOrder();
      thisProduct.addToCart();
    });
  }
  processOrder() {
    const thisProduct = this;
    const formData = utils.serializeFormToObject(thisProduct.form);
    //console.log('formData ' + Object.values(formData));
    let price = thisProduct.data.price;
    for(let paramId in thisProduct.data.params) {
      const param = thisProduct.data.params[paramId];
      //console.log('++' + paramId, param);
      for(let optionId in param.options) {
        const option = param.options[optionId];
        //console.log(thisProduct);
        const imageWrapperSelector = thisProduct.dom.imageWrapper.querySelector('.' + paramId + '-' + optionId);
        if(formData[paramId].includes(optionId) && imageWrapperSelector != null) {
          if(option.default!=true) {
            price += option.price;
            imageWrapperSelector.classList.add('active');
          }
          else {
            imageWrapperSelector.classList.add('active');
          }
        }
        else if(!formData[paramId].includes(optionId) && imageWrapperSelector != null) {
          if(option.default!=true) {
            imageWrapperSelector.classList.remove('active');
          }
          else {
            price -= option.price;
            imageWrapperSelector.classList.remove('active');
          }
        }
        //console.log('+' + optionId, option);
      }
    }
    thisProduct.priceSingle = price;
    price *=thisProduct.amountWidget.value;
    thisProduct.dom.priceElem.innerHTML = price;
    thisProduct.price = price;
  }
  initAmountWidget() {
    const thisProduct = this;
    thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
    thisProduct.amountWidgetElem.addEventListener('updated', function() {
      thisProduct.processOrder();
    });

  }
  addToCart() {
    const thisProduct = this;
    //app.cart.add(thisProduct.prepareCartProduct());
    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: thisProduct.prepareCartProduct(),
      },
    });
    thisProduct.element.dispatchEvent(event);
    console.log('this obj values: '+ JSON.stringify(thisProduct));

  }
  prepareCartProduct() {
    const thisProduct = this;
    const productSummary = {};
    productSummary.id = thisProduct.id;
    productSummary.name = thisProduct.data.name;
    productSummary.amount = thisProduct.amountWidget.value;
    productSummary.priceSingle = thisProduct.priceSingle;
    productSummary.price = thisProduct.price;
    productSummary.params = thisProduct.prepareCartProductParams();

    return productSummary;
  }
  prepareCartProductParams() {
    const thisProduct = this;
    const formData = utils.serializeFormToObject(thisProduct.form);
    const productParams = {};

    for(let paramId in thisProduct.data.params) {
      const param = thisProduct.data.params[paramId];
      productParams[paramId] = {
        label: param.label,
        options: {}
      };
      for(let optionId in param.options) {
        //console.log(thisProduct);
        if(formData[paramId].includes(optionId)) {
          productParams[paramId].options[optionId] = thisProduct.data.params[paramId].options[optionId].label;
        }
        //console.log('+' + optionId, option);
      }
    }
    //console.log('ProductParams'+ JSON.stringify(productParams));
    return productParams;
  }
}
export default Product;