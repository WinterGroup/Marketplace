FROM node:20-alpine

WORKDIR /app

# копируем package.json и lock для установки зависимостей
COPY package*.json ./

RUN npm install

# копируем весь проект
COPY . .

# билдим проект
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
