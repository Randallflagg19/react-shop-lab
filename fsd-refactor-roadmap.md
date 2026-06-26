# FSD refactor roadmap

Статус: **завершён**.

Документ фиксирует пройденный Feature-Sliced Design рефакторинг: какие нарушения были найдены, как они были исправлены и что можно улучшать позже.

Цель была не в том, чтобы "идеально разложить папки", а в том, чтобы убрать реальные зависимости не в ту сторону и сделать границы понятнее перед ростом проекта.

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

## Что исправлено

### 1. Entity product больше не знает про feature cart

Было:

```txt
src/entities/product/ui/AddProductButton.tsx
entities/product/ui/AddProductButton.tsx -> features/cart/model/CartContext
```

Сделано:

```txt
src/features/cart/ui/AddToCartButton.tsx
src/entities/product/ui/ProductDetails.tsx
```

Теперь `AddToCartButton` живёт в `features/cart`, а `ProductDetails` не импортирует cart feature. `ProductDetails` принимает `actions?: React.ReactNode`, а композиция выполняется на уровне route:

```txt
app/products/[slug]/page.tsx
  ProductDetails
    actions = <AddToCartButton product={product} />
```

Итоговое направление зависимостей корректное:

```txt
app -> entities/product
app -> features/cart
features/cart -> entities/product
```

### 2. Product API перенесён из shared в entity

Было:

```txt
src/shared/api/products.ts
src/shared/api/productBySlug.ts
shared/api -> entities/product/model/types
```

Сделано:

```txt
src/entities/product/api/products.ts
src/entities/product/api/productBySlug.ts
```

Теперь product-specific API живёт внутри product slice, а импорты идут сверху вниз:

```txt
entities/product/api -> entities/product/model/types
features/products-catalog/model/useProducts.ts -> entities/product/api/products
app/products/[slug]/page.tsx -> entities/product/api/productBySlug
```

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

### 3. Favorites вынесены в отдельную feature

Было:

```txt
favoriteIds
toggleFavorite
передавались через ProductCardList / ProductCard
```

Сделано:

```txt
src/features/favorites/model/useFavorites.ts
src/features/favorites/ui/FavoriteButton.tsx
```

`ProductCard` больше не принимает favorite-specific props. Он принимает `topRightSlot?: React.ReactNode`, а `CatalogProductList` компонует карточку с `FavoriteButton`.

```txt
features/products-catalog/ui/CatalogProductList.tsx
  ProductCard topRightSlot = <FavoriteButton />
```

### 4. ProductCardList перенесён из entity в catalog feature

Было:

```txt
src/entities/product/ui/ProductCardList.tsx
```

Сделано:

```txt
src/features/products-catalog/ui/CatalogProductList.tsx
```

Теперь entity `ProductCard` остаётся чистой карточкой товара, а layout списка каталога живёт внутри `features/products-catalog`.

### 5. Компонентные стили вынесены из globals.css

Было:

```txt
src/app/globals.css
- product card;
- product details;
- catalog header/meta;
- cart;
- cart row;
- cart summary.
```

Сделано:

```txt
Компонентные стили перенесены в Tailwind className внутри компонентов.
```

В `globals.css` остались только:

```txt
Tailwind import
CSS variables
box-sizing
html/body
page layout utility
```

## Что можно улучшить позже

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
