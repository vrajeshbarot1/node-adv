FROM node:20-alpine

WORKDIR /app

COPY package.json ./
COPY node_modules ./node_modules
COPY dist ./dist

EXPOSE 3003

CMD ["npm", "start"]
