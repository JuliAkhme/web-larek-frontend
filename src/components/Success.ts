import { ensureElement, handlePrice } from '../utils/utils';
import { Component } from './base/Component';

interface ISuccessActions {
  onClick: (event: MouseEvent) => void;
}

export interface ISuccess {
  description: number;
}

export class Success extends Component<ISuccess> {
  protected _button: HTMLButtonElement;
  protected _description: HTMLElement;

  constructor(
    protected blockName: string,
    container: HTMLElement,
    actions?: ISuccessActions
  ) {
    super(container);

    this._button = ensureElement<HTMLButtonElement>(`.${blockName}__close`, this.container);
    this._description = ensureElement<HTMLElement>(`.${blockName}__description`, this.container);

    if (actions?.onClick) {
      this._button.addEventListener('click', actions.onClick);
    }
  }

  set total(value: number) {
    this.setText(this._description, 'Списано ' + handlePrice(value) + ' синапсов');
  }
}