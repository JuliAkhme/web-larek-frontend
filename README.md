# Проектная работа "Веб-ларёк"

Приложение "Веб-ларёк" — это учебный проект по итогам модуля ООП и TypeScript (спринты 8-9) курса Фронтенд-разработчик от Яндекс Практикум.
Функционал приложения позволяет посмотреть каталог товаров, добавить их в корзину, оформить заказ.

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Архитектура приложения
Код приложения разделен на слои согласно парадигме *MVP (Model-View-Presenter)*: 
- слой данных, отвечает за хранение и изменение данных
- слой представления, отвечает за отображение данных на странице
- презентер, отвечает за связь представления и данных

## Базовый код

### Класс Api
Содержит в себе базовую логику отправки запросов. 
В конструктор передается базовый адрес сервера и глобальные опции для всех запросов(опционально):
`constructor(baseUrl: string, options: RequestInit = {})` 
Методы: 
- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове
- `handleResponse` - обрабатывает HTTP-ответ и возвращает данные в зависимости от результата выполнения запроса

### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе.  
Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.  
В конструктор передается карта для хранения событий и подписок:
`constructor() {
        this._events = new Map<EventName, Set<Subscriber>>();
    }` 
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on` - подписка на событие
- `off` - отписка от события
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие
- `onAll` - подписка на все события
- `offAll` - отписка от всех событий

## Слой данных / Model-V-P 

### Описание категорий товара:
`type TProductCategory = 'хард-скил' | 'софт-скил' | 'кнопка' | 'другое' | 'дополнительное';`

### Описание ошибки валидации форм:
`type TFormErrors = Partial<Record<keyof IOrder, string>>;`

### Типы категорий товаров:
`type TCategoryMapping = {[Key in TProductCategory]: string;};` 

### Интерфейс карточки товара в каталоге IProduct:
- `id: string;` - уникальный ID
- `title: string;` - название товара
- `description: string;` - описание товара
- `price: number | null;` - цена товара выражается числом либо null
- `category: CategoryType;` - категория товара 
- `image: string;` - ссылка на картинку
- `isSelected: boolean;` - наличие товара в корзине

### Интерфейс состояния приложения IAppState, который используется для хранения и работы с карточками и корзиной:
- `catalog: ProductItem[];` - массив карточек товара
- `basket: ProductItem[];` - корзина с товарами
- `order: IOrder;` - информация о заказе при оформлении покупки
- `formErrors: TFormErrors;` - ошибки при заполнении форм
- `setCatalog(items: IProduct[]): void;` - метод для преобразования данных, полученных с сервера, в тип данных приложения
- `addToBasket(value: ProductItem): void;` - метод для добавления товара в корзину
- `removeFromBasket(id: string): void;` - метод для удаления товара из корзины
- `getBasketAmount(): number;` - метод для подсчёта количества товаров, добавленных в корзину
- `getTotalPrice(): number;` - метод для суммирования цен товаров, добавленных в корзину
- `clearBasket(): void;` - метод для очистки корзины
- `setItemsID(): void;` - метод для добавления ID товара в корзине
- `setPayment(method: PaymentMethod): string;` - метод для добавления способа оплаты
- `setOrderField(field: keyof IOrderForm, value: string): void;` - метод для заполнения обязательных к заполнению полей в формах оформления заказа
- `validatePaymentInfo(): boolean;` - валидация форм для модального окна для ввода способа оплаты и адреса доставки
- `validateContactsInfo(): boolean;` - валидация форм для модального окна для ввода номера телефона и электронной почты"
- `updateOrder(): boolean;` - метод для очистки форм заказа после оформления покупки
- `notSelected(): void;` - метод для обновления полей в данных товаров после оформления покупки

### Интерфейс IOrder, описывающий поля заказа товара:
- `items: string[];` - массив ID купленных товаров
- `paymentMethod: PaymentMethod;` - способ оплаты
- `totalPrice: number;` - сумма заказа
- `deliveryAddress: string;` - адрес доставки
- `email: string;` - электронная почта
- `phone: string;` - номер телефона

### Описание вариантов способа оплаты
`type PaymentMethod = 'cash' | 'card';`

### Типы данных формы для заполнения способа оплаты и адреса:  
`type TPaymentInfo = Pick<IOrder, 'paymentMethod' | 'deliveryAddress'>`

### Типы данных формы для заполнения номера телефона и электронной почты:
`type TContactsInfo = Pick<IOrder, 'email' | 'phone'>`

### Тип для сохранения всех данных пользователя для оформления заказа
`type TOrderForm = Pick<IOrder, 'paymentMethod' | 'deliveryAddress' | 'email' | 'phone'>`

### Интерфейс карточки товара ICard:
- `id: string;` - уникальный ID
- `title: string;` - название товара
- `category: CategoryType;` - категория товара
- `description: string;` - описание товара
- `image: string;` - ссылка на картинку
- `price: number | null;` - цена товара выражается числом либо null, если в качестве цены указывается «Бесценно»
- `isSelected: boolean;` - наличие товара в корзине

### Интерфейс для отображения стартовой страницы IPage:
- `counter: number;` - счётчик товаров в корзине
- `catalog: HTMLElement[]` - массив карточек с товарами
- `locked: boolean;` - переключатель для блокировки, отключает прокрутку страницы

### Интерфейс корзины товаров IBasket:
- `list: HTMLElement[];` - массив элементов с товарами, добавленными в корзину
- `totalPrice: number;` - общая цена товаров в корзине

### Интерфейс IOrderResult для модального окна об успешном оформлении заказа
export interface IOrderResult {
    id: string;
    totalPrice: number;
  }

### Класс Model<T>
Представляет собой абстрактную базовую модель для работы с данными и событиями в приложении.   
Конструктор принимает для хранения данные объекта и эмиттер событий:  
`constructor(data: Partial<T>, protected events: IEvents)`  
Метод `emitChanges(event: string, payload?: object)` отвечает за вызов событий.

### Класс AppState
Описывает состояние приложения, наследует данные интерфейса IAppState.  
В полях класса хранятся следующие данные:  
- `catalog: ProductItem[];` - массив со всеми товарами
- `basket: ProductItem[] = [];` - корзина с товарами
- `order: IOrder = { items: [], totalPrice: 0, paymentMethod: '', deliveryAddress: '', email: '', phone: '' };` - объект заказа пользователя
- `formErrors: TFormErrors = {};` - объект с ошибками форм  

Для взаимодействия с данными используются следующие методы:  
- `setCatalog(items: IProduct[]): void;` - метод для преобразования данных, полученных с сервера, в тип данных приложения
- `addToBasket(value: ProductItem): void;` - метод для добавления товара в корзину
- `removeFromBasket(id: string): void;` - метод для удаления товара из корзины
- `getBasketAmount(): number;` - метод для подсчёта количества товаров, добавленных в корзину
- `getTotalPrice(): number;` - метод для суммирования цен товаров, добавленных в корзину
- `clearBasket(): void;` - метод для очистки корзины
- `setItemsID(): void;` - метод для добавления ID товара в корзине
- `setOrderField(field: keyof IOrderForm, value: string): void;` - метод для заполнения обязательных к заполнению полей в формах оформления заказа
- `validatePaymentInfo(): boolean;` - валидация форм для модального окна для ввода способа оплаты и адреса доставки
- `validateContactsInfo(): boolean;` - валидация форм для модального окна для ввода номера телефона и электронной почты
- `updateOrder(): boolean;` - метод для очистки форм заказа после оформления покупки
- `notSelected(): void;` - метод для обновления полей в данных товаров после оформления покупки

## Слой представления / M-View-P

### Класс Component<T>
Представляет собой абстрактный базовый класс для создания и управления элементами интерфейса.  
Конструктор доступен в пределах самого класса и его подклассов и принимает родительский HTML-элемент, в котором будет размещен компонент:  
 `protected constructor(protected readonly container: HTMLElement);`  

Методы:
- `toggleClass(element: HTMLElement, className: string, force?: boolean): void;` – переключает класс
- `protected setText(element: HTMLElement, value: string): void;` - устанавливает текстовое содержимое
- `setDisabled(element: HTMLElement, state: boolean): void;` - сменяет статус блокировки
- `protected setHidden(element: HTMLElement): void;` - скрывает
- `protected setVisible(element: HTMLElement): void;` - показывает
- `protected setImage(el: HTMLImageElement, src: string, alt?: string): void;` - устанавливает изображение с альтернативным текстом
- `render(data?: Partial<T>): HTMLElement;` - возвращает корневой DOM-элемент

### Класс Page
Описывает главную страницу.  
В полях класса хранятся следующие ссылки на внутренние элементы:    
 `protected _counter: HTMLElement;`  
 `protected _catalog: HTMLElement;`  
 `protected _wrapper: HTMLElement;`  
 `protected _basket: HTMLElement;`

Конструктор принимает родительский элемент и обработчик событий:
`constructor(container: HTMLElement, protected events: IEvents)`

Используются следующие сеттеры:
- `set counter(value: number);` - для счётчика товаров в корзине
- `set store(items: HTMLElement[]);` - для карточек товаров на странице
- `set locked(value: boolean);` - для блока прокрутки

### Класс Card
Описывает карточку товара.  
В полях класса хранятся следующие данные:    
`protected _title: HTMLElement;`  
`protected _image: HTMLImageElement;`  
`protected _category: HTMLElement;`  
`protected _price: HTMLElement;`  
`protected _button: HTMLButtonElement;`  

Конструктор принимает имя блока, родительский контейнер и объект с колбэк функциями:  
`constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions);`

Используются сеттеры и геттеры:  
- `set id(value: string);` `get id(): string;` - сеттер и геттер для уникального ID
- `set title(value: string);` `get title(): string;` - сеттер и гетер для названия товара
- `set image(src: string);` - сеттер для изображения
- `set isSelected(value: boolean);` - сеттер для определения, выбран товар или нет
- `set category(value: TProductCategory);` - сеттер для категории товара
- `set price(value: number | null);` - сеттер для цены товара

### Класс Basket 
Описывает корзину товаров.  
В полях класса хранятся следующие данные:  
 `protected _list: HTMLElement;`  
 `protected _price: HTMLElement;`  
 `protected _button: HTMLButtonElement;`

Конструктор принимает имя блока, родительский элемент и обработчик событий:  
` constructor(protected blockName: string, container: HTMLElement, protected events: IEvents);`

Используются сеттеры и методы:  
- `set totalPrice(price: number);` – сеттер для общей цены
- `set list(items: HTMLElement[]);` – сеттер для списка товаров
- `disableButton();` – метод, отключающий кнопку "Оформить"
- `toggleButton(state: boolean)` - метод для изменения состояния кнопки "Оформить"
- `updateIndex(): void;` – метод для обновления индексов таблички при удалении товара из корзины

### Класс Order
Описывает модальное окно для указания способа оплаты и адреса доставки при оформлении заказа.  
В полях класса хранятся следующие данные:  
`protected _card: HTMLButtonElement;`  
`protected _cash: HTMLButtonElement;`

Конструктор принимает имя блока, родительский элемент и обработчик событий:  
` constructor(protected blockName: string, container: HTMLFormElement, protected events: IEvents);`  

Методы:
- `set paymentMethod(value: PaymentMethod)` - сеттер для определения способа оплаты 
- `set deliveryAddress(value: string)` - сеттер для внесения адреса доставки 

### Класс Contacts
Описывает модальное окно для заполнения контактных данных при оформлении заказа.  
Конструктор принимает родительский элемент и обработчик событий:  
`constructor(container: HTMLFormElement, events: IEvents);`
Методы:
- `set phone(value: string)` - сеттер для внесения номера телефона 
- `set email(value: string)` - сеттер для внесения электронной почты 

### Класс AppAPI
Дочерний класс базового класса Api. Используется для взаимодействия с API для обмена данными с конкретным сервером приложения. 
Конструктор принимает базовый url для загрузки изображений, базовый url для API, опциональный параметр для настройки HTTP-запросов:
`constructor(cdn: string, baseUrl: string, options?: RequestInit)`
Методы:
- `getProductList` - возвращает массив товаров с сервера
- `getProduct` - возвращает конкретный товар с сервера по переданному id
- `createOrder` - отправляет введённые данные заказа на сервер и возвращает результат

## Слой коммуникации / M-V-Presenter

Код, описывающий взаимодействие представления и данных между собой, находится в файле `index.ts`, выполняющем роль презентера.  
Взаимодействие осуществляется за счет событий, генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`.
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

Список событий, которые могут генерироваться в системе:
- `items:changed` – перерисовывает список товаров на странице при его изменении
- `card:select` – открывает модальное окно с подробным описанием товара по клику на карточку товара на главной странице
- `card:toBasket` – добавляет выбранный товар в корзину
- `basket:open` – открывает модальное окно по клику на кнопку «Корзина»
- `basket:delete` – удаляет выбранный товар из массива добавленных в корзину товаров
- `basket:order` – открывает модальное окно с формой для заполнения способа оплаты и адреса доставки при оформлении заказа
- `orderFormErrors:change` – проверяет внесение всех обязательных данных в форме для заполнения способа оплаты и адреса
- `contactsFormErrors:change` – проверяет внесение всех обязательных данных в форме для заполнения номера телефона и электронной почты
- `/^order\..*:change$/` - изменение полей в форме для заполнения способа оплаты и адреса
- `/^contacts\..*:change$/` - изменение полей в форме для заполнения номера телефона и электронной почты
- `order:submit` – переходит на второй этап оформления заказа, где необходимо внести номер телефона и электронную почту
- `contacts:submit` – переходит на модальное окно об успешном оформлении заказа
- `order:success` – открывает модальное окно, сообщающее об успешной оплате
- `modal:close` – закрывает модальное окно по клику на кнопку закрытия или по клику вне модального окна
