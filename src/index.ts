import './scss/styles.scss';
import { Page } from './components/Page';
import { Api, ApiListResponse } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { Modal } from './components/common/Modal';
import { CatalogItem, CatalogItemPreview } from './components/Card';
import { AppState, ProductItem } from './components/AppData';
import { ensureElement, cloneTemplate } from './utils/utils';
import { IApiResponse, IOrderForm, IProduct } from './types/index';
import { API_URL } from './utils/constants';
import { Basket, BasketItem } from './components/Basket';
import { Contacts, Order } from './components/Order';
import { Success } from './components/Success';

const api = new Api(API_URL);
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
const order = new Order('order', cloneTemplate(orderTemplate), events)
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);
const success = new Success('order-success', cloneTemplate(successTemplate), {
  onClick: () => {
    events.emit('modal:close')
    modal.close()
  }
})

api
  .get('/product')
  .then((res: IApiResponse) => {
    appData.setCatalog(res.items as IProduct[]);
  })
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
    const catalogItem = new BasketItem(
      'card',
      cloneTemplate(cardBasketTemplate),
      {
        onClick: () => events.emit('basket:delete', item)
      }
    );
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

events.on('basket:order', () => {
  modal.render({
    content: order.render(
      {
        deliveryAddress: '',
        valid: false,
        errors: []
      }
    ),
  });
});

events.on('orderFormErrors:change', (errors: Partial<IOrderForm>) => {
  const { paymentMethod, deliveryAddress } = errors;
  order.valid = !paymentMethod && !deliveryAddress;
  order.errors = Object.values({ paymentMethod, deliveryAddress }).filter(i => !!i).join('; ');
});

events.on('contactsFormErrors:change', (errors: Partial<IOrderForm>) => {
  const { email, phone } = errors;
  contacts.valid = !email && !phone;
  contacts.errors = Object.values({ phone, email }).filter(i => !!i).join('; ');
});

events.on('orderInput:change', (data: { field: keyof IOrderForm, value: string }) => {
  appData.setOrderField(data.field, data.value);
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
  api.post('/order', appData.order)
    .then((res) => {
      events.emit('order:success', res);
      appData.clearBasket();
      appData.updateOrder();
      order.disableButtons();
      page.counter = 0;
      appData.notSelected();
    })
    .catch((err) => {
      console.log(err)
    })
})

events.on('order:success', (res: ApiListResponse<string>) => {
  modal.render({
    content: success.render({
      description: res.total
    })
  })
})

events.on('modal:close', () => {
  page.locked = false;
  appData.updateOrder();
});