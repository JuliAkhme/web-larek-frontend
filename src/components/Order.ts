import { PaymentMethod, TContactsInfo, TPaymentInfo } from '../types';
import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events'; 
import { Form } from './common/Form'; 
 
export class Order extends Form<TPaymentInfo> { 
  protected _card: HTMLButtonElement; 
  protected _cash: HTMLButtonElement; 
  protected _address: HTMLInputElement; 
   
  constructor( 
    container: HTMLFormElement, 
    protected events: IEvents 
  ) { 
    super(container, events); 

    this._card = ensureElement<HTMLButtonElement>('.button_alt[name=card]', this.container);
    this._cash = ensureElement<HTMLButtonElement>('.button_alt[name=cash]', this.container);
    this._address = ensureElement<HTMLInputElement>('.form__input[name=address]', this.container);
    
    this._cash.addEventListener('click', () => {
      this.payment = 'cash';
      this.onInputChange('payment', 'cash');
      this.events.emit('orderForm:change', { field: 'payment', value: 'cash' });
    });
    
    this._card.addEventListener('click', () => {
      this.payment = 'card';  
      this.onInputChange('payment', 'card');
      this.events.emit('orderForm:change', { field: 'payment', value: 'card' });
    })

    this._address.addEventListener('input', () => {
      this.onInputChange('address', this._address.value);
    })
  }

  set payment(value: PaymentMethod) {
    this.toggleClass(this._card, 'button_alt-active', value === 'card');
		this.toggleClass(this._cash, 'button_alt-active', value === 'cash');
  }

  set address(value: string) {
    this._address.value = value;
  }
}

export interface IContacts {
  phone: string;
  email: string;
}

export class Contacts extends Form<TContactsInfo> {
  constructor(
    container: HTMLFormElement,
    events: IEvents
  ) {
    super(container, events);  
  }

  set phone(value: string) {
    (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
  }

  set email(value: string) {
    (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
  }
}