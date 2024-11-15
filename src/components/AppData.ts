import { Model } from "./base/Model";
import { IAppState, IProduct, IOrder, IOrderForm, TProductCategory, TFormErrors} from "../types/index";

export type CatalogChangeEvent = {
    catalog: IProduct[]
};

export class ProductItem extends Model<IProduct> {
    id: string;
    title: string;
    description: string;
    price: number;
    category: TProductCategory;
    image: string;
    isSelected: boolean;
}

export class AppState extends Model<IAppState> {
    catalog: ProductItem[];
    basket: ProductItem[] = [];
    order: IOrder = {
        items: [],
        totalPrice: null,
        paymentMethod: '',
        deliveryAddress: '',
        email: '',
        phone: ''
    };

    formErrors: TFormErrors = {};

    setCatalog(items: IProduct[]) {
        this.catalog = items.map(item => new ProductItem({...item, isSelected: false}, this.events));
        this.emitChanges('items:changed', { catalog: this.catalog });
    }

    addToBasket(value: ProductItem) {
        this.basket.push(value);
    }

    removeFromBasket(id: string) {
        this.basket = this.basket.filter(item => item.id !== id);
    }

    getBasketAmount() {
        return this.basket.length;
    }

    getTotalPrice() {
        return this.basket.reduce((sum, next) => sum + next.price, 0);
    }

    clearBasket() {
        this.basket.length = 0;
    }

    setItemsID() {
        this.order.items = this.basket.map(item => item.id);
    }

    setOrderField(field: keyof IOrderForm, value: string) {
        this.order[field] = value;
        if (this.validateContactsInfo()) {
            this.events.emit('contacts:ready', this.order);
        }
        if (this.validatePaymentInfo()) {
            this.events.emit('order:ready', this.order);
        }
    }

    validatePaymentInfo() {
        const errors: typeof this.formErrors = {};
        if (!this.order.paymentMethod) {
            errors.paymentMethod = 'Выберите способ оплаты';
        }
        if (!this.order.deliveryAddress) {
            errors.deliveryAddress = 'Необходимо указать адрес доставки';
        }
        this.formErrors = errors;
        this.events.emit('orderFormErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    validateContactsInfo() {
        const errors: typeof this.formErrors = {};
        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        this.formErrors = errors;
        this.events.emit('contactsFormErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    updateOrder() {
        this.order = {
            items: [],
            paymentMethod: '',
            deliveryAddress: '',
            email: '',
            phone: '',
            totalPrice: null
        }
    } 

    notSelected() {
        this.catalog.forEach(item => item.isSelected = false)
    }
}