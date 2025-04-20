FROM node:18

WORKDIR /app

# Chỉ copy file package.json để cài deps trước
COPY package*.json ./

# Cài dependencies mới bên trong Docker
RUN npm install

# Copy code vào container
COPY . ./

EXPOSE 5000

CMD ["npm", "run", "dev"]