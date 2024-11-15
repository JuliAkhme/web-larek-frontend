import { ProductItem } from "../components/AppData";

export type TProductCategory = 'хард-скил' | 'софт-скил' | 'кнопка' | 'другое' | 'дополнительное'; 

export interface IProduct {
    id: string;
    title: string;
    description: string;
    price: number | null;
    category: TProductCategory;
    image: string;
    isSelected: boolean;
}

export interface IOrder {
    items: string[];  
    paymentMethod: string;
    totalPrice: number;
    deliveryAddress: string;
    email: string;
    phone: string;
}
  
export interface IOrderForm {
    paymentMethod: string;
    deliveryAddress: string;
    email: string;
    phone: string;
}

export interface IAppState {
    catalog: ProductItem[];
    basket: ProductItem[];
    order: IOrder;
    formErrors: TFormErrors;
    setCatalog(items: IProduct[]): void;
    addToBasket(value: ProductItem): void;
    removeFromBasket(id: string): void;
    getBasketAmount(): number;
    getTotalPrice(): number;
    clearBasket(): void;
    setItemsID(): void;
    setOrderField(field: keyof IOrderForm, value: string): void;
    validatePaymentInfo(): boolean;
    validateContactsInfo(): boolean;
    updateOrder(): boolean;
    notSelected(): void;
  }

export type TFormErrors = Partial<Record<keyof IOrderForm, string>>;

export type TCategoryMapping = {
    [Key in TProductCategory]: string;
  };

export interface IApiResponse {
    items: IProduct[];
  }