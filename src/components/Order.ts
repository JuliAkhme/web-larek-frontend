import { PaymentMethod, TContactsInfo, TPaymentInfo } from '../types';
import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events'; 
import { Form } from './common/Form'; 
 
export class Order extends Form<TPaymentInfo> { 
  protected _card: HTMLButtonElement; 
  protected _cash: HTMLButtonElement; 
  protected _deliveryAddressInput: HTMLInputElement; 
   
  constructor( 
    container: HTMLFormElement, 
    protected events: IEvents 
  ) { 
    super(container, events); 

    this._card = ensureElement<HTMLButtonElement>('.button_alt[name=card]', this.container);
    this._cash = ensureElement<HTMLButtonElement>('.button_alt[name=cash]', this.container);
    this._deliveryAddressInput = ensureElement<HTMLInputElement>('.form__input[name=address]', this.container);
    
    this._cash.addEventListener('click', () => {
      this.paymentMethod = 'cash';  
      this.onInputChange('paymentMethod', 'cash');
      console.log('err', this.paymentMethod)
    })
    
    this._card.addEventListener('click', () => {
      this.paymentMethod = 'card';  
      this.onInputChange('paymentMethod', 'card');
      console.log('err', this.paymentMethod)
    })

    this._deliveryAddressInput.addEventListener('input', () => {
      this.onInputChange('deliveryAddress', this._deliveryAddressInput.value);
    })
  }

  set paymentMethod(value: PaymentMethod) {
    this.toggleClass(this._card, 'button_alt-active', value === 'card');
		this.toggleClass(this._cash, 'button_alt-active', value === 'cash');
  }

  set deliveryAddress(value: string) {
    this._deliveryAddressInput.value = value;
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