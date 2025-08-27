# Легкий образ Node.js
FROM node:20-alpine

# Рабочая директория
WORKDIR /app

# Устанавливаем зависимости для нативных модулей (иногда нужны для пакетов)
RUN apk add --no-cache python3 make g++

# Копируем только package.json и package-lock.json для кеширования npm install
COPY package*.json ./

# Ставим зависимости максимально быстро
RUN npm ci --legacy-peer-deps

# Копируем весь проект
COPY . .

# Экспонируем порт
EXPOSE 3000

# Старт
CMD ["npm", "run", "dev"]

