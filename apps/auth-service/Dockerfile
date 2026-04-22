FROM node:20-alpine

RUN apk add --no-cache openssl

WORKDIR /app

COPY package.json ./
COPY node_modules ./node_modules
COPY dist ./dist
COPY prisma ./prisma

# Recreate .bin symlinks that Windows can't transfer
RUN npm rebuild

EXPOSE 3001

CMD ["npm", "start"]
