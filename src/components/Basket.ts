import { IProduct } from '../types';
import { handlePrice } from '../utils/utils';
import { Component } from '../components/base/Component';
import { IEvents } from '../components/base/events';

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
    this._price.textContent = handlePrice(price) + ' синапсов';
  }

  set list(items: HTMLElement[]) {
    this._list.replaceChildren(...items);
    this._button.disabled = items.length ? false : true;
  }

  disableButton() {
    this._button.disabled = true;
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
    this._title.textContent = value;
  }

  set index(value: number) {
    this._index.textContent = value.toString();
  }

  set totalPrice(value: number) {
    this._price.textContent = handlePrice(value) + ' синапсов';
  }
}