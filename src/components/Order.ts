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

    this._card = container.elements.namedItem('card') as HTMLButtonElement;
    this._cash = container.elements.namedItem('cash') as HTMLButtonElement;
    this._deliveryAddressInput = container.elements.namedItem('address') as HTMLInputElement;
    
    if (this._cash) {
      this._cash.addEventListener('click', () => {
        this._cash.classList.add('button_alt-active')
        this._card.classList.remove('button_alt-active')
        this.onInputChange('paymentMethod', 'cash')
      })
    }
    if (this._card) {
      this._card.addEventListener('click', () => {
        this._card.classList.add('button_alt-active')
        this._cash.classList.remove('button_alt-active')
        this.onInputChange('paymentMethod', 'card')
      })
    }
    if (this._deliveryAddressInput) {
      this._deliveryAddressInput.addEventListener('input', () => {
        this.onInputChange('deliveryAddress', this._deliveryAddressInput.value);
      });
    }   
  }

  disableButtons() {
    this._cash.classList.remove('button_alt-active')
    this._card.classList.remove('button_alt-active')
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

    this._phone = container.elements.namedItem('phone') as HTMLInputElement;
    this._email = container.elements.namedItem('email') as HTMLInputElement;
    
    if (this._phone) {
      this._phone.addEventListener('input', () => {
        this.onInputChange('phone', this._phone.value);
      });
    }

    if (this._email) {
      this._email.addEventListener('input', () => {
        this.onInputChange('email', this._email.value); // Исправляем на 'email'
      });
    }   
  }
}