# React'ı build et
FROM node:18-alpine AS build
WORKDIR /app

# Bağımlılıkları yükle
COPY package*.json ./
RUN npm install

# Kaynak kodu kopyala
COPY . .

# Kodda sabit yazılmış API adreslerini /api ile değiştir
# (örn. http://localhost:5000 -> /api)
RUN find /app -type f \( -name "*.js" -o -name "*.ts" -o -name "*.tsx" \) \
    -exec sed -i 's|http://localhost:5000|/api|g' {} +

# Prod build
RUN npm run build

# Nginx ile servis et
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
