import { IProduct } from '../types';
import { handlePrice } from '../utils/utils';
import { Component } from '../components/base/Component';
import { IEvents } from '../components/base/events';
import { ProductItem } from './AppData';

export interface IBasket {
  list: HTMLElement[];
  totalPrice: number;
}

export class Basket extends Component<IBasket> {
  protected _list: HTMLElement;
  protected _price: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(protected blockName: string, container: HTMLElement, protected events: IEvents) {
      super(container);
      this._button = container.querySelector(`.${blockName}__button`);
      this._price = container.querySelector(`.${blockName}__price`);
      this._list = container.querySelector(`.${blockName}__list`);
      if (this._button) {
        this._button.addEventListener('click', () => this.events.emit('basket:order'))
      }
  }

  set totalPrice(price: number) {
    this.setText(this._price, handlePrice(price) + ' синапсов');
  }

  set list(items: HTMLElement[]) {
    this._list.replaceChildren(...items);
    this.setDisabled(this._button, items.length === 0);
  }

  disableButton() {
    this.setDisabled(this._button, true);
  }

  toggleButton(state: boolean) {
    this.setDisabled(this._button, state);
}

  updateIndex() {
    Array.from(this._list.children).forEach((item, index) =>
      (item.querySelector(`.basket__item-index`)!.textContent = (index + 1).toString()));
  }
}

export interface IBasketItem extends IProduct {
  id: string;
  index: number;
}

export interface IBasketActions {
  onClick: (event: MouseEvent) => void;
}

export class BasketItem extends Component<IBasketItem> {
  protected _index: HTMLElement;
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(
    protected blockName: string,
    container: HTMLElement,
    actions?: IBasketActions
  ) {
    super(container);

    this._title = container.querySelector(`.${blockName}__title`);
    this._index = container.querySelector(`.basket__item-index`);
    this._price = container.querySelector(`.${blockName}__price`);
    this._button = container.querySelector(`.${blockName}__button`);

    if (this._button) {
      this._button.addEventListener('click', (evt) => {
        this.container.remove();
        actions?.onClick(evt);
      });
    }
  }

  set title(value: string) {
    this.setText(this._title, value);
  }

  set index(value: number) {
    this.setText(this._index, value.toString());
  }

  set unitPrice(value: number) {
    this.setText(this._price, value ? handlePrice(value) + ' синапсов' : 'Бесценно');
  }
}