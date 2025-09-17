FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
# YENİ
RUN npm install --omit=dev

COPY . .

ENV NODE_ENV=production
EXPOSE 5000
CMD ["npm", "start"]
# YENİ
