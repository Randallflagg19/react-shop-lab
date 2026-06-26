# InsForge Backend Roadmap

Статус: запланировано.

Цель: заменить нестабильный внешний product API на собственный backend на InsForge: база товаров, storage для изображений, стабильные URL, контролируемые категории и понятный fetch-слой в Next-приложении.

Основной React roadmap пока не трогаем. Этот документ — отдельный backend-трек после завершения дней 17-21.

## Почему это полезно

- Убрать битые картинки и случайные данные из внешнего API.
- Получить стабильную учебную базу товаров.
- Потрогать реальную связку Database + Storage + Frontend fetch.
- Не писать отдельный Nest.js backend раньше времени.
- Подготовить проект к более реалистичным performance-задачам на большем каталоге.

## Ограничения

- Не хранить API keys и admin keys в репозитории.
- Не начинать сразу со 100 товаров в приложении.
- Сначала пройти весь путь на 7 товарах.
- Бесплатной версии должно хватить для учебного каталога, если не заливать слишком тяжёлые изображения и не генерировать много AI-контента.

## Неделя 1. Ручная база на 7 товаров

### 1. Storage: закрепить текущий bucket

Уже сделано:

```txt
bucket: product-photos
files:
  coffee-cup.jpg
  game-controller.jpg
  gaming-headset.jpg
  laptop.jpg
  white-sneakers.jpg
  white-tshirt.jpg
  wooden-chair.jpg
```

Проверить:

- bucket публичный;
- URL открывается напрямую в браузере;
- картинка открывается без dashboard preview и без `blob:`.

Рабочий формат URL:

```txt
https://kmj65yri.eu-central.insforge.app/api/storage/buckets/product-photos/objects/coffee-cup.jpg
```

### 2. Database: создать таблицу products

Минимальные поля:

```txt
id
title
slug
price
description
category_name
category_slug
image_url
image_source
image_author
image_page_url
created_at
```

На старте можно заполнить руками 7 строк.

Важно:

- `slug` должен быть стабильным: `white-sneakers`, `coffee-cup`.
- `image_url` хранит прямой URL из Storage.
- `image_source`, `image_author`, `image_page_url` нужны для аккуратного attribution.

### 3. Создать первые товары

Стартовый набор:

```txt
White Sneakers
Gaming Headset
White T-Shirt
Wooden Chair
Coffee Cup
Laptop
Game Controller
```

Категории:

```txt
shoes
electronics
clothes
furniture
home
```

На этом этапе цель не идеальная продуктовая база, а проверка полного pipeline.

## Неделя 2. Подключение Next-приложения

### 4. Создать отдельный InsForge fetcher

Не смешивать старый API и новый.

Предпочтительное место:

```txt
src/entities/product/api/insforgeProducts.ts
```

Задача:

- получить список товаров из InsForge;
- привести ответ к текущему типу `Product`;
- оставить UI-компоненты без знания, откуда пришли данные.

### 5. Подменить источник данных

Текущие функции:

```txt
src/entities/product/api/products.ts
src/entities/product/api/productBySlug.ts
```

План:

- сначала сделать новый fetcher рядом;
- проверить его отдельно;
- потом заменить внутреннюю реализацию `fetchProducts` и `fetchProductBySlug`;
- не переписывать каталог, карточки и страницу товара.

### 6. Обработать несовпадение типов

Сейчас в приложении товар ожидается примерно как:

```txt
product.category.name
product.category.slug
```

В базе можно хранить плоские поля:

```txt
category_name
category_slug
```

Тогда fetcher должен маппить запись базы в UI-тип:

```txt
category_name/category_slug -> category: { name, slug }
image_url -> image
```

Это хороший учебный момент: API shape может отличаться от frontend model.

## Неделя 3. Расширение каталога

### 7. Добавить 30-50 товаров

Не руками через UI, если станет скучно.

Варианты:

- подготовить JSON-файл seed-данных;
- загрузить записи через InsForge API;
- добавить товары партиями по категориям.

Категории для расширения:

```txt
clothes
electronics
home
furniture
shoes
accessories
gaming
office
```

### 8. Навести порядок в изображениях

Для каждого товара:

- понятное имя файла;
- размер желательно до 300-800 KB;
- один image URL;
- источник и автор в базе.

Если изображения слишком тяжёлые:

- сначала оставить как есть;
- потом отдельной задачей сделать оптимизацию.

### 9. Проверить UI на большом каталоге

С 50+ товарами проверить:

- поиск;
- сортировку;
- фильтрацию по категориям;
- `useDebounce`;
- `useTransition`;
- memoization карточек;
- layout shift от изображений;
- скорость первой загрузки.

## Неделя 4. Улучшение backend-слоя

### 10. Добавить типы для database rows

Развести два типа:

```txt
ProductRow - как данные лежат в базе
Product - как данные нужны UI
```

Это уменьшит путаницу между backend shape и frontend model.

### 11. Добавить env-переменные

Не хардкодить домен и ключи в коде.

Примерно:

```txt
NEXT_PUBLIC_INSFORGE_BASE_URL
NEXT_PUBLIC_INSFORGE_ANON_KEY
```

Важно:

- admin key не использовать в браузере;
- публичный anon key можно использовать только если InsForge docs явно говорят, что он безопасен для frontend;
- секреты не коммитить.

### 12. Добавить loading/error диагностику

Для fetch-слоя:

- понятная ошибка, если InsForge недоступен;
- отдельная ошибка, если schema изменилась;
- fallback-текст в UI.

## Что не делать пока

- Не писать Nest.js только ради products API.
- Не делать авторизацию до стабильного каталога.
- Не делать корзину в базе до понимания auth/user flow.
- Не переносить favorites в backend прямо сейчас.
- Не автоматизировать 100 товаров до успешных 7.

## Definition of Done

Backend-трек можно считать закрытым, когда:

- товары берутся из InsForge Database;
- картинки берутся из InsForge Storage;
- `/` показывает стабильный каталог без битых внешних картинок;
- `/products/[slug]` открывает товар из InsForge;
- текущий UI не знает про внутреннее устройство InsForge;
- старый внешний product API больше не используется;
- есть минимум 30-50 стабильных товаров.

