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
    paymentMethod: PaymentMethod; 
    totalPrice: number; 
    deliveryAddress: string; 
    email: string; 
    phone: string; 
} 
   
export type TOrderForm = Pick<IOrder, 'paymentMethod' | 'deliveryAddress' | 'email' | 'phone'>
 
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
    setPayment(method: PaymentMethod): string;
    setOrderField(field: keyof TOrderForm, value: string): void; 
    validatePaymentInfo(): boolean; 
    validateContactsInfo(): boolean; 
    updateOrder(): boolean; 
    notSelected(): void; 
  } 
 
export type TFormErrors = Partial<Record<keyof TOrderForm, string>>; 
 
export type TCategoryMapping = { 
    [Key in TProductCategory]: string; 
  }; 
 
export interface IApiResponse { 
    items: IProduct[]; 
  } 

export interface IOrderResult {
    id: string;
    totalPrice: number;
  }

export type PaymentMethod = 'cash' | 'card';

export type TPaymentInfo = Pick<IOrder, 'paymentMethod' | 'deliveryAddress'>;
export type TContactsInfo = Pick<IOrder, 'email' | 'phone'>;