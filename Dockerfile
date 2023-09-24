# Utiliser une image Node.js LTS
FROM node:14
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
ENV MONGODB_URI mongodb://mongodb:27017/Planifly
CMD ["npm", "start"]
