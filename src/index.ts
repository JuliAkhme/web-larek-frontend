import './scss/styles.scss'; 
import { Page } from './components/Page'; 
import { ApiListResponse } from './components/base/api'; 
import { EventEmitter } from './components/base/events'; 
import { Modal } from './components/common/Modal'; 
import { CatalogItem, CatalogItemPreview } from './components/Card'; 
import { AppState, ProductItem } from './components/AppData'; 
import { ensureElement, cloneTemplate } from './utils/utils'; 
import { TContactsInfo, TOrderForm, TPaymentInfo } from './types/index'; 
import { API_URL, CDN_URL } from './utils/constants'; 
import { Basket, BasketItem } from './components/Basket'; 
import { Contacts, IContacts, Order } from './components/Order'; 
import { Success } from './components/Success'; 
import { AppAPI } from './components/AppAPI';

const api = new AppAPI(CDN_URL, API_URL);
const events = new EventEmitter();
 
const catalogProductTemplate = ensureElement<HTMLTemplateElement>('#card-catalog'); 
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview'); 
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket'); 
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket'); 
const orderTemplate = ensureElement<HTMLTemplateElement>('#order'); 
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts'); 
const successTemplate = ensureElement<HTMLTemplateElement>('#success') 
const appData = new AppState({}, events); 
const page = new Page(document.body, events); 
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events); 
const basket = new Basket('basket', cloneTemplate(basketTemplate), events); 
const order = new Order(cloneTemplate(orderTemplate), events) 
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);
const success = new Success('order-success', cloneTemplate(successTemplate), {
  onClick: () => {
    events.emit('modal:close')
    modal.close()
  }
})
api
  .getProductList()
  .then(appData.setCatalog.bind(appData))
  .catch((err) => {
    console.error(err);
  });

events.on('items:changed', () => {
  page.catalog = appData.catalog.map((item) => {
    const product = new CatalogItem(cloneTemplate(catalogProductTemplate), {
      onClick: () => events.emit('card:select', item),
    });
    return product.render({
      id: item.id,
      title: item.title,
      image: item.image,
      category: item.category,
      price: item.price,
    });
  });
});

events.on('card:select', (item: ProductItem) => { 
  page.locked = true; 
  const product = new CatalogItemPreview(cloneTemplate(cardPreviewTemplate), { 
    onClick: () => { 
      events.emit('card:toBasket', item) 
    }, 
  }); 
  modal.render({ 
    content: product.render({ 
      id: item.id, 
      title: item.title, 
      image: item.image, 
      category: item.category, 
      description: item.description, 
      price: item.price, 
      isSelected: item.isSelected 
    }), 
  }); 
}); 
 
events.on('card:toBasket', (item: ProductItem) => { 
  item.isSelected = true; 
  appData.addToBasket(item); 
  page.counter = appData.getBasketAmount(); 
  modal.close(); 
}) 
 
events.on('basket:open', () => { 
  page.locked = true 
  const basketItems = appData.basket.map((item, index) => { 
    const catalogItem = new BasketItem('card', cloneTemplate(cardBasketTemplate), { 
        onClick: () => events.emit('basket:delete', item) 
      } 
    ); 
    catalogItem.unitPrice = item.price ?? null;
    return catalogItem.render({ 
      title: item.title, 
      price: item.price, 
      index: index + 1, 
    }); 
  }); 
  modal.render({ 
    content: basket.render({ 
      list: basketItems, 
      totalPrice: appData.getTotalPrice(), 
    }), 
  }); 
}); 
 
events.on('basket:delete', (item: ProductItem) => { 
  appData.removeFromBasket(item.id); 
  item.isSelected = false; 
  basket.totalPrice = appData.getTotalPrice(); 
  page.counter = appData.getBasketAmount(); 
  basket.updateIndex(); 
  if (!appData.basket.length) { 
    basket.disableButton(); 
  } 
}) 
 
events.on('order:open', () => { 
  appData.updateOrder();
  modal.open();
  modal.render({ 
    content: order.render( 
      { 
        valid: false, 
        errors: [] 
      } 
    ), 
  }); 
}); 
 
events.on('orderFormErrors:change', (errors: Partial<TPaymentInfo>) => { 
  const { payment, address } = errors; 
  const formIsValid = !payment && !address;
	order.valid = formIsValid;
	if (!formIsValid) {
		order.errors = address;
	} else {
		order.errors = '';
	}}); 
 
events.on('contactsFormErrors:change', (errors: Partial<TContactsInfo>) => { 
  const { email, phone } = errors; 
  const formIsValid = !email && !phone;
	contacts.valid = formIsValid;
	if (!formIsValid) {
		contacts.errors = email || phone;
	} else {
		contacts.errors = '';
	}}); 
 
events.on(/^order\..*:change$/, (data: { field: keyof TOrderForm, value: string }) => { 
  appData.setOrderField(data.field, data.value); 
  appData.validatePaymentInfo();
}); 

events.on(/^contacts\..*:change$/, (data: { field: keyof TOrderForm, value: string }) => { 
  appData.setOrderField(data.field, data.value); 
  appData.validateContactsInfo();
}); 
 
events.on('order:submit', () => { 
  appData.order.totalPrice = appData.getTotalPrice() 
  appData.setItemsID(); 
  modal.render({ 
    content: contacts.render( 
      { 
        valid: false, 
        errors: [] 
      } 
    ), 
  }); 
}) 

events.on('contacts:submit', () => {
  const orderData = {
    ...appData.order, 
    total: appData.getTotalPrice()
  }
  console.log('error', orderData)
  api
    .createOrder(orderData)
    .then((res) => {
      modal.render({content: success.render()});
      success.total = res.total;
			appData.clearBasket();
			appData.updateOrder();
    })
    .catch((err) => {
      console.log(err)
    })
})

events.on('modal:close', () => {
  page.locked = false;
});