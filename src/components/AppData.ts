import { Model } from "./base/Model";
import { IAppState, IProduct, IOrder, TProductCategory, TFormErrors, PaymentMethod, TOrderForm } from "../types/index";
import { EMAIL_REGEXP, TEL_REGEXP } from "../utils/constants";

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
        payment: 'card',
        address: '',
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
        return this.basket.reduce((total, item) => {
            return total + (item.price ?? 0);
          }, 0);
    }

    clearBasket() {
        this.basket.length = 0;
    }

    setItemsID() {
        this.order.items = this.basket.map(item => item.id);
    }

    setPayment(method: PaymentMethod) {
		this.order.payment = method;
	}

    setOrderField(field: keyof TOrderForm, value: string) { 
        if (field === 'payment') {
			this.setPayment(value as PaymentMethod);
		} else {
			this.order[field] = value;
		}
    }

    validatePaymentInfo() { 
        const errors: typeof this.formErrors = {}; 
        if (!this.order.payment) { 
            errors.payment = 'Выберите способ оплаты'; 
        } 
        if (!this.order.address) { 
            errors.address = 'Необходимо указать адрес доставки'; 
        } 
        this.formErrors = errors; 
        this.events.emit('orderFormErrors:change', this.formErrors); 
        return Object.keys(errors).length === 0; 
    } 
 
    validateContactsInfo() { 
        const errors: typeof this.formErrors = {}; 
        if (!this.order.email) { 
            errors.email = 'Необходимо указать email'; 
        } else if (!EMAIL_REGEXP.test(this.order.email)) {
			errors.email = 'Неправильно указан email';
		}
        if (!this.order.phone) { 
            errors.phone = 'Необходимо указать телефон'; 
        } else if (!TEL_REGEXP.test(this.order.phone)) {
			errors.phone = 'Неправильно указан телефон';
		}
        this.formErrors = errors; 
        this.events.emit('contactsFormErrors:change', this.formErrors); 
        return Object.keys(errors).length === 0; 
    } 
 
    updateOrder() { 
        this.order = { 
            items: [], 
            payment: 'card', 
            address: '', 
            email: '', 
            phone: '', 
            totalPrice: null 
        } 
    }  

    notSelected() { 
        this.catalog.forEach(item => item.isSelected = false) 
    }
}