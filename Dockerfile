FROM node:6.0
MAINTAINER André Abadesso <andre@lab21k.com.br>
RUN mkdir /src
WORKDIR /src
COPY package.json /src
RUN npm install
COPY . /src/

CMD ["npm","start"]
