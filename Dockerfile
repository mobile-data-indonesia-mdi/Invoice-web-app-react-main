FROM node:lts-alpine3.22

WORKDIR /app

COPY package*.json ./

RUN npm install 

COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

CMD ["npm", "run", "preview"]