import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';
import { Form } from './common/Form';

export interface IOrder {
  deliveryAddress: string;
  paymentMethod: string;
}

export class Order extends Form<IOrder> {
  protected _card: HTMLButtonElement;
  protected _cash: HTMLButtonElement;
  protected _deliveryAddressInput: HTMLInputElement;
  
  constructor(
    protected blockName: string,
    container: HTMLFormElement,
    protected events: IEvents
  ) {
    super(container, events);

    this._card = ensureElement<HTMLButtonElement>('.button_alt[name=card]', this.container);
    this._cash = ensureElement<HTMLButtonElement>('.button_alt[name=cash]', this.container);
    this._deliveryAddressInput = ensureElement<HTMLInputElement>('.form__input[name=address]', this.container);
    
    if (this._cash) {
      this._cash.addEventListener('click', () => {
        this.toggleClass(this._cash, 'button_alt-active', true);
        this.toggleClass(this._card, 'button_alt-active', false);
        this.onInputChange('paymentMethod', this._cash.value = 'cash');
      })
    }
    if (this._card) {
      this._card.addEventListener('click', () => {
        this.toggleClass(this._cash, 'button_alt-active', false);
        this.toggleClass(this._card, 'button_alt-active', true);
        this.onInputChange('paymentMethod', this._card.value = 'card');
      })
    }
    if (this._deliveryAddressInput) {
      this._deliveryAddressInput.addEventListener('input', () => {
        this.onInputChange('deliveryAddress', this._deliveryAddressInput.value);
      });
    }   
  }

  disableButtons() {
    this.toggleClass(this._cash, 'button_alt-active', false);
    this.toggleClass(this._card, 'button_alt-active', false);
  }
}

export interface IContacts {
  phone: string;
  email: string;
}

export class Contacts extends Form<IContacts> {
  protected _phone: HTMLInputElement;
  protected _email: HTMLInputElement;

  constructor(
    container: HTMLFormElement,
    events: IEvents
  ) {
    super(container, events);

    this._phone = ensureElement<HTMLInputElement>('.form__input[name=phone]', this.container);
    this._email = ensureElement<HTMLInputElement>('.form__input[name=email]', this.container);
    
    if (this._phone) {
      this._phone.addEventListener('input', () => {
        this.onInputChange('phone', this._phone.value);
      });
    }

    if (this._email) {
      this._email.addEventListener('input', () => {
        this.onInputChange('email', this._email.value);
      });
    }   
  }
}