FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock* ./
RUN yarn install --frozen-lockfile --production=false

COPY . .

EXPOSE 8091
CMD ["yarn", "start"]
