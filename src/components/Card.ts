import { Component } from './base/Component';
import { TProductCategory } from '../types/index';
import { ensureElement, handlePrice } from '../utils/utils';
import { categoryMapping } from '../utils/constants';

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface ICard {
    id: string;
    title: string;
    category: string;
    description: string;
    image: string;
    price: number | null;
    isSelected: boolean;
}

export class Card extends Component<ICard> {
    protected _title: HTMLElement;
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;
    protected _price: HTMLElement;
    protected _button: HTMLButtonElement;

constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
    super(container);
    
    this._category = container.querySelector(`.${blockName}__category`);
    this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
    this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
    this._button = container.querySelector(`.${blockName}__button`);
    this._price = container.querySelector(`.${blockName}__price`);

    if (actions?.onClick) {
        if (this._button) {
          this._button.addEventListener('click', actions.onClick);
        } else {
          container.addEventListener('click', actions.onClick);
        }
      }
    }

    set id(value: string) {
      this.container.dataset.id = value;
    }
    
    get id(): string {
      return this.container.dataset.id || '';
    }

    set title(value: string) {
      this.setText(this._title, value);
    }
    
    get title(): string {
      return this._title.textContent || '';
    }

    set image(src: string) {
      this.setImage(this._image, src, this.title);
    }
  
    set isSelected(value: boolean) {
      if (!this._button.disabled) {
        this.setDisabled(this._button, value);
      }
    }

    set category(value: TProductCategory) {
      this.setText(this._category, value);
      this._category.classList.add(categoryMapping[value]);
    }

    set price(value: number | null) {
      this.setText(this._price, value ? handlePrice(value) + ' синапсов' : 'Бесценно');
      if (this._button && !value) {
        this.setDisabled(this._button, !value);
      }
    }
}

export class CatalogItem extends Card {
  constructor(container: HTMLElement, actions?: ICardActions) {
    super('card', container, actions);
  }
}

export class CatalogItemPreview extends Card {
  protected _description: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super('card', container, actions);

    this._description = container.querySelector(`.${this.blockName}__text`);
  }

  set description(value: string) {
    this.setText(this._description, value);
  }
}