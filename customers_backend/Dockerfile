FROM node:14-alpine

## copy app to /app
COPY ./customer_app /app

## set the working dir
WORKDIR /app

## run npm install
RUN npm install && npm cache clean --force

## EXPOSE 80
EXPOSE 80

## run the server
CMD ["node", "index.js"]



