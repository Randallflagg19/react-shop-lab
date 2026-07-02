-- Re-runnable seed for the second batch of 8 AI Slop Shop products.
-- Requires the categories table and the uploaded product-photos objects.

with seed (title, slug, description, price, category_slug) as (
  values
    (
      'Накидка из утренней травы',
      'morning-grass-dew-cape',
      'Лёгкая зелёная накидка, будто сплетённая из свежей утренней травы. Росные капли по вороту выглядят как прозрачное ожерелье, превращая вещь в живой лесной аксессуар для тех, кто хочет носить на себе первое утро после дождя.',
      139.90,
      'clothing'
    ),
    (
      'Очки из чешуи зеркального карпа',
      'mirror-carp-scale-glasses',
      'Очки с переливающейся оправой из чешуи зеркального карпа — тонкие, блестящие и почти ювелирные. Они выглядят так, будто их нашли в сундуке речного короля, и сразу добавляют образу странную водяную роскошь.',
      89.90,
      'accessories'
    ),
    (
      'Фасетчатые светильники «Глаза стрекозы»',
      'dragonfly-eye-faceted-lamps',
      'Пара светильников с фасетчатыми плафонами, похожими на огромные глаза стрекозы. Мозаичные грани ловят свет зелёными, бирюзовыми и золотыми бликами, превращая обычную подсветку в насекомо-футуристический интерьерный акцент.',
      179.90,
      'interior'
    ),
    (
      'Зонт-шляпа «Бледнопоганчатый»',
      'pale-toadstool-umbrella-hat',
      'Зонт-шляпа в форме бледной поганки — абсурдный, нежный и удивительно элегантный аксессуар. Он выглядит как грибной купол из сказочного леса и идеально подходит тем, кто хочет защититься от дождя с видом редкого лесного существа.',
      79.90,
      'accessories'
    ),
    (
      'Чалма из тончайшего осиногнездного материала',
      'wasp-nest-turban',
      'Чалма из тончайшего материала, похожего на бумажные слои осиного гнезда. Лёгкая фактура, природный узор и скульптурная форма делают её необычным головным убором для тех, кто любит вещи на грани моды, природы и странного искусства.',
      84.90,
      'accessories'
    ),
    (
      'Охладительная камера «Жимолость»',
      'honeysuckle-cooling-chamber',
      'Мини-охладительная камера с цветочным корпусом, вдохновлённым жимолостью. Внутри — прохладительные напитки, ягоды и тёмно-синие плоды жимолости; снаружи — мягкие зелёные и кремовые оттенки, будто техника выросла в саду, а не сошла с конвейера.',
      249.90,
      'electronics'
    ),
    (
      'Костыли «Подъёмный кран»',
      'lifting-crane-crutches',
      'Пара симметричных костылей в стиле строительных подъёмных кранов. Жёлто-чёрная индустриальная рама, быстрый механизм регулировки высоты и прочный вид делают их не просто опорой, а инженерным аксессуаром с характером.',
      199.90,
      'accessories'
    ),
    (
      'Люлька «Клюв пеликана»',
      'pelican-beak-cradle',
      'Мягкая люлька в форме раскрытого клюва пеликана — уютная, странная и сразу запоминающаяся. Плавные линии, тёплые бежево-персиковые оттенки и качающаяся основа превращают её в нежный предмет для детской комнаты с лёгким сюрреалистичным вайбом.',
      229.90,
      'furniture'
    )
)
insert into public.products (
  title,
  slug,
  description,
  price,
  category_id,
  image_key,
  image_url
)
select
  seed.title,
  seed.slug,
  seed.description,
  seed.price,
  categories.id,
  seed.slug || '-v2.jpg',
  'https://kmj65yri.eu-central.insforge.app/api/storage/buckets/product-photos/objects/'
    || seed.slug || '-v2.jpg'
from seed
join public.categories
  on categories.slug = seed.category_slug
on conflict (slug) do update
set
  title = excluded.title,
  description = excluded.description,
  price = excluded.price,
  category_id = excluded.category_id,
  image_key = excluded.image_key,
  image_url = excluded.image_url
returning id, title, slug, price, category_id, image_key;
