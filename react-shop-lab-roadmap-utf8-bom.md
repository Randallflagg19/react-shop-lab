# React Shop Lab — roadmap проекта для тренировки React Hooks + TypeScript в Next.js

## Цель проекта

Сделать небольшой учебный интернет-магазин на **Next.js App Router + React + TypeScript**, используя открытое API с товарами.
Проект нужен не ради красивого портфолио, а как тренировочная площадка для собеседований и ручного кодинга.

Главная цель:

> Научиться уверенно писать React-код руками: `useState`, `useEffect`, `useRef`, `useMemo`, `useCallback`, `React.memo`, custom hooks, controlled inputs, immutable updates, derived state, работа с API, loading/error/empty states.

Next.js здесь используется как оболочка для маршрутизации, деплоя и знакомства с Server Components. Он не должен забирать основную учебную задачу: понять клиентский React и его hooks.

---

## Базовый стек

- Next.js 16 с App Router
- React 19
- TypeScript в strict mode
- Tailwind CSS 4
- Platzi Fake Store API
- Без Redux на первом этапе
- Без React Query на первом этапе
- Без UI-библиотек на первом этапе

Почему без Redux/React Query сначала:

> Сейчас важно понять базовый React. Если сразу взять готовые библиотеки, они закроют за тебя часть проблем, которые тебе нужно руками прочувствовать.

---

## Учебная граница Next.js и React

В App Router `page.tsx` и `layout.tsx` по умолчанию являются Server Components.

Server Components используем для:

- маршрутов и layouts;
- статической оболочки страницы;
- metadata;
- серверной загрузки данных в отдельном сравнительном упражнении;
- страницы товара `products/[slug]/page.tsx`.

Client Components используем там, где нужны:

- `useState`, `useEffect` и другие client hooks;
- обработчики `onClick`, `onChange`;
- controlled inputs;
- `window`, `document`, `localStorage`;
- интерактивная корзина, фильтры и избранное.

Не надо ставить `'use client'` в `layout.tsx` или во всём `page.tsx` только ради одного интерактивного блока. Лучше создать узкую клиентскую границу, например `ProductsCatalog.tsx`.

Первую загрузку товаров намеренно делаем через `useEffect` в Client Component. Для production-приложения Next.js часто естественнее загрузить данные в Server Component, но тогда мы не потренируем lifecycle эффекта, cleanup и `AbortController`. Позже сравним оба подхода.

Специальные файлы App Router вводим только когда появляется соответствующий сценарий:

- `loading.tsx` — route-level loading UI для навигации и streaming;
- `error.tsx` — route error boundary; этот файл является Client Component;
- `not-found.tsx` — UI для отсутствующего ресурса;
- `products/[slug]/page.tsx` — динамический маршрут товара.

Локальные состояния `isLoading` и `error` внутри `ProductsCatalog` не заменяем этими файлами: они описывают состояние клиентского запроса после монтирования компонента.

---

## API

Базовое API:

```txt
https://api.escuelajs.co/api/v1/products
```

Полезные endpoints:

```txt
GET /products
GET /products/:id
GET /products/slug/:slug
GET /products?offset=0&limit=10
GET /products?title=shirt
GET /products?price_min=10&price_max=100
GET /products?categoryId=1
GET /products?categorySlug=clothes
GET /categories
```

На старте можно использовать только:

```txt
https://api.escuelajs.co/api/v1/products
```

И уже на клиенте делать поиск, фильтры и сортировку.

Почему Platzi Fake Store:

- данные ближе к реальному e-commerce: товары, категории, users, JWT auth;
- у товара есть вложенная категория и массив изображений;
- есть pagination, фильтрация по title/category/price и CRUD;
- позже можно добавить auth или server-side фильтры как отдельные advanced-этапы.

На первых этапах не используем серверные фильтры API, даже если они доступны. Сначала тренируем controlled inputs, derived state, `filter`, `sort` и `useMemo` руками на клиенте.

---

## Текущий прогресс

Дни 1–18 завершены. Текущий момент — **День 19: useSyncExternalStore**.

Уже сделано:

- roadmap адаптирован под Next.js App Router;
- базовый skeleton проекта создан;
- стартовый UI `create-next-app` убран;
- созданы типы `ProductCategory` и `Product`;
- создан API-слой для списка товаров: `fetchProducts(signal?)`;
- клиентская загрузка товаров вынесена в `useProducts`;
- в `useEffect` добавлены `AbortController`, cleanup и обработка `AbortError`;
- каталог разбит на `ProductsCatalog`, `ProductCardList` и `ProductCard`;
- карточки товара отображают изображение, цену, название, категорию, описание и slug;
- для карточек используется `next/image` с `fill`, wrapper-контейнером и fallback-логикой для невалидных изображений API;
- добавлена динамическая страница товара `src/app/products/[slug]/page.tsx`;
- страница товара загружает конкретный товар в Server Component через `/products/slug/:slug`;
- отсутствующий товар обрабатывается через `notFound()`;
- создан `ProductDetails` для детальной страницы товара;
- добавлен controlled input для поиска по названию;
- поиск реализован как derived data: `filteredProducts`, без отдельного state;
- добавлены состояния loading/error/empty/search-empty;
- верхняя часть каталога оформлена как catalog header + meta row с количеством результатов.
- добавлены category chips с активным состоянием и фильтрацией по `category.slug`;
- добавлен controlled select сортировки: default, price asc/desc, title A–Z;
- поиск, категория и сортировка объединены в единый derived массив `visibleProducts`;
- `categories` и `visibleProducts` мемоизированы через два независимых `useMemo` с разными dependencies;
- каталог и страница товара адаптированы для desktop, tablet и mobile;
- создана feature корзины: тип `CartItem`, компоненты `Cart` и `CartRow`;
- создан временный маршрут `/cart` с mock-данными для отработки локальной корзины;
- реализованы immutable-функции добавления, удаления и изменения количества;
- вычисляются derived-значения `totalCount` и `totalPrice`;
- корзина дополнена summary, очисткой и empty state;
- логика корзины вынесена в custom hook `useCart`;
- добавлено избранное на основе массива `favoriteIds`;
- `ProductCard` мемоизирован через `React.memo`, а обработчик избранного — через `useCallback`;
- на практике проверено, как стабильная ссылка на callback влияет на ререндеры карточек;
- каталог разделён на `ProductsCatalog`, `CatalogHeader` и `CatalogMeta` без дублирования derived-логики;
- через `useRef` и `useEffect` реализован автоматический фокус поискового input;
- создан `useDebounce`, и фильтрация каталога переведена на отложенное поисковое значение;
- корзина переведена с `useState` на типизированный `useReducer`;
- reducer обрабатывает add, remove, increase, decrease и clear, а `useCart` возвращает удобный публичный API.
- создан `CartContext`, `CartProvider` и `useCartContext`;
- общий `CartProvider` подключён через client `Providers` внутри server `layout.tsx`;
- `/cart` читает состояние корзины из контекста, а страница товара добавляет товар через `addToCart(product)`;
- интерактивная кнопка добавления товара вынесена в отдельный client component, чтобы `ProductDetails` мог оставаться server component;
- search input и sort select связаны с `label` через `useId`;
- search control визуально доработан: видимый label, иконка поиска, стабильная ширина счётчика и защита от layout shift при появлении scrollbar.
- проведён FSD-рефакторинг: product API перенесён в `entities/product/api`, cart/favorites actions вынесены в features, `ProductDetails` и `ProductCard` очищены через slots/actions, список каталога перенесён в `features/products-catalog`, компонентные стили перенесены из `globals.css` в Tailwind-классы компонентов.
- `useDeferredValue` разобран на примере поиска и сравнён с существующим `useDebounce`; для текущего UX поиска оставлен debounce как более подходящее решение.
- `useTransition` применён к смене категории каталога; `isPending` передан в meta UI и используется для временного disabled/opacity состояния category chips.
- `useLayoutEffect` разобран на измерении DOM в строке категорий: через `ref`, `offsetTop` и resize listener проверялся перенос category chips на новую строку; упражнение осознанно не оставлено в продуктовой версии, потому что реальной необходимости в UI нет.
- `useImperativeHandle` применён к `CatalogSearch`: компонент прячет настоящий input ref и отдаёт наружу ограниченный handle с командами `focus()` и потенциальным `clear()`, используя модель `ref` как prop в React 19.

Следующий шаг:

> День 19: сохранить favorites в `localStorage` через внешний store и `useSyncExternalStore`, затем добавить persistence корзины, сохранив её текущую архитектуру на `useReducer` и Context.

Замечание по API:

> Platzi Fake Store API может быть нестабильным на Vercel или отвечать с задержкой. Для учебного проекта это допустимо, потому что error state уже есть. Для более стабильного демо позже можно добавить limit, fallback/mock data или Next Route Handler как proxy.

---

## Что должен уметь проект в финале

Минимальная версия:

- загружать товары с API;
- показывать loading/error/empty states;
- отображать список товаров;
- фильтровать по поиску;
- фильтровать по категории;
- сортировать по цене/названию;
- добавлять товары в корзину;
- удалять товары из корзины;
- менять количество товара;
- считать итоговую сумму;
- добавлять товары в избранное;
- открывать карточку товара;
- использовать `useRef` для управления фокусом;
- использовать `useMemo` там, где есть derived data;
- использовать `useCallback` вместе с `React.memo`;
- вынести часть логики в custom hooks;
- понимать, почему конкретный компонент является Server или Client Component;
- сравнить клиентскую загрузку через `useEffect` с серверной загрузкой в App Router.

---

# Структура проекта

Не надо делать идеальную FSD-архитектуру сразу. Структура должна расти вместе с задачами, а не появиться целиком в первый день.

```txt
src/
  app/
    globals.css
    layout.tsx
    page.tsx
    products/
      [slug]/
        page.tsx

  shared/
    api/
      products.ts
      productBySlug.ts
    ui/
      Loader.tsx
      ErrorMessage.tsx
      EmptyState.tsx

  entities/
    product/
      model/
        types.ts
        getProductImageSrc.ts
      ui/
        ProductCard.tsx
        ProductCardList.tsx
        ProductDetails.tsx

  features/
    products-catalog/
      ui/
        ProductsCatalog.tsx
      model/
        useProducts.ts
    product-filters/
      ui/
        ProductFilters.tsx
    cart/
      model/
        useCart.ts
        cartReducer.ts
      ui/
        Cart.tsx
        CartItem.tsx
    favorites/
      model/
        useFavorites.ts

  hooks/
    useDebounce.ts
    usePrevious.ts
```

Правила:

- `src/app` отвечает прежде всего за маршруты, layouts и сборку страницы;
- `entities/product` содержит модель и UI товара;
- `features` содержит пользовательские сценарии;
- `shared` содержит переиспользуемые API-функции и простой UI;
- feature-specific hooks храним рядом с feature;
- в общий `hooks` выносим только действительно общие hooks.

На первом этапе начинаем проще и создаём папки только по необходимости:

```txt
src/
  app/
    layout.tsx
    page.tsx
    globals.css
    products/
      [slug]/
        page.tsx
  entities/
    product/
      model/
        types.ts
        getProductImageSrc.ts
      ui/
        ProductCard.tsx
        ProductCardList.tsx
        ProductDetails.tsx
  features/
    products-catalog/
      model/
        useProducts.ts
      ui/
        ProductsCatalog.tsx
  shared/
    api/
      products.ts
      productBySlug.ts
```

Фактическая структура на текущей точке уже немного опередила ранний план: добавлен динамический маршрут товара, detail view и helper для безопасного выбора изображения из нестабильных данных Platzi API. Папки `product-filters`, `cart`, `favorites`, `shared/ui` и общий `hooks/` пока не создаём заранее.

---

# День 1 проекта — Products API + useEffect

## Цель

Понять границу Server/Client Components и загрузить товары через `useEffect`.

## Что сделать

1. Убедиться, что проект запускается через:

```bash
npm run dev
```

2. Изучить текущие `src/app/page.tsx` и `src/app/layout.tsx`.

3. Почистить стартовый UI `create-next-app`, не меняя архитектуру заранее.

4. Создать типы товара в `src/entities/product/model/types.ts`:

```ts
export type ProductCategory = {
  id: number;
  name: string;
  image: string;
  slug: string;
};

export type Product = {
  id: number;
  title: string;
  slug: string;
  price: number;
  description: string;
  category: ProductCategory;
  images: string[];
  creationAt: string;
  updatedAt: string;
};
```

5. Создать `fetchProducts` в `src/shared/api/products.ts`.

Функция должна:

- принимать необязательный `AbortSignal`;
- выполнять `fetch`;
- проверять `response.ok`;
- возвращать `Promise<Product[]>`;
- не содержать React state и JSX.

6. Создать Client Component `ProductsCatalog.tsx` с директивой `'use client'`.

7. В `ProductsCatalog` создать state:

```ts
const [products, setProducts] = useState<Product[]>([]);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
```

8. В `useEffect` загрузить товары через `fetchProducts`.

9. Показать четыре взаимоисключающих состояния:

- loading;
- error;
- список товаров;
- empty state.

10. Оставить `src/app/page.tsx` Server Component и отрендерить в нём `<ProductsCatalog />`.

## Что тренируется

- граница Server/Client Components
- директива `'use client'`
- `useEffect`
- async внутри effect
- dependency array
- `useState`
- loading/error state
- TypeScript типы API
- вложенные объекты в типах

## Вопросы для самопроверки

- Почему `category` — объект, а не строка?
- Почему `ProductCategory` лучше вынести в отдельный тип?
- Почему callback `useEffect` не должен быть `async` напрямую?
- Почему dependency array здесь пустой?
- Почему `ProductsCatalog`, а не весь `page.tsx`, является Client Component?
- Что произойдёт с effect в React Strict Mode в development?
- Почему в App Router Strict Mode включён по умолчанию?
- Где лучше хранить `products`: state или derived state?
- Почему `error` лучше хранить отдельно?
- Почему `fetchProducts` не должен вызывать `setProducts`?
- Почему `fetchProducts` возвращает `Product[]`, а не весь `Response` из `fetch`?
- Чем локальный loading state отличается от route-level `loading.tsx`?

## Зачёт этапа

Этап зачтён, если:

- `page.tsx` остаётся Server Component;
- `'use client'` находится в `ProductsCatalog.tsx`;
- товары загружаются;
- при загрузке виден loading;
- при ошибке видна ошибка;
- список отображается через `map`;
- у элементов есть `key={product.id}`;
- ты можешь словами объяснить, почему этот fetch сделан на клиенте намеренно.

---

# День 2 проекта — AbortController + useEffect глубже

Статус: **завершён**.

## Цель

Понять cleanup в `useEffect` и отмену запроса.

## Что сделать

1. Внутри `useEffect` создать:

```ts
const controller = new AbortController();
```

2. Передать `signal` в `fetch`:

```ts
fetch(url, { signal: controller.signal });
```

3. В cleanup вызвать:

```ts
return () => {
  controller.abort();
};
```

4. В `catch` отдельно обработать `AbortError`.

## Что тренируется

- cleanup function
- `AbortController`
- race conditions
- размонтирование компонента
- изменение зависимостей effect

## Что важно понять

Cleanup вызывается:

1. при размонтировании компонента;
2. перед следующим запуском эффекта, если зависимости изменились.

## Собеседовательский ответ

> `AbortController` позволяет отменить fetch-запрос. В `useEffect` я создаю controller, передаю `controller.signal` в fetch, а в cleanup вызываю `controller.abort()`. Это освобождает ненужную сетевую работу и защищает от race condition, когда устаревший запрос завершается после более нового. `AbortError` является ожидаемым результатом отмены, поэтому его не нужно показывать пользователю как ошибку сервера.

## Зачёт этапа

Этап зачтён, если ты можешь словами объяснить:

- что делает `signal`;
- что делает `abort`;
- когда вызывается cleanup;
- почему не надо считать `AbortError` обычной ошибкой сервера.

---

## Контрольная точка — client fetch и server fetch

После закрепления `useEffect` сделать небольшой сравнительный эксперимент, не переписывая основной каталог:

1. Создать временную серверную страницу или серверный компонент.
2. Вызвать ту же API-функцию на сервере без `useEffect`.
3. Сравнить подходы:

| Client fetch через `useEffect`     | Server fetch в App Router                                            |
| ---------------------------------- | -------------------------------------------------------------------- |
| Нужен Client Component             | Можно оставить Server Component                                      |
| Есть client loading/error state    | Можно использовать `Suspense`, `loading.tsx` и server error boundary |
| Запрос начинается после гидратации | Данные могут попасть в первоначальный HTML                           |
| Удобно изучать lifecycle и cleanup | Меньше client JavaScript                                             |
| Доступны browser API               | Доступны секреты и server-only зависимости                           |

Важно: это сравнение, а не причина немедленно удалить учебную реализацию через `useEffect`.

В Next.js 16 нельзя автоматически считать любой server `fetch` закешированным. Перед выбором cache/revalidation поведения нужно сверяться с локальной документацией установленной версии.

Вопрос для собеседования:

> Почему в Next.js ты загрузил товары через `useEffect`, если можно было сделать это на сервере?

Ожидаемый ответ:

> Это осознанный учебный выбор для практики client lifecycle, loading/error state, cleanup и `AbortController`. В production я бы выбирал между server и client fetch по требованиям к интерактивности, свежести данных, SEO, кешированию и доступу к browser API.

---

## Рефакторинг после понимания механики — useProducts

Статус: **завершён**.

Только после того как загрузка написана и объяснена руками, вынести её в:

```txt
src/features/products-catalog/model/useProducts.ts
```

Hook должен вернуть понятный API:

```ts
{
  products,
  isLoading,
  error,
}
```

Не надо сразу делать универсальный `useFetch<T>`. Такой hook быстро обрастает параметрами, кешированием и политиками повторных запросов. Пока полезнее предметный `useProducts`, название и API которого отражают конкретную задачу.

Вопросы:

- Что именно стало переиспользуемым после выделения hook?
- Почему API-функция и custom hook находятся на разных уровнях?
- Почему hook может использовать React state, а `fetchProducts` не должен?
- Когда абстракция `useFetch` стала бы оправданной?

---

# День 3 проекта — ProductCard + ProductList

Статус: **завершён**.

## Цель

Разбить UI на компоненты и потренировать props.

## Что сделать

1. Создать `ProductCard`.

Props:

```ts
type ProductCardProps = {
  product: Product;
};
```

2. Создать список карточек товара.

Props:

```ts
type ProductCardListProps = {
  products: Product[];
};
```

3. Отображать:

- картинку;
- title;
- price;
- category name;
- короткое описание;
- slug или id для будущей ссылки.

4. Использовать `key={product.id}`.

5. Для первого прохода допустимо использовать обычный `<img>`, чтобы не отвлекаться от React.

6. При переходе на `next/image`:

- указать размеры или использовать `fill`;
- разрешить домены изображений Platzi API через `images.remotePatterns` в `next.config.ts`;
- проверить, что layout карточки не прыгает при загрузке изображения.

## Что тренируется

- props typing
- composition
- `map`
- `key`
- базовая декомпозиция компонентов

## Вопросы для самопроверки

- Почему `key` должен быть `product.id`, а не `index`?
- Что будет, если список отсортировать, а key будет index?
- Чем `ProductCard` отличается от `ProductList` по ответственности?
- Нужно ли хранить ProductCard в state? Почему нет?
- Зачем `next/image` нужны размеры удалённого изображения?

## Зачёт этапа

Этап зачтён, если список разбит на компоненты, код читаемый, props типизированы.

Фактическое имя компонента списка сейчас — `ProductCardList`. Это рабочее имя. В будущем его можно переименовать в `ProductList`, если захочется сделать название менее завязанным на конкретный способ отображения.

---

## Дополнительный этап App Router — страница товара

Статус: **завершён в базовой версии**.

После появления `ProductCard` можно добавить маршрут:

```txt
src/app/products/[slug]/page.tsx
```

На этом этапе:

- карточка ведёт на `/products/:slug` через `next/link`;
- `page.tsx` получает динамический `params`;
- конкретный товар загружается в Server Component через `/products/slug/:slug`;
- отсутствующий товар обрабатывается как not found;
- интерактивная кнопка «Добавить в корзину» остаётся отдельным Client Component.

Перед реализацией нужно прочитать локальную документацию установленной версии Next.js о dynamic routes: сигнатура `params` могла измениться по сравнению со старыми примерами.

Это упражнение не заменяет клиентский каталог. Оно показывает композицию Server и Client Components.

Фактически сделано дополнительно:

- основной каталог остался Client Component;
- страница `products/[slug]` сделана Server Component;
- `params` в Next.js 16 обрабатывается как `Promise<{ slug: string }>`;
- товар загружается через `fetchProductBySlug(slug)`;
- `400`/`404` от Platzi API для отсутствующего slug приводят к `notFound()`;
- создан `ProductDetails` с крупной картинкой, описанием, slug/id, quantity UI, кнопкой `Add to cart` и ссылкой `Back to catalog`;
- `Add to cart` пока не подключён к настоящей корзине и будет доработан на этапе cart.

---

# День 4 проекта — поиск и controlled input

Статус: **завершён**.

## Цель

Сделать поиск товаров по названию.

## Что сделать

1. Создать state:

```ts
const [search, setSearch] = useState("");
```

2. Создать input:

```tsx
<input value={search} onChange={(event) => setSearch(event.target.value)} />
```

3. Создать derived data:

```ts
const filteredProducts = products.filter((product) =>
  product.title.toLowerCase().includes(search.toLowerCase()),
);
```

4. Передавать в список `filteredProducts`.

5. Если ничего не найдено — показать empty state.

## Что тренируется

- controlled input
- `useState`
- derived state
- filter
- empty state

## Вопросы для самопроверки

- Что такое controlled component?
- Где хранится значение input?
- Почему `filteredProducts` не нужно хранить в `useState`?
- Что такое derived state?
- Что будет, если хранить `filteredProducts` отдельно?

## Зачёт этапа

Этап зачтён, если поиск работает без учёта регистра, а `filteredProducts` не хранится в отдельном state.

Фактически сделано дополнительно:

- поиск встроен в верхнюю часть каталога;
- добавлен catalog header: `React Shop Lab`, subtitle и search input;
- добавлена meta row: `N of M products` при активном поиске и подсказка `Search by product title`;
- отдельно обработан empty state для пустого API и empty state для пустого результата поиска;
- `search.trim()` используется при фильтрации, чтобы пробелы не ломали поиск.

---

# День 5 проекта — категории и сортировка

Статус: **завершён**.

Фактическая реализация использует category chips вместо category select. Сортировка остаётся controlled select. Итоговый массив учитывает поиск, выбранную категорию и сортировку, а `toSorted()` не мутирует исходные данные.

## Цель

Добавить фильтр по категории и сортировку поверх уже существующего поиска.

## Что сделать

Уже есть:

```ts
const [search, setSearch] = useState("");
```

Добавить state:

```ts
const [category, setCategory] = useState("all");
const [sortBy, setSortBy] = useState<
  "default" | "price-asc" | "price-desc" | "title-asc"
>("default");
```

Фильтры:

- `all`;
- конкретная категория.

Сортировка:

- default;
- price ascending;
- price descending;
- title ascending.

Для Platzi API категория товара — объект, поэтому фильтр делаем не по `product.category`, а по одному из полей:

```ts
product.category.id;
product.category.slug;
product.category.name;
```

На старте проще хранить в state `categorySlug`, потому что это читаемое значение для UI.

Порядок для текущей реализации:

1. Сначала оставить текущий поиск как есть.
2. Добавить derived список категорий из `products`, не храня его в отдельном state.
3. Добавить controlled select для категории.
4. Добавить controlled select для сортировки.
5. Заменить `filteredProducts` на более общее имя, например `visibleProducts`, потому что массив будет учитывать:

```txt
search + category + sortBy
```

6. В meta row показывать количество `visibleProducts.length` относительно `products.length`.

Важно: сначала можно написать вычисление прямо в `ProductsCatalog`. В `useMemo` переносим только на следующем дне, когда появится повод обсудить memoization.

## Что тренируется

- controlled select
- derived state
- filter + sort
- аккуратная работа с массивами

## Важный момент

`sort` мутирует массив.

Плохо:

```ts
products.sort(...)
```

Хорошо:

```ts
[...products].sort(...)
```

## Вопросы для самопроверки

- Почему нельзя сортировать `products` напрямую?
- Почему `sort` опасен для state?
- Где здесь derived state?
- Какой порядок: сначала filter, потом sort или наоборот?
- Чем отличается фильтрация по `category.name`, `category.id` и `category.slug`?
- Почему категории не нужно хранить в отдельном `useState`, если их можно вычислить из `products`?
- Почему после добавления категории имя `filteredProducts` становится менее точным?

## Зачёт этапа

Этап зачтён, если фильтрация и сортировка работают, а исходный массив не мутируется.

---

# День 6 проекта — useMemo

Статус: **завершён**.

Фактически добавлены два независимых `useMemo`:

- `categories` зависит только от `products`;
- `visibleProducts` зависит от `products`, `search`, `currentCategory` и `sortBy`.

## Цель

Понять `useMemo` на реальной derived data.

## Что сделать

Обернуть вычисление filtered/sorted products:

```ts
const visibleProducts = useMemo(() => {
  return products
    .filter(...)
    .sort(...);
}, [products, search, category, sortBy]);
```

## Что тренируется

- `useMemo`
- dependencies
- derived state
- мемоизация вычислений

## Главное понимание

`useMemo` не отменяет ререндер компонента.

Он только кеширует результат вычисления между рендерами, если зависимости не изменились.

## Когда useMemo уместен

- список большой;
- вычисление тяжёлое;
- результат передаётся в memoized child;
- нужна стабильная ссылка на массив.

## Когда useMemo лишний

- список маленький;
- вычисление дешёвое;
- код становится сложнее без пользы.

## Вопросы для самопроверки

- Чем `useMemo` отличается от `useState`?
- Почему `visibleProducts` не надо хранить в state?
- Что будет, если забыть `category` в dependencies?
- Почему `useMemo` не предотвращает сам ререндер?

## Зачёт этапа

Этап зачтён, если ты можешь объяснить `useMemo` без фразы “он предотвращает ререндер”.

---

# День 7 проекта — корзина

Статус: **завершён**.

## Итоговое состояние

Готово:

- создан тип `CartItem`;
- созданы `Cart` и `CartRow`;
- создан временный маршрут `/cart`;
- добавлены mock-позиции, чтобы проверять UI до появления общего cart context;
- работают `removeFromCart`, `increaseQuantity` и `decreaseQuantity`;
- уменьшение количества с `1` удаляет позицию;
- реализованы и проверены `addToCart` и `clearCart`;
- `totalCount` и `totalPrice` вычисляются через `reduce` и отображаются в `CartSummary`;
- добавлен empty state;
- прямых мутаций массива и объектов state нет.

Важно: настоящая общая корзина между каталогом, страницей товара и `/cart` появится на этапе `CartContext`. Пока `/cart` — локальная учебная реализация с mock-данными.

## Цель

Сделать корзину и прокачать immutable updates.

## Типы

```ts
export type CartItem = {
  product: Product;
  quantity: number;
};
```

## Что сделать

Функции:

- `addToCart(product)`
- `removeFromCart(productId)`
- `increaseQuantity(productId)`
- `decreaseQuantity(productId)`
- `clearCart()`

## Паттерны

Add:

```ts
setCartItems((prev) => [...prev, newItem]);
```

Update:

```ts
setCartItems((prev) =>
  prev.map((item) =>
    item.product.id === productId
      ? { ...item, quantity: item.quantity + 1 }
      : item,
  ),
);
```

Delete:

```ts
setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
```

## Derived data

```ts
const totalPrice = cartItems.reduce(...);
const totalCount = cartItems.reduce(...);
```

## Что тренируется

- immutable update
- spread
- map
- filter
- reduce
- derived state
- callbacks через props

## Вопросы для самопроверки

- Почему нельзя делать `cartItems.push()`?
- Почему нельзя делать `item.quantity++`?
- Почему totalPrice не надо хранить в state?
- Что делать, если quantity становится 0?

## Зачёт этапа

Этап зачтён, если корзина работает и нет прямых мутаций state.

---

# День 8 проекта — custom hook useCart

Статус: **завершён**.

## Цель

Вынести логику корзины в custom hook.

## Что сделать

Создать:

```ts
function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // functions

  return {
    cartItems,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    totalPrice,
    totalCount,
  };
}
```

## Что тренируется

- custom hooks
- инкапсуляция логики
- возвращаемый API hook
- derived values внутри hook

## Вопросы для самопроверки

- Почему это hook?
- Почему имя должно начинаться с `use`?
- Можно ли вызывать hook внутри условия?
- Что возвращает hook: JSX или данные/логику?

## Зачёт этапа

Этап зачтён, если компонент, владевший корзиной, стал чище, а логика корзины живёт в `useCart`.

---

# День 9 проекта — favorites + React.memo + useCallback

Статус: **завершён**.

## Цель

Понять связку `React.memo` и `useCallback`.

## Что сделать

1. Добавить favoriteIds:

```ts
const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
```

2. Создать `toggleFavorite(productId)`.

3. Добавить кнопку heart в `ProductCard`.

4. Обернуть `ProductCard` в `React.memo`.

5. Передавать handlers через `useCallback`.

## Пример

```ts
const handleToggleFavorite = useCallback((productId: number) => {
  setFavoriteIds((prev) =>
    prev.includes(productId)
      ? prev.filter((id) => id !== productId)
      : [...prev, productId],
  );
}, []);
```

## Что тренируется

- `React.memo`
- `useCallback`
- reference equality
- callbacks через props
- массив id вместо массива объектов

## Важная мысль

`React.memo` помогает пропустить ререндер дочернего компонента, если props поверхностно не изменились.

`useCallback` помогает сохранить стабильную ссылку на функцию.

## Вопросы для самопроверки

- Почему функция без `useCallback` создаётся заново на каждом рендере?
- Как это ломает пользу от `React.memo`?
- Почему `React.memo` не всегда нужен?
- Что лучше хранить в favorites: products или ids?

## Зачёт этапа

Этап зачтён, если ты можешь объяснить:

```txt
React.memo сравнивает props.
Функция — это prop.
Новая функция = новая ссылка.
useCallback сохраняет ссылку.
```

---

# День 10 проекта — useRef

Статус: **завершён**.

## Цель

Использовать `useRef` в реальных сценариях.

## Что сделать

Фокус на поиск:

```ts
const searchInputRef = useRef<HTMLInputElement | null>(null);

function focusSearch() {
  searchInputRef.current?.focus();
}
```

## Что тренируется

- DOM refs
- `.current`
- значение без ререндера
- focus

## Главное понимание

`useRef` хранит значение между рендерами, но изменение `.current` не вызывает ререндер.

## Вопросы для самопроверки

- Чем `useRef` отличается от `useState`?
- Почему изменение `.current` не ререндерит компонент?
- Когда useRef нужен для DOM?
- Когда useRef нужен не для DOM?

## Зачёт этапа

Этап зачтён, если поиск получает фокус через DOM ref и ты можешь объяснить разницу между `useRef` и `useState`.

---

# День 11 проекта — useDebounce custom hook

Статус: **завершён**.

## Цель

Сделать debounce для поиска.

## Что сделать

Создать hook для строкового значения поиска и использовать `useRef` для хранения timer id:

```ts
function useDebounce(value: string) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    timerRef.current = window.setTimeout(() => {
      setDebouncedValue(value);
    }, 500);

    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [value]);

  return debouncedValue;
}
```

Использовать:

```ts
const debouncedSearch = useDebounce(search);
```

И фильтровать по `debouncedSearch`.

## Что тренируется

- custom hook
- `useEffect`
- `useRef` для timer id
- cleanup
- timer
- dependencies

## Вопросы для самопроверки

- Почему нужен cleanup?
- Что будет, если не вызвать clearTimeout?
- Чем debounce отличается от throttle?

## Зачёт этапа

Этап зачтён, если поиск обновляется с задержкой, а ты можешь объяснить cleanup.

---

# День 12 проекта — useReducer

Статус: **завершён**.

## Цель

Понять `useReducer` на корзине.

## Когда useReducer уместен

`useReducer` полезен, когда:

- состояние сложное;
- много вариантов обновления;
- next state зависит от previous state;
- логика обновлений разрастается.

## Что сделать

Переписать корзину с `useState` на `useReducer`.

Actions:

```ts
type CartAction =
  | { type: "add"; product: Product }
  | { type: "remove"; productId: number }
  | { type: "increase"; productId: number }
  | { type: "decrease"; productId: number }
  | { type: "clear" };
```

Reducer:

```ts
function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case "add":
    // ...
    default:
      return state;
  }
}
```

## Что тренируется

- `useReducer`
- discriminated unions
- reducer pattern
- чистые функции
- сложный state

## Вопросы для самопроверки

- Чем `useReducer` отличается от `useState`?
- Когда `useReducer` лучше?
- Почему reducer должен быть pure function?
- Что такое discriminated union?

## Зачёт этапа

Этап зачтён, если корзина работает через reducer, а actions типизированы.

---

# День 13 проекта — Cart Context

Статус: **завершён**.

## Цель

Сделать состояние корзины общим для каталога, страницы товара и маршрута `/cart`.

## Что сделать

- CartContext
- CartProvider
- useCartContext
- существующий `useCart` как источник состояния и операций внутри provider
- подключение настоящей кнопки Add to cart на странице товара
- чтение той же корзины на маршруте `/cart`

В App Router сам `CartProvider` будет Client Component. Его можно подключить из серверного `layout.tsx`, передав `children`.

Provider нужно размещать настолько глубоко в дереве, насколько позволяет сценарий. Не надо превращать весь root layout в Client Component.

## Что тренируется

- `createContext`
- Provider
- custom hook для доступа к context
- проблема лишних ререндеров
- композиция Server Component layout и Client Component provider

## Важная проблема

Если в один context положить слишком много:

```ts
{
  (user, language, cart, filters, login, logout);
}
```

то изменение одной части может перерендерить много потребителей.

## Как улучшать

- разделять contexts;
- memoize value;
- не класть всё в один “global context”;
- использовать state manager, если state сложный.

## Вопросы для самопроверки

- Когда Context подходит?
- Почему Context не всегда замена Redux/Zustand?
- В чём проблема большого Context?
- Почему value лучше мемоизировать?
- Почему `layout.tsx` не обязан иметь `'use client'`, даже если он рендерит `CartProvider`?

## Зачёт этапа

Этап зачтён, если ты сделал Provider и можешь объяснить проблему лишних ререндеров.

---

# День 14 проекта — useId

Статус: **завершён**.

## Цель

Понять неочевидный, но полезный hook `useId`.

## Где использовать

Для связи label и input:

```tsx
const id = useId();

<label htmlFor={id}>Search</label>
<input id={id} />
```

## Что тренируется

- accessibility
- stable id
- forms
- label/input связь

## Важно

`useId` не нужен для `key` в списках.

Плохо:

```tsx
<ProductCard key={useId()} />
```

Нельзя так использовать.

## Вопросы для самопроверки

- Зачем нужен `useId`?
- Почему он полезен для accessibility?
- Почему его нельзя использовать вместо key в списках?

## Зачёт этапа

Этап зачтён, если формы имеют label/input связь через `useId`.

---

# День 15 проекта — useDeferredValue

## Цель

Познакомиться с менее очевидным hook для плавного UI.

## Сценарий

Есть search input и большой список товаров.

```ts
const deferredSearch = useDeferredValue(search);
```

Input остаётся отзывчивым, а тяжёлая фильтрация может немного отставать.

## Что тренируется

- concurrent rendering concept
- отзывчивый UI
- отличие от debounce

## Важно

`useDeferredValue` — не debounce.

Debounce ждёт паузу перед обновлением значения.

`useDeferredValue` позволяет React отложить менее приоритетное обновление.

## Вопросы для самопроверки

- Чем `useDeferredValue` отличается от debounce?
- Почему input может оставаться отзывчивым?
- В каких задачах это полезно?

## Зачёт этапа

Этап зачтён, если ты можешь объяснить разницу между debounce и deferred value.

---

# День 16 проекта — useTransition

## Цель

Познакомиться с `useTransition`.

## Сценарий

При изменении категории или сортировки обновление списка пометить как transition.

```ts
const [isPending, startTransition] = useTransition();

function handleCategoryChange(category: string) {
  startTransition(() => {
    setCategory(category);
  });
}
```

## Что тренируется

- low-priority updates
- `isPending`
- отличие срочных и несрочных обновлений

## Важно

Не надо использовать `useTransition` везде.

Он полезен, когда есть тяжёлое обновление UI, которое не должно блокировать ввод/клик.

## Вопросы для самопроверки

- Что делает `startTransition`?
- Чем transition отличается от обычного setState?
- Что показывает `isPending`?
- Когда hook лишний?

## Зачёт этапа

Этап зачтён, если ты сделал простой пример и можешь объяснить, зачем он нужен.

---

# День 17 проекта — useLayoutEffect

Статус: **завершён**.

Текущий результат:

- разобрано отличие от `useEffect`;
- сделано учебное измерение DOM для category chips;
- проверка переноса чипсов была построена через `ref`, `offsetTop` и `resize`;
- код не оставлен в продуктовой версии, потому что задача была учебной, а не реально нужной фичей.

## Цель

Понять отличие `useEffect` от `useLayoutEffect`.

## Сценарий

Измерить высоту элемента после рендера:

```ts
const cardRef = useRef<HTMLDivElement | null>(null);
const [height, setHeight] = useState(0);

useLayoutEffect(() => {
  if (!cardRef.current) return;

  setHeight(cardRef.current.getBoundingClientRect().height);
}, []);
```

## Важно

`useLayoutEffect` запускается синхронно после изменений DOM, но до отрисовки браузером.

Использовать редко:

- измерение DOM;
- предотвращение visual flicker;
- layout calculations.

## Вопросы для самопроверки

- Чем `useLayoutEffect` отличается от `useEffect`?
- Почему его не надо использовать везде?
- Когда он может быть полезен?

## Зачёт этапа

Этап зачтён, если ты сделал измерение DOM и можешь объяснить, почему обычный `useEffect` чаще предпочтительнее.

---

# День 18 проекта — useImperativeHandle + ref

Статус: **завершён**.

Текущий результат:

- `CatalogSearch` вынесен в отдельный компонент;
- внутри компонента настоящий `inputRef` остаётся приватной деталью;
- наружу через `useImperativeHandle` отдаётся ограниченный handle;
- `CatalogHeader` использует `searchRef.current?.focus()` вместо прямого доступа к DOM input;
- разобрано, что `clear()` имеет смысл как команда “очистить и вернуть фокус”, но нужна только если UI реально вызывает её.

## Цель

Познакомиться с редким, но полезным паттерном и учесть модель refs в React 19.

## Сценарий

Создать компонент SearchInput, у которого родитель может вызвать:

```ts
searchInputRef.current?.focus();
searchInputRef.current?.clear();
```

## Что тренируется

- `useImperativeHandle`
- controlled imperative API
- ref typing
- `ref` как prop в React 19

## Важно

Это редкий hook. Его не надо использовать часто.

Он нужен, когда дочерний компонент должен открыть наружу ограниченный imperative API.

В React 19 функциональный компонент может получать `ref` как prop. Для основного упражнения используем современный вариант. `forwardRef` стоит изучить отдельно, чтобы понимать кодовые базы на React 18 и старше, но не делать его обязательным шаблоном для нового кода этого проекта.

## Вопросы для самопроверки

- Зачем нужен `useImperativeHandle`?
- Почему это не основной способ общения компонентов?
- Чем это отличается от props callbacks?
- Зачем всё ещё нужно узнавать `forwardRef` в существующем коде?

## Зачёт этапа

Этап зачтён, если ты сделал `focus()` и `clear()` через ref.

---

# День 19 проекта — useSyncExternalStore

Статус: **текущий этап**.

## Цель

Познакомиться с hook для подписки на внешние store и одновременно добавить проекту полезное постоянное хранение данных в браузере.

День состоит из двух последовательных частей:

1. Favorites: `useSyncExternalStore` + `localStorage`.
2. Cart: существующие `useReducer` + Context + `localStorage`.

## Часть 1 — favorites как внешний store

Вынести состояние избранного из React-компонента во внешний store.

Store должен предоставлять:

- `getSnapshot()` для чтения текущего массива `favoriteIds`;
- `subscribe(listener)` для подписки React на изменения;
- действие переключения товара в избранном;
- `getServerSnapshot()` со стабильным начальным значением для серверного рендера и hydration;
- запись массива идентификаторов в `localStorage`;
- уведомление подписчиков в текущей вкладке после изменения;
- обработку события `storage` для синхронизации других вкладок.

Текущий `useFavorites` должен стать небольшим адаптером между React и внешним store: вызвать `useSyncExternalStore` и вернуть UI необходимые данные и действие.

Важно: `getSnapshot()` не должен создавать новый массив при каждом вызове. Пока данные не изменились, React должен получать тот же snapshot по ссылке.

## Часть 2 — persistence корзины

После завершения favorites добавить сохранение корзины в `localStorage`.

При этом не заменять рабочую архитектуру корзины внешним store:

- `useCart` продолжает управлять состоянием через `useReducer`;
- `CartProvider` продолжает раздавать корзину через Context;
- начальное состояние корзины восстанавливается из `localStorage` на клиенте;
- изменения корзины сохраняются в `localStorage`;
- после обновления страницы товары и их количество не пропадают.

Синхронизацию корзины между вкладками можно сделать дополнительным усложнением, но для зачёта достаточно корректного восстановления после перезагрузки.

## Важно

Это advanced hook. Для обычного приложения он редко нужен напрямую.

Но полезно знать:

> `useSyncExternalStore` нужен для безопасной подписки React-компонента на внешний источник данных.

В Next.js нужно отдельно понять `getServerSnapshot`: Client Components могут участвовать в серверном пререндеринге, где `window`, `navigator` и `localStorage` недоступны.

## Вопросы для самопроверки

- Что такое внешний store?
- Почему `localStorage` находится вне React?
- За что отвечают `subscribe`, `getSnapshot` и `getServerSnapshot`?
- Почему обычного useEffect иногда недостаточно?
- Где это используется на практике? Например, внутри state managers.
- Для чего нужен `getServerSnapshot`?
- Почему нельзя читать `localStorage` во время серверного рендера?
- Почему событие `storage` не уведомляет вкладку, которая сама выполнила запись?
- Почему для корзины сохраняется `useReducer`, а `useSyncExternalStore` используется только для favorites?

## Зачёт этапа

Этап зачтён, если:

- favorites переживают обновление страницы;
- изменение favorites в одной вкладке отображается в другой вкладке;
- UI получает favorites через `useSyncExternalStore`;
- snapshot остаётся стабильным, пока содержимое store не изменилось;
- серверный рендер не обращается к `window` или `localStorage`;
- корзина переживает обновление страницы;
- корзина по-прежнему управляется через `useReducer` и раздаётся через `CartContext`;
- ты можешь своими словами объяснить разницу между хранением данных в `localStorage` и подпиской React на внешний store.

---

# День 20 проекта — useOptimistic / optimistic UI concept

## Цель

Понять optimistic UI на примере лайка/избранного.

## Важно

В проекте установлен React 19, поэтому `useOptimistic` доступен.

Сначала полезно один раз реализовать optimistic update руками через `useState`, чтобы понять rollback. Затем повторить сценарий с `useOptimistic` и сравнить API.

Server Actions не обязательны для понимания концепции: можно использовать имитацию запроса или отдельную API-функцию. Не добавлять server action только ради названия hook.

## Сценарий

Нажал favorite:

1. UI сразу показывает heart filled.
2. Запрос на fake API отправился.
3. Если успех — оставляем.
4. Если ошибка — rollback.

## Что тренируется

- optimistic update
- rollback
- pending state
- double click protection
- реальный PR-review навык

## Вопросы для самопроверки

- Что такое optimistic update?
- Почему нужен rollback?
- Почему нужна защита от быстрых кликов?
- Как не дать счётчику уйти ниже 0?

## Зачёт этапа

Этап зачтён, если ты можешь объяснить optimistic update на примере лайка.

---

## Advanced-этап — возможности Platzi Fake Store

Этот этап не нужен для базовой тренировки hooks, но хорошо подходит после основной версии магазина.

Что можно попробовать:

- server-side pagination через `limit` и `offset`;
- server-side filters через `title`, `categorySlug`, `price_min`, `price_max`;
- страницу товара по `slug`, а не только по `id`;
- related products через `/products/:id/related`;
- JWT auth: login, profile, refresh token;
- users как учебный модуль для protected UI;
- сравнение REST и GraphQL подходов.

Важно: не добавлять auth, GraphQL и file upload раньше времени. Сначала каталог, фильтры, корзина и hooks.

---

# День 21 проекта — финальная упаковка

## Цель

Довести проект до состояния учебного showcase.

## Что сделать

- README;
- список hooks, которые использованы;
- скриншоты;
- деплой на Vercel;
- описание архитектуры;
- список изученных тем;
- “что бы улучшил дальше”.

## README структура

```md
# React Shop Lab

Учебный проект для тренировки React Hooks, TypeScript и работы с API.

## Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Platzi Fake Store API

## Features

- Products loading
- Search
- Filters
- Sorting
- Cart
- Favorites
- Loading/error/empty states
- Custom hooks
- Memoization
- AbortController
- Server and Client Components
- Dynamic product route

## Hooks practiced

- useState
- useEffect
- useRef
- useMemo
- useCallback
- useReducer
- useContext
- useId
- useDeferredValue
- useTransition
- useLayoutEffect
- useImperativeHandle
- useSyncExternalStore

## What I learned

...
```

Для title и description страниц использовать Metadata API App Router. `useDocumentTitle` можно оставить как отдельное упражнение на browser effect, но не делать его основным способом управления metadata в Next.js.

## Зачёт этапа

Этап зачтён, если проект можно показать и использовать как тренировочный материал для собеседования.

---

# Главные собеседовательные формулы

## useState

> `useState` хранит состояние компонента. При изменении state компонент ререндерится.

## useEffect

> `useEffect` нужен для синхронизации компонента с внешним миром: API, подписки, таймеры, DOM events.

## useRef

> `useRef` хранит значение между рендерами, но изменение `.current` не вызывает ререндер. Часто используется для DOM-ссылок, таймеров и mutable values.

## useMemo

> `useMemo` кеширует результат вычисления между рендерами, если зависимости не изменились. Он не предотвращает сам ререндер.

## useCallback

> `useCallback` сохраняет стабильную ссылку на функцию между рендерами, если зависимости не изменились.

## React.memo

> `React.memo` может пропустить повторный вызов дочернего компонента, если его props поверхностно не изменились.

## Derived state

> Derived state — это значение, которое можно вычислить из существующего state/props. Его лучше не хранить отдельно.

## Immutable update

> State нельзя мутировать напрямую. Нужно создавать новые массивы/объекты через spread, map, filter.

## key

> `key` нужен React для стабильной идентичности элемента в списке. В динамических списках лучше использовать id, а не index.

## Server Component

> Server Component выполняется на серверной стороне React-дерева и не отправляет свой компонентный JavaScript в браузер. Он подходит для server-side data access и не может использовать client hooks или browser APIs.

## Client Component

> Client Component объявляется границей `'use client'` и нужен для state, effects, event handlers и browser APIs. Директиву лучше ставить как можно ближе к интерактивному UI.

## Client fetch и Server fetch

> `useEffect` запускает запрос на клиенте после рендера и подходит для изучения lifecycle или данных, зависящих от browser environment. Server fetch позволяет получить данные до отправки UI и уменьшить клиентский JavaScript. Выбор зависит от требований, а не от привычки.

---

# Как работать с Codex/Cursor

Правила:

1. Не просить “напиши всё за меня”.
2. Просить roadmap.
3. Просить наводящие вопросы.
4. Просить объяснить ошибку.
5. Просить review твоего кода.
6. Просить не делать auto-edit.
7. Сначала писать самому.
8. После каждой задачи объяснять код словами.

Хороший prompt:

```txt
Я тренирую React live coding. Не пиши код за меня и не меняй файлы автоматически. Задавай наводящие вопросы, проверяй мой код, указывай на ошибки и проси меня объяснить решение. Готовое решение показывай только если я прямо попрошу.
```

---

# Критерии готовности после проекта

Ты готов использовать проект для собеседований, если можешь без подсказок объяснить:

- как загружаются товары;
- зачем нужен `useEffect`;
- как работает cleanup;
- что делает `AbortController`;
- где controlled inputs;
- где derived state;
- почему фильтр не хранится в state;
- где `useMemo`;
- почему `useMemo` не отменяет ререндер;
- где `useCallback`;
- зачем нужен `React.memo`;
- почему нельзя мутировать cart;
- почему key — id;
- что можно было бы улучшить;
- как бы ты заменил ручной fetch на React Query;
- как бы подключил настоящий backend;
- почему каталог сделан Client Component;
- где Server Component был бы уместнее;
- чем локальный loading state отличается от `loading.tsx`;
- почему provider не требует превращать root layout в Client Component.
