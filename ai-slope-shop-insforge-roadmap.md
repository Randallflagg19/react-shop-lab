# AI Slop Shop: InsForge Backend Roadmap

Статус: backend-миграция в основном завершена, идёт финальная очистка и проверка production deployment.

Текущий следующий шаг: **добавить локальную fallback-картинку для недоступных товаров, завершить cleanup старого API и проверить новый deployment на Vercel**.

Цель: заменить нестабильный Platzi Fake Store API собственным контролируемым backend на InsForge, не создавая отдельное Nest.js-приложение только ради каталога.

Проект InsForge:

```txt
project id: de3e7b2e-02e0-46d6-a27e-b6fa066b0181
base URL: https://kmj65yri.eu-central.insforge.app
bucket: product-photos
```

## Почему бесплатного плана достаточно

По состоянию на 28 июня 2026 года Free включает:

- 500 MB базы данных;
- 1 GB файлового Storage;
- 5 GB bandwidth;
- 50 000 monthly active users;
- 100 000 вызовов edge functions.

Free-проект приостанавливается после недели неактивности. Для учебного showcase это допустимо, но перед демонстрацией проект нужно открыть и проверить.

47 изображений даже по 2 MB занимают около 94 MB, поэтому сам каталог уверенно помещается в лимит 1 GB. Фактические JPEG-файлы уже оптимизированы достаточно для текущего учебного каталога.

Актуальные лимиты: https://insforge.dev/pricing

## Разделение работы

### Что выгодно сделать руками

- отобрать и переименовать изображения;
- разложить товары по категориям;
- заполнить manifest с названиями, ценами и описаниями;
- загрузить файлы через Dashboard;
- создать schema через SQL Editor;
- проверить несколько записей в Database;
- проверить публичный URL каждого проблемного файла;
- проверить usage в Dashboard.

### Где агент действительно экономит время

- превратить готовый manifest в один seed SQL;
- проверить уникальность slug и image key;
- написать типы `ProductRow` и mapper;
- подключить SDK без утечки admin credentials;
- заменить существующие fetch-функции;
- диагностировать CORS, RLS или несовпадение schema.

Не стоит тратить AI-токены на 47 отдельных загрузок или придумывание данных по одной строке в диалоге. Сначала готовится один структурированный manifest, затем выполняется одна пакетная операция.

## Этап 1. Подготовить изображения локально — завершён

### 1.1. Инвентаризация

Для каждого из 47 файлов определить:

- рабочее название товара;
- slug;
- категорию;
- итоговое имя файла;
- ориентацию и разрешение;
- примерный размер.

Формат имени:

```txt
storm-cloud-pillow.webp
moonlight-reading-lamp.webp
floating-tea-set.webp
```

Правила:

- только нижний регистр;
- слова разделены дефисами;
- без пробелов и случайных номеров;
- имя файла связано со slug товара;
- расширение соответствует реальному формату.

### 1.2. Оптимизация

- Не увеличивать маленькие исходники искусственно.
- Уменьшить чрезмерно большие изображения до разумного web-размера.
- Предпочесть WebP или качественно сжатый JPEG.
- Сохранить оригиналы отдельно от оптимизированной папки загрузки.
- Визуально проверить 3-5 самых сильно сжатых файлов.

### 1.3. Manifest

Создать локальный CSV или JSON, одна строка на товар:

```txt
title,slug,price,description,category_slug,image_key,image_url
```

Фактический воспроизводимый seed:

```txt
data/products.seed.sql
```

Manifest становится главным источником для seed. База и имена файлов должны следовать ему, а не существовать в трёх разных несогласованных списках.

### Зачёт этапа

- Есть ровно 47 подготовленных файлов.
- Есть ровно 47 записей в seed.
- Все slug уникальны.
- Все `image_key` уникальны и совпадают с именами файлов.

## Этап 2. Загрузить Storage руками — завершён

### Действия в Dashboard

1. Открыть `Storage`.
2. Выбрать существующий bucket `product-photos`.
3. Убедиться, что bucket public.
4. Загрузить подготовленные 47 изображений.
5. Проверить список файлов и размеры.
6. Открыть несколько файлов через глаз и затем через прямой URL.

Канонический публичный URL сейчас имеет вид:

```txt
https://kmj65yri.eu-central.insforge.app/api/storage/buckets/product-photos/objects/{image_key}
```

Пример:

```txt
https://kmj65yri.eu-central.insforge.app/api/storage/buckets/product-photos/objects/storm-cloud-pillow.webp
```

Не сохранять `blob:` URL из preview Dashboard: он временный и работает только в текущем браузерном контексте.

### Что хранится в базе

Для текущего проекта сохраняются и стабильный `image_key`, и готовый публичный `image_url`:

```txt
image_key: storm-cloud-pillow.jpg
image_url: https://kmj65yri.eu-central.insforge.app/api/storage/buckets/product-photos/objects/storm-cloud-pillow.jpg
```

`image_key` нужен для управления объектом Storage, а `image_url` упрощает чтение каталога на frontend. Если домен или bucket изменятся, URL можно пакетно обновить из `image_key`.

### Зачёт этапа

- Все 47 файлов видны в bucket.
- Выборочная проверка прямых URL проходит без авторизации.
- Нет дубликатов, пробелов и `blob:` URL.

## Этап 3. Создать простую правильную schema — завершён

Для текущего проекта достаточно двух таблиц: `categories` и `products`.

### Таблица categories

```txt
id          bigint identity primary key
name        text not null
slug        text not null unique
created_at  timestamptz not null default now()
```

Пример категорий:

```txt
clothing
footwear
accessories
interior
furniture
kitchenware
electronics
```

Не создавать 20 категорий ради 47 товаров. Текущих семи категорий достаточно.

### Таблица products

```txt
id            bigint identity primary key
title         text not null
slug          text not null unique
description   text not null
price         numeric(10,2) not null
category_id   bigint not null references categories(id)
image_key     text not null unique
image_url     text not null
created_at    timestamptz not null default now()
```

Ограничения:

- `price >= 0`;
- `slug` уникален;
- `image_key` уникален;
- `category_id` обязан указывать на существующую категорию.

### Почему не одна плоская таблица

Отдельная `categories` защищает от вариантов вроде `Electronic`, `electronics` и `electronics123`. При этом две таблицы ещё не превращают учебный магазин в корпоративную ERP.

### Что пока не нужно

- таблица изображений, пока у товара ровно одно главное изображение;
- inventory и склад;
- variants, sizes и colors;
- orders и payments;
- reviews;
- user favorites;
- embeddings и vector search.

### Зачёт этапа

- Обе таблицы созданы.
- Constraints работают.
- Несуществующий `category_id` и повторный slug отклоняются.

## Этап 4. Настроить безопасное публичное чтение — чтение работает, права записи нужно перепроверить

Каталог публичный, поэтому неавторизованный frontend должен иметь право только читать опубликованные товары и категории.

Нужно проверить в InsForge:

- получен anon key;
- anon может выполнять `SELECT` для `categories` и опубликованных `products`;
- anon не может выполнять `INSERT`, `UPDATE` и `DELETE`;
- admin/API key не попадает в браузер и репозиторий.

Документация InsForge прямо указывает, что anon key является публичным идентификатором, который можно включать во frontend bundle; реальной границей безопасности остаются права/RLS.

На этапе реализации не угадывать policy-синтаксис. Свериться с текущей Database/RLS документацией или настройками Dashboard, затем проверить доступ реальным анонимным запросом.

### Зачёт этапа

- Без admin session каталог читается.
- Попытка публичной записи отклоняется.
- В git нет секретного API/admin key.

## Этап 5. Заполнить базу без 47 ручных INSERT — завершён

### Рекомендуемый процесс

1. Руками создать и проверить 3 товара.
2. Убедиться, что категории, цены и image URL отображаются правильно.
3. Из готового manifest сформировать один seed SQL.
4. Просмотреть SQL глазами.
5. Выполнить его один раз в SQL Editor.
6. Сравнить количество строк с manifest.

Это хороший компромисс: schema и первая запись сделаны осознанно руками, а остальные товары добавлены одним проверяемым seed SQL.

### Проверки данных

- `products count = 47`;
- каждый товар имеет существующую категорию;
- нет пустых title, slug, description и image key;
- цены положительные;
- все опубликованные товары имеют доступное изображение;
- порядок выдачи стабилизирован сортировкой по `id`.

### Зачёт этапа

- В Database ровно 47 корректных товаров.
- Любые 5 случайных строк открывают правильные изображения.
- Повторный запуск seed не создаёт молча дубликаты.

## Этап 6. Подключить InsForge SDK к Next.js — завершён

Официальный пакет:

```bash
npm install @insforge/sdk@latest
```

Документация: https://docs.insforge.dev/sdks/typescript/overview

Next.js guide: https://docs.insforge.dev/examples/framework-guides/nextjs

### Env

```txt
NEXT_PUBLIC_INSFORGE_URL=https://kmj65yri.eu-central.insforge.app
NEXT_PUBLIC_INSFORGE_ANON_KEY=...
```

Добавить значения локально и в Vercel. Admin key не использовать в этих переменных.

### Размещение кода

```txt
src/shared/api/insforge.ts
src/entities/product/api/insforgeProducts.ts
src/entities/product/api/productMapper.ts
src/entities/product/api/types.ts
```

- `shared/api` создаёт общий SDK client.
- `entities/product/api` знает таблицы и запросы товаров.
- mapper преобразует database row в существующий frontend `Product`.
- UI не импортирует InsForge SDK напрямую.

### Типы

Развести:

```txt
ProductRow  - форма записи из InsForge
Product     - форма, удобная текущему UI
```

Маппинг:

```txt
category row -> category: { id, name, slug, image }
image_url    -> images: [image_url]
created_at   -> creationAt
created_at   -> updatedAt (временно, пока отдельного updated_at нет)
```

Поле `category.image` в текущем frontend type можно временно заполнять пустой строкой или позже удалить как неиспользуемое.

### Зачёт этапа

- Новый fetcher получает 47 товаров.
- Mapper возвращает текущий тип `Product`.
- UI не зависит напрямую от формы database row.

## Этап 7. Переключить маршруты на InsForge — почти завершён

Порядок переключения:

1. Каталог `/`.
2. Поиск, категории и сортировка.
3. Страница `/products/[slug]`.
4. Корзина с товарами InsForge.
5. Favorites с новыми числовыми `id`.
6. Vercel deployment.

Не переписывать компоненты каталога только из-за нового backend. Меняется API-слой и mapper, а не вся UI-архитектура.

После успешной проверки:

- удалить обращения к `api.escuelajs.co`;
- удалить старые allowlist-условия изображений;
- обновить README и metadata;
- при использовании оптимизации `next/image` разрешить только точный InsForge host, а не широкий wildcard;
- оставить runtime fallback для реально недоступного файла.

Текущее состояние:

- каталог и детальная страница читают данные через InsForge SDK;
- 47 товаров, категории и изображения отображаются корректно;
- точный InsForge Storage path оставлен в `next.config.ts` и runtime allowlist;
- старые image-host allowlist удалены;
- metadata и видимое имя изменены на `AI Slop Shop`;
- env добавлены локально и в Vercel;
- production build проходит;
- старые закомментированные реализации Platzi API ещё нужно удалить;
- `README` ещё нужно обновить;
- локального файла `public/placeholder-product.svg` пока нет.

### Ближайшая задача: fallback-картинка

Подготовить одну локальную нейтральную заглушку `public/placeholder-product.svg` или `public/placeholder-product.webp`. Она должна:

- сохранять стабильную квадратную область карточки;
- не притворяться настоящим товаром;
- сочетаться с тёмным интерфейсом и белым фоном продуктовых изображений;
- показываться, если URL отсутствует, не соответствует разрешённому Storage path или изображение не удалось загрузить;
- не создавать повторный 404.

После добавления проверить fallback в карточке и на детальной странице, временно передав несуществующий image URL.

### Зачёт этапа

- В Network нет запросов к Platzi API.
- `/` показывает ровно 47 товаров из InsForge.
- Детальная страница находится по slug.
- После reload cart и favorites продолжают работать.
- Production build и Vercel deployment проходят.

## Этап 8. Наблюдение за бесплатными лимитами

Раз в несколько дней разработки проверять:

- Storage usage;
- Database size;
- bandwidth;
- ошибки запросов;
- не приостановлен ли проект из-за неактивности.

Не покупать Pro заранее. Сначала получить работающий каталог и посмотреть реальное потребление. Для 47 товаров Free должен быть достаточен; платный план имеет смысл только при реальном трафике, необходимости избежать паузы или выходе за лимиты.

## Этап 9. Infinite scroll, позже

После стабильного каталога можно заменить запрос всех товаров на порции.

Backend должен поддерживать:

- стабильную сортировку по `id`; отдельный `sort_order` можно добавить позже для ручного порядка витрины;
- `limit/range` или эквивалентную пагинацию SDK;
- одинаковые filters для каждой следующей порции;
- признак окончания списка.

На 47 товарах сначала оставить один запрос. Infinite scroll внедрять как отдельную frontend/backend задачу, не смешивая её с первой миграцией данных.

## Что сознательно отложено

- Authentication.
- Серверные favorites.
- Серверная cart.
- Orders и checkout.
- Realtime.
- Edge Functions.
- AI generation через InsForge.
- Несколько изображений на товар.
- Admin panel магазина.

Эти возможности не нужны, чтобы доказать, что Database + Storage + Next.js уже работают как цельный backend.

## Definition of Done

Backend-миграция завершена, когда:

- 47 оптимизированных изображений лежат в public bucket;
- Database содержит 47 валидных товаров и нормальные категории;
- публичный anon доступ разрешает чтение и запрещает запись;
- приложение использует официальный InsForge SDK;
- `ProductRow` отделён от frontend `Product`;
- каталог и страница товара работают из InsForge;
- старый Platzi API полностью удалён;
- секретные ключи не попали в клиент или git;
- Vercel использует нужные env-переменные;
- Free usage остаётся в пределах лимитов;
- README описывает новый backend и источник изображений.

## Официальные ссылки

- Pricing: https://insforge.dev/pricing
- TypeScript SDK: https://docs.insforge.dev/sdks/typescript/overview
- Database SDK: https://docs.insforge.dev/sdks/typescript/database
- Storage SDK: https://docs.insforge.dev/sdks/typescript/storage
- Next.js guide: https://docs.insforge.dev/examples/framework-guides/nextjs
- Storage and S3 compatibility: https://docs.insforge.dev/core-concepts/storage/s3-compatibility
