# Genetic Simulation — HTML и React

Два варианта одного проекта «Генетическая лаборатория / Генетический алгоритм на примере 2D машин».

## Структура

```text
.
├── html-version/       # текущая HTML/CSS/JavaScript-версия проекта
│   ├── index.html
│   ├── styles.css
│   ├── bundle.js
│   ├── bundle-main.js
│   ├── bundle-bare.js
│   ├── lib/
│   ├── src/
│   └── Dockerfile
│
├── react-version/      # React + Vite версия
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── react.css
│   ├── public/
│   │   ├── lib/
│   │   ├── bundle.js
│   │   ├── styles.css
│   │   └── simulation-fragment.html
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
│
├── docker-compose.yml
└── README.md
```

## Вариант 1 — HTML

Это сохранённый текущий проект без перевода на React. Оригинальные файлы движка, физики, генетического алгоритма и Canvas находятся в `html-version/`.

### Локальный запуск

Для локального запуска лучше использовать простой HTTP-сервер, а не открывать `index.html` через `file://`.

Например, из каталога `html-version`:

```bash
cd html-version
python -m http.server 8000
```

Откройте:

```text
http://localhost:8000
```

Также подойдёт любой статический сервер.

### Docker

```bash
cd html-version
docker build -t genetic-simulation-html .
docker run --rm -p 8080:80 genetic-simulation-html
```

Откройте `http://localhost:8080`.

---

## Вариант 2 — React + Vite

React-версия сохраняет существующий симуляционный движок и Canvas, но запускает его внутри React-компонента `LegacySimulation`. Это позволяет постепенно переносить отдельные части интерфейса и логики на React, не ломая рабочую физику и генетический алгоритм.

### Требования

- Node.js 20+
- npm 10+ (рекомендуется)

### Установка и запуск в режиме разработки

```bash
cd react-version
npm install
npm run dev
```

Откройте адрес, который выведет Vite (обычно `http://localhost:5173`).

### Production-сборка

```bash
cd react-version
npm install
npm run build
```

Результат находится в:

```text
react-version/dist/
```

Проверить production-сборку локально:

```bash
npm run preview
```

### Docker

```bash
cd react-version
docker build -t genetic-simulation-react .
docker run --rm -p 8081:80 genetic-simulation-react
```

Откройте `http://localhost:8081`.

---

## Запуск обоих вариантов через Docker Compose

Из корня репозитория:

```bash
docker compose up --build
```

После сборки:

- HTML: `http://localhost:8080`
- React: `http://localhost:8081`

Остановить:

```bash
docker compose down
```

---

## Что сохранено при переносе на React

React-версия не переписывает математическую модель симуляции заново. Оригинальный `bundle.js`, `box2d.js`, `seedrandom.js`, стили и DOM-разметка симуляции сохранены, а React отвечает за оболочку и жизненный цикл подключения legacy-движка.

Компоненты:

- `AppHeader` — React-шапка приложения.
- `LegacySimulation` — React-мост к оригинальной DOM/Canvas-симуляции.
- `App` — корневой компонент приложения.

Такой подход снижает риск изменения поведения симуляции и оставляет возможность следующего этапа: переносить панели управления, графики, метрики и Canvas на отдельные React-компоненты.

## GitHub

Создание репозитория:

```bash
git init
git add .
git commit -m "Add HTML and React versions of genetic simulation"
git branch -M main
git remote add origin <URL_ВАШЕГО_GITHUB_РЕПОЗИТОРИЯ>
git push -u origin main
```

Перед первым commit рекомендуется проверить:

```bash
git status
```

Не добавляйте в репозиторий `node_modules/` и `dist/` — они уже исключены в `.gitignore`.

## Примечания

1. HTML-версия является исходным вариантом проекта.
2. React-версия требует HTTP-сервера/Vite: загрузка legacy-фрагмента выполняется через `fetch()`.
3. Для Docker используется Nginx как статический web-сервер.
4. Проект не требует backend-сервера: симуляция выполняется в браузере.
