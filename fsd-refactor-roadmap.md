# FSD refactor roadmap

Документ фиксирует текущие нарушения Feature-Sliced Design в проекте и предлагает отдельный roadmap для постепенного выравнивания архитектуры.

Цель не в том, чтобы срочно "идеально разложить папки", а в том, чтобы убрать реальные зависимости не в ту сторону и сделать границы понятнее перед ростом проекта.

## Текущая FSD-карта проекта

Сейчас проект примерно использует такие слои:

```txt
app
features
entities
shared
```

В классическом FSD направление зависимостей должно быть сверху вниз:

```txt
app -> pages/widgets -> features -> entities -> shared
```

Нижний слой не должен импортировать верхний. Например, `entities` не должен знать про `features`, а `shared` не должен знать про `entities`.

## Главные нарушения сейчас

### 1. Entity product знает про feature cart

Файл:

```txt
src/entities/product/ui/AddProductButton.tsx
```

Сейчас:

```txt
entities/product/ui/AddProductButton.tsx -> features/cart/model/CartContext
```

Почему это нарушение:

- `entities/product` должен описывать товар как доменную сущность;
- добавление товара в корзину — это пользовательское действие, то есть feature;
- entity не должна импортировать feature.

Что сделать:

```txt
src/features/cart/ui/AddToCartButton.tsx
```

Перенести кнопку добавления в корзину в feature cart. Она может принимать `product: Product`, потому что feature имеет право зависеть от entity.

После переноса:

```txt
features/cart/ui/AddToCartButton.tsx -> entities/product/model/types
features/cart/ui/AddToCartButton.tsx -> features/cart/model/CartContext
```

Это направление корректное.

Открытый вопрос:

- `ProductDetails` сейчас находится в `entities/product/ui` и рендерит кнопку добавления в корзину.
- Если `ProductDetails` импортирует `AddToCartButton` из `features/cart`, нарушение останется, только на другом файле.

Более чистое решение:

```txt
entities/product/ui/ProductDetails.tsx
```

должен быть чистым UI товара и принимать слот/проп для actions:

```txt
actions?: React.ReactNode
```

А композицию делать выше, например в route/page-level component:

```txt
app/products/[slug]/page.tsx
  ProductDetails
    actions = <AddToCartButton product={product} />
```

Если не хочется усложнять прямо сейчас, можно временно оставить нарушение, но важно понимать его.

### 2. Shared api импортирует entity product

Файлы:

```txt
src/shared/api/products.ts
src/shared/api/productBySlug.ts
```

Сейчас:

```txt
shared/api -> entities/product/model/types
```

Почему это нарушение:

- `shared` — самый нижний слой;
- он не должен знать про `entities`;
- API конкретного товара не является универсальным shared-кодом.

Что сделать:

Перенести product-specific API в entity product:

```txt
src/entities/product/api/products.ts
src/entities/product/api/productBySlug.ts
```

И тогда зависимости станут такими:

```txt
entities/product/api -> entities/product/model/types
features/products-catalog/model/useProducts.ts -> entities/product/api/products
app/products/[slug]/page.tsx -> entities/product/api/productBySlug
```

Это корректно: feature и app могут импортировать entity.

Что оставить в `shared/api`:

- базовый fetcher;
- base URL;
- общие HTTP helpers;
- общие error helpers.

Например позже:

```txt
src/shared/api/client.ts
src/shared/api/config.ts
```

### 3. Favorite логика живёт внутри products-catalog, но протекает в entity card

Файлы:

```txt
src/features/products-catalog/ui/ProductsCatalog.tsx
src/entities/product/ui/ProductCardList.tsx
src/entities/product/ui/ProductCard.tsx
```

Сейчас `ProductsCatalog` хранит:

```txt
favoriteIds
toggleFavorite
```

и передаёт их в `ProductCardList` / `ProductCard`.

Почему это спорно:

- избранное — отдельное пользовательское действие;
- карточка товара как entity начинает знать про favorite state и кнопку favorite;
- если favorite будет использоваться не только в каталоге, его придётся вытаскивать из `products-catalog`.

Что сделать позже:

Создать отдельную feature:

```txt
src/features/favorites/model/useFavorites.ts
src/features/favorites/ui/FavoriteButton.tsx
```

А `ProductCard` сделать более чистым:

Вариант A:

```txt
ProductCard принимает actionSlot / topRightSlot
```

Вариант B:

```txt
features/products-catalog/ui/ProductCatalogCard.tsx
```

композирует:

```txt
ProductCard + FavoriteButton
```

Для учебного проекта лучше начать с варианта B, потому что он нагляднее.

### 4. ProductCardList лежит в entity, но является списком каталога

Файл:

```txt
src/entities/product/ui/ProductCardList.tsx
```

Почему это спорно:

- entity может иметь маленькие UI-блоки сущности: `ProductCard`, `ProductTitle`, `ProductPrice`;
- список товаров с layout grid ближе к catalog feature или widget;
- сейчас `ProductCardList` ещё и знает про favorite props.

Что сделать:

Перенести список в catalog feature:

```txt
src/features/products-catalog/ui/ProductCardList.tsx
```

или назвать точнее:

```txt
src/features/products-catalog/ui/CatalogProductList.tsx
```

`ProductCard` можно оставить в entity, если он станет чистой карточкой товара без favorite feature.

### 5. Глобальный CSS содержит стили всех слоёв

Файл:

```txt
src/app/globals.css
```

Сейчас там лежат стили:

- page layout;
- product card;
- product details;
- catalog header/meta;
- cart;
- cart row;
- cart summary.

Почему это неидеально:

- app-level файл знает о class names всех features/entities;
- сложнее удалять и переносить компоненты;
- растёт риск случайно сломать чужой блок.

Что сделать позже:

Минимальный FSD-friendly шаг:

```txt
src/entities/product/ui/product.css
src/features/products-catalog/ui/products-catalog.css
src/features/cart/ui/cart.css
```

И импортировать CSS там, где компонент/feature подключается.

Но это не первый приоритет. Сейчас важнее исправить зависимости слоёв.

## Предлагаемый порядок рефакторинга

### Этап 1. Убрать shared -> entities

Цель:

```txt
shared не импортирует entities
```

Действия:

1. Создать `src/entities/product/api/`.
2. Перенести туда `products.ts` и `productBySlug.ts`.
3. Обновить импорты в:
   - `src/features/products-catalog/model/useProducts.ts`
   - `src/app/products/[slug]/page.tsx`
4. Оставить `shared/api` пустым или подготовить под общий HTTP client позже.

Почему первым:

- это самое чистое и простое нарушение направления слоёв;
- мало UI-рисков;
- хорошо закрепляет правило "shared не знает домен".

### Этап 2. Вынести AddToCartButton из entity product

Цель:

```txt
entities/product не импортирует features/cart
```

Действия:

1. Создать `src/features/cart/ui/AddToCartButton.tsx`.
2. Перенести туда текущую кнопку добавления товара.
3. Сделать `ProductDetails` чистым:
   - либо принимает `actions?: React.ReactNode`;
   - либо вообще не содержит cart-specific UI.
4. Скомпоновать `ProductDetails` и `AddToCartButton` выше, на уровне route/page или отдельного feature/widget.

Учебный компромисс:

- если slot `actions` пока кажется слишком абстрактным, можно временно оставить `ProductDetails` как есть и просто записать это как долг;
- но для хорошего FSD это ключевой перенос.

### Этап 3. Разделить product card и favorite feature

Цель:

```txt
ProductCard показывает товар.
FavoriteButton отвечает за избранное.
CatalogProductCard композирует их.
```

Действия:

1. Создать `src/features/favorites/`.
2. Перенести `favoriteIds` и `toggleFavorite` в `useFavorites`.
3. Создать `FavoriteButton`.
4. Убрать favorite-specific props из entity `ProductCard`.
5. В catalog feature создать компонент-композицию для карточки каталога.

### Этап 4. Перенести ProductCardList в catalog feature

Цель:

```txt
entity product не отвечает за layout списка каталога
```

Действия:

1. Перенести `ProductCardList` в `features/products-catalog/ui`.
2. Переименовать в `CatalogProductList`.
3. Оставить `ProductCard` в `entities/product/ui`, если он чистый.

### Этап 5. Разобрать globals.css

Цель:

```txt
app/globals.css содержит только reset, tokens, body/page base styles.
feature/entity styles живут ближе к компонентам.
```

Действия:

1. Оставить в `globals.css`:
   - CSS variables;
   - box-sizing;
   - html/body;
   - page-level базу.
2. Вынести product styles ближе к `entities/product`.
3. Вынести catalog styles ближе к `features/products-catalog`.
4. Вынести cart styles ближе к `features/cart`.

## Что не обязательно исправлять прямо сейчас

### Cart зависит от Product

Файлы:

```txt
src/features/cart/model/types.ts
src/features/cart/model/useCart.ts
```

Сейчас cart использует `Product`.

Это нормально:

```txt
features/cart -> entities/product
```

Feature может зависеть от entity.

Позже можно обсудить, стоит ли хранить в корзине весь `Product` или только snapshot:

```txt
productId
title
price
image
```

Но это уже не FSD-нарушение, а вопрос модели данных.

### app/providers.tsx импортирует CartProvider

Это нормально:

```txt
app -> features/cart
```

`app` собирает провайдеры и композицию приложения.

### ProductsCatalog импортирует ProductCard

Это нормально:

```txt
features/products-catalog -> entities/product
```

Feature может использовать entity UI.

## Целевая структура после refactor

Один из возможных вариантов:

```txt
src/
  app/
    providers.tsx
    layout.tsx
    page.tsx
    cart/
      page.tsx
    products/
      [slug]/
        page.tsx

  shared/
    api/
      client.ts
      config.ts
    ui/

  entities/
    product/
      api/
        products.ts
        productBySlug.ts
      model/
        types.ts
        getProductImageSrc.ts
      ui/
        ProductCard.tsx
        ProductDetails.tsx

  features/
    products-catalog/
      model/
        types.ts
        useProducts.ts
        useDebounce.ts
      ui/
        ProductsCatalog.tsx
        CatalogHeader.tsx
        CatalogMeta.tsx
        CatalogProductList.tsx
        CatalogProductCard.tsx

    cart/
      model/
        types.ts
        useCart.ts
        CartContext.tsx
      ui/
        AddToCartButton.tsx
        Cart.tsx
        CartRow.tsx
        CartSummary.tsx

    favorites/
      model/
        useFavorites.ts
      ui/
        FavoriteButton.tsx
```

## Критерии готовности FSD-refactor

Рефакторинг можно считать успешным, если:

- `shared` не импортирует `entities`, `features` или `app`;
- `entities` не импортируют `features` или `app`;
- feature-specific actions вроде add to cart и favorite лежат в `features`;
- entity UI можно использовать без знания о корзине, избранном и каталоге;
- route/page-level код занимается композицией, а не бизнес-логикой;
- глобальный CSS больше не является единственным местом для всех стилей проекта.
