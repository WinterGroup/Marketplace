# 1. Базовый образ для сборки
FROM node:20-alpine AS builder

# Рабочая директория внутри контейнера
WORKDIR /app

# Копируем package.json и lock-файлы (для кэширования зависимостей)
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./

# Устанавливаем зависимости (включая dev-зависимости для сборки)
RUN npm ci

# Копируем весь проект (ненужное отфильтрует .dockerignore)
COPY . .

# Сборка Next.js
RUN npm run build

# 2. Продакшен-образ (минимальный)
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Без root пользователя
RUN addgroup --system app && adduser --system -G app app
USER app

# Копируем нужные артефакты из builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Открываем порт
EXPOSE 3000

# Запускаем Next.js
CMD ["npm", "start"]
