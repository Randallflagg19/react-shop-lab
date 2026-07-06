# AI Slop Shop — VPS Self-Hosting Learning Roadmap

Статус: **отложенный резервный roadmap**. Повторная проверка показала, что Vercel deployment работает без VPN через домашний Wi-Fi и рабочую сеть, а через мобильную сеть доступ нестабилен вместе с самой связью. Покупка нового VPS и срочная миграция не требуются. Основным активным планом снова является `ai-slop-shop-learning-roadmap.md`; этот документ сохраняется на случай осознанного перехода к self-hosting.

## Зачем появился этот roadmap

Production на `react-shop-lab.vercel.app` не открывается без VPN на ноутбуке и телефоне: зависает загрузка самого документа с домена Vercel. Перенос изображений в `public` и создание server-only proxy решили прямую зависимость браузера от InsForge, но не решили региональную недоступность Vercel.

Цель этого roadmap — развернуть тот же Next.js-проект на существующем VPS `91.210.170.148`, не нарушить работу двух текущих приложений и пройти self-hosting осознанно: от инвентаризации сервера до HTTPS, rollback и наблюдаемости.

## Что остаётся, а что заменяется

### InsForge остаётся

InsForge по-прежнему хранит:

- таблицу `products`;
- таблицу `categories`;
- read-only политики и grants для `anon`/`authenticated`.

Next.js на VPS будет обращаться к InsForge через существующий server-only SDK client. Переносить PostgreSQL на VPS в этом roadmap не нужно.

### Vercel перестаёт быть обязательным production-хостингом

После успешного запуска итоговый путь данных станет таким:

```text
Browser
  ↓ HTTPS
Nginx на VPS
  ↓ http://127.0.0.1:<PORT>
Next.js standalone server
  ├── /api/products → InsForge Database
  └── /images/products/* → локальный public на VPS
```

Vercel можно временно оставить как резервный deployment. Пользовательский трафик через него идти не обязан. Удалять Vercel-проект до стабильной проверки VPS не нужно.

## Зафиксированные ограничения и решения

- VPS: Ubuntu 24.04, 1 vCPU, около 2 ГБ RAM, 6 ГБ swap, после очистки около 10–11 ГБ свободного диска.
- На сервере уже работают два приложения — существующие процессы, порты и Nginx-конфиги нельзя менять вслепую.
- Текущий системный Node.js 18 нельзя обновлять поверх: старые приложения могут от него зависеть.
- Next.js 16 требует Node.js не ниже 20.9; для нового приложения устанавливаем Node.js 22 отдельно.
- Используем один экземпляр Next.js и persistent disk; Kubernetes, Docker Swarm, Redis и балансировщик не нужны.
- Используем `output: "standalone"`, чтобы runtime не содержал полный `node_modules`.
- Сборка должна выполняться на Linux. Сборка на macOS может включить несовместимые с Linux native-модули.
- Next.js слушает только `127.0.0.1`; наружу его публикует Nginx.
- Секреты не хранятся в Git и не получают префикс `NEXT_PUBLIC_`.
- До появления собственного домена используем бесплатное DNS-имя на основе IP только как временный вариант.

## Правила прохождения

1. Один этап — одна проверяемая идея.
2. Перед командой понимать, что она меняет и как её отменить.
3. Не копировать `.env.local`, `.git`, полный `node_modules` и локальные кэши на VPS.
4. Не открывать порт Node.js в интернет после подключения Nginx.
5. Не удалять старый release до проверки нового.
6. После каждого изменения проверять оба существующих приложения.
7. Команды с удалением, firewall, SSH, Nginx и systemd выполнять только после просмотра текущего состояния.

---

## Этап 0. Зафиксировать исходное состояние

### Уже выполнено

- очищено около 1.1 ГБ старых systemd journals;
- свободное место увеличено примерно до 10–11 ГБ;
- root login отключён;
- password authentication отключён;
- вход по SSH-ключу проверен во второй сессии;
- `sshd -t` проходит;
- подтверждено, что InsForge и Vercel отвечают извне, но `vercel.app` недоступен из пользовательских сетей без VPN.

### Осталось записать

- дату и время последнего рабочего состояния старых приложений;
- URL и основные пользовательские сценарии обоих приложений;
- текущий `df -h`, `free -h`;
- snapshot/backup VPS перед деплоем.

### Зачёт

Есть контрольная точка, по которой можно доказать, что новое приложение не сломало старые.

---

## Этап 1. Инвентаризация процессов, портов и Nginx

### Что изучить

- чем отличаются process manager, reverse proxy и application server;
- зачем Next.js не выставлять напрямую в интернет;
- как один Nginx обслуживает несколько приложений.

### Что выполнить и сохранить

```bash
ps aux --sort=-%mem | head -20
sudo ss -ltnp
systemctl --type=service --state=running
sudo nginx -t
sudo nginx -T
sudo find /etc/nginx/sites-enabled -maxdepth 1 -type l -ls
```

Если `pm2 list` зависает, не строить план вокруг PM2: остановить команду через `Ctrl+C`, выяснить, используют ли старые приложения systemd, Docker или другой пользователь PM2.

Отдельно посмотреть zombie-процессы и их родителей:

```bash
ps -eo stat,ppid,pid,cmd | awk '$1 ~ /^Z/'
```

### Решение этапа

- выбрать свободный внутренний порт, предварительно `3002`;
- выбрать каталог `/var/www/ai-slop-shop`;
- выбрать отдельный systemd unit `ai-slop-shop.service`;
- не изменять существующие upstream и server blocks.

### Зачёт

Известно, кто слушает `80`, `443`, порты приложений и какой процесс запускает каждый старый проект.

---

## Этап 2. Постоянный лимит журналов и базовая защита VPS

### Что сделать

- ограничить journald, чтобы журнал снова не занял гигабайты;
- проверить UFW/сетевой firewall;
- убедиться, что наружу открыты только необходимые порты;
- проверить доступность security updates;
- решить, нужен ли `fail2ban` после отключения password authentication.

Пример лимита journald:

```ini
[Journal]
SystemMaxUse=300M
RuntimeMaxUse=100M
```

### Не делать вслепую

- не включать UFW до просмотра текущих разрешённых портов;
- не закрывать SSH-порт в активной сессии;
- не запускать массовое обновление пакетов без snapshot;
- не считать неудачные входы доказательством компрометации.

### Зачёт

После перезагрузки доступ по ключу сохраняется, старые приложения работают, журналы имеют ограничение по размеру.

---

## Этап 3. Установить Node.js 22 рядом с Node.js 18

### Цель

Старые приложения продолжают использовать свой Node.js 18, AI Slop Shop получает отдельный Node.js 22.

### Подход

- установить `nvm` для пользователя `tapiradmin` или использовать другой user-scoped version manager;
- установить актуальную Node.js 22 LTS;
- не менять `/usr/bin/node`;
- зафиксировать полный путь к новому бинарнику для systemd.

### Проверка

```bash
/absolute/path/to/node --version
/usr/bin/node --version
```

Ожидается: новый путь показывает Node.js 22, системный путь остаётся Node.js 18.

### Зачёт

Обе версии существуют независимо, старые приложения после установки продолжают работать.

---

## Этап 4. Подготовить приложение к standalone output

### Что написать самому

В `next.config.ts` добавить официальный режим:

```ts
output: "standalone"
```

### Что понять

`next build` использует Output File Tracing и создаёт `.next/standalone` только с runtime-файлами, которые действительно нужны серверу.

Папки `public` и `.next/static` автоматически в standalone не копируются. Их нужно добавить в release отдельно:

```bash
cp -r public .next/standalone/
mkdir -p .next/standalone/.next
cp -r .next/static .next/standalone/.next/
```

### Локальные проверки перед сервером

```bash
npm run test:run
npm run lint
npm run build
```

### Важное ограничение

Локальная macOS-сборка служит проверкой кода, но production-артефакт собирается на Linux, чтобы native dependencies соответствовали серверу.

### Зачёт

Локальные проверки зелёные, `.next/standalone/server.js` существует, понятно, какие папки войдут в release.

---

## Этап 5. Доставить исходники и собрать Linux-артефакт

### Выбрать способ доставки

Для первого раза:

- clone/pull из GitHub в отдельный build-каталог;
- либо передать архив исходников без `.git`, `.next`, `node_modules`, `.env*`.

Предпочтительный учебный путь — GitHub с read-only deploy key, если repository private.

### Build-каталог и release-каталог

```text
/home/tapiradmin/build/ai-slop-shop/       временные исходники
/var/www/ai-slop-shop/releases/<id>/       immutable runtime
/var/www/ai-slop-shop/current -> releases/<id>
```

### Сборка

- активировать Node.js 22;
- выполнить чистый `npm ci`;
- выполнить `npm run test:run`, `npm run lint`, `npm run build`;
- собрать standalone release;
- измерить размер через `du -sh`;
- после успешного release удалить временные `node_modules` и build cache, но не текущий release.

### Зачёт

На сервере существует отдельный standalone release, старые приложения не перезапускались, свободного диска достаточно.

---

## Этап 6. Настроить server-only environment variables

### Что остаётся от InsForge

```env
INSFORGE_URL=https://kmj65yri.eu-central.insforge.app
INSFORGE_ANON_KEY=...
```

Эти значения нужны Next.js-процессу на VPS. Браузер их не получает.

### Хранение

- создать отдельный файл, например `/etc/ai-slop-shop.env`;
- владелец `root`, права `600`;
- подключить через `EnvironmentFile=` в systemd;
- не копировать `.env.local` в публичный release;
- admin/service key не использовать.

### Проверка

- без env приложение должно завершаться с понятной ошибкой;
- с env `/api/products` должен вернуть каталог;
- содержимое env не должно появляться в HTML, JS или Git.

### Зачёт

Next.js на VPS получает каталог из InsForge, а секреты отсутствуют в release и browser Network.

---

## Этап 7. Запустить Next.js через systemd только на localhost

### Почему systemd

- уже входит в Ubuntu;
- обеспечивает автозапуск;
- перезапускает процесс после сбоя;
- собирает stdout/stderr в journal;
- не добавляет отдельный PM2 daemon.

### Параметры сервиса

- отдельное имя `ai-slop-shop.service`;
- `WorkingDirectory=/var/www/ai-slop-shop/current`;
- `ExecStart=` с абсолютным путём Node.js 22 и `server.js`;
- `EnvironmentFile=/etc/ai-slop-shop.env`;
- `HOSTNAME=127.0.0.1`;
- `PORT=3002` или другой свободный порт;
- `NODE_ENV=production`;
- `Restart=on-failure`;
- запуск не от root.

### Проверка до Nginx

```bash
systemctl status ai-slop-shop --no-pager
journalctl -u ai-slop-shop -n 100 --no-pager
curl -I http://127.0.0.1:3002/
curl -i http://127.0.0.1:3002/api/products
```

### Зачёт

Главная и API отвечают локально на VPS, процесс переживает restart, порт не доступен напрямую из интернета.

---

## Этап 8. Убрать Vercel-специфичное кэширование

### Текущая проблема

`Vercel-CDN-Cache-Control` понимает Vercel CDN. На собственном VPS этот заголовок не создаёт трёхдневный cache.

### Первый безопасный вариант

- удалить Vercel-специфичный заголовок;
- сначала добиться корректности без дополнительного proxy cache;
- измерить реальное время `/api/products`;
- затем выбрать один источник кэширования.

### Учебное решение после измерения

Предпочтительно кэшировать server repository средствами Next.js на три дня, а не одновременно в Next.js и Nginx. Для одного persistent Node.js instance отдельный Redis не нужен.

Не внедрять cache из памяти: перед изменением прочитать документацию текущего Next.js 16 и написать тест на повторный запрос/ошибку upstream.

### Зачёт

В коде нет ложного Vercel-заголовка, задокументированы TTL и способ обновления каталога, после перезапуска поведение понятно.

---

## Этап 9. Подключить Nginx как reverse proxy

### Почему Nginx

Next.js рекомендует reverse proxy перед Node.js server: он принимает внешние соединения, ограничивает некорректные запросы и не выставляет Node.js напрямую.

### Что добавить

- отдельный `server` block;
- уникальный `server_name`;
- `proxy_pass http://127.0.0.1:3002`;
- корректные `Host`, `X-Forwarded-For`, `X-Forwarded-Proto`;
- WebSocket/upgrade headers при необходимости;
- streaming без лишней буферизации;
- разумные timeout и body size;
- отдельные access/error logs с ротацией.

### Проверка

```bash
sudo nginx -t
sudo systemctl reload nginx
```

После reload проверить оба старых приложения и новый host.

### Временный адрес без покупки домена

Для теста можно рассмотреть hostname вида:

```text
ai-slop-shop.91-210-170-148.sslip.io
```

Перед использованием отдельно проверить, что он резолвится и доступен без VPN в нужных сетях. Это временная зависимость, а не обязательная часть архитектуры.

### Зачёт

Новый hostname открывает приложение через Nginx, старые server blocks не изменили поведение.

---

## Этап 10. HTTPS без покупки домена

### Сценарий

- использовать временное DNS-имя, которое резолвится в IP VPS;
- получить сертификат Let's Encrypt через Certbot;
- проверить автоматическое продление;
- перенаправить HTTP на HTTPS только после успешного сертификата.

### Проверки

```bash
curl -I http://<hostname>
curl -I https://<hostname>
sudo certbot renew --dry-run
```

### Оговорка

Если бесплатный hostname нестабилен или недоступен в России, первый зачёт можно провести по HTTP/IP, а красивый production URL отложить до собственного домена. Не маскировать это ограничение в README.

### Зачёт

Приложение открывается по HTTPS без предупреждения браузера или явно задокументировано, почему временно используется HTTP/IP.

---

## Этап 11. Production-проверка без VPN

### Проверить на ноутбуке

- новая сессия/инкогнито;
- VPN полностью отключён до открытия страницы;
- главная страница;
- `/api/products`;
- локальное изображение;
- product details;
- favorites;
- cart;
- hard reload;
- прямой переход по slug.

### Проверить на телефоне

- Wi-Fi без VPN;
- мобильный интернет без VPN;
- инкогнито/приватная вкладка;
- те же ключевые сценарии.

### Network-критерии

- document, JS, CSS и images приходят с VPS hostname;
- browser не обращается к `insforge.app`;
- browser не обращается к `vercel.app` или `vercel.live`;
- `/api/products` приходит с VPS;
- нет бесконечных pending requests.

### Server-критерии

- systemd service active;
- Nginx без новых `5xx`;
- Next.js journal без необработанных ошибок;
- InsForge timeout превращается в безопасный `502`;
- старые приложения работают.

### Зачёт

Приложение стабильно работает без VPN минимум в трёх проверках: ноутбук, телефон Wi-Fi, телефон mobile network.

---

## Этап 12. Repeatable deploy и rollback

### Что автоматизировать после первого ручного deploy

- build release;
- копирование standalone/public/static;
- переключение symlink `current`;
- restart systemd;
- health check;
- возврат symlink на предыдущий release при ошибке;
- сохранение последних двух releases;
- удаление более старых артефактов только после проверки.

### Не делать на первом проходе

- CI/CD с root-доступом;
- автоматический deploy каждого commit в production;
- Docker только ради моды;
- несколько Next.js instances;
- zero-downtime deploy без необходимости.

### Зачёт

Новый release можно выложить повторяемой командой, а предыдущий вернуть без пересборки.

---

## Этап 13. Наблюдаемость и эксплуатация

### Минимум

- `systemctl status` и `journalctl` для Next.js;
- Nginx access/error logs;
- ограничение journald;
- контроль `df -h`, `free -h`, swap;
- health-check главной и `/api/products`;
- backup env и Nginx/systemd конфигурации в защищённом месте;
- периодическая установка security updates с snapshot перед крупным обновлением.

### Опционально

- простой внешний uptime monitor;
- fail2ban для уменьшения SSH-шума;
- уведомление при заполнении диска;
- измерение p95 ответа `/api/products`.

### Зачёт

Можно ответить: где смотреть сбой, как отличить Nginx/Next.js/InsForge, как перезапустить приложение и как откатить release.

---

## Этап 14. Актуализировать портфолио и закрыть инцидент

### README

Честно описать:

- почему прямой InsForge был заменён server-only proxy;
- почему Vercel оказался недоступен без VPN;
- почему hosting перенесён на VPS;
- Browser → Nginx → Next.js → InsForge;
- standalone, systemd, env, HTTPS, cache и rollback;
- результаты проверки без VPN.

### Старый proxy-roadmap

Исправить прежний вывод: архитектурная часть была завершена, но production-критерий на Vercel оказался опровергнут повторной проверкой 5 июля 2026 года. Полностью закрыть этот критерий только после успешного VPS deploy.

### Зачёт

Документация не утверждает, что Vercel работает без VPN, пока это не подтверждено. В портфолио показано не «идеальное с первого раза» решение, а корректная диагностика и эволюция архитектуры.

---

## Definition of Done

- AI Slop Shop работает на существующем VPS и не мешает двум старым приложениям;
- Node.js 18 старых приложений не заменён;
- новый Next.js работает на Node.js 22;
- production runtime использует standalone output;
- Node.js слушает localhost, наружу работает Nginx;
- InsForge остаётся read-only базой за server-only слоем;
- изображения отдаются с VPS;
- browser не зависит от Vercel и InsForge domains;
- приложение проверено без VPN на ноутбуке и телефоне;
- секреты не находятся в Git/release/browser;
- есть HTTPS либо честно задокументированный временный HTTP-тест;
- есть repeatable deploy и rollback;
- тесты, lint и build проходят;
- README и архивный proxy-roadmap отражают фактический результат.

## Что не входит

- покупка нового VPS до проверки существующего;
- перенос PostgreSQL с InsForge;
- миграция двух старых приложений;
- Kubernetes;
- обязательный Docker;
- платный CDN;
- несколько production instances;
- admin key InsForge;
- автоматический CI/CD до ручного понимания deploy;
- удаление Vercel-проекта до завершения VPS-проверки.
