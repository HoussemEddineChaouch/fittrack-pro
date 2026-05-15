FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json .
RUN npm install --legacy-peer-deps

# Copy source
COPY . .

# Build React app
RUN npm run build

# Serve with nginx
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]