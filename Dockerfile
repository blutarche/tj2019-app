FROM node:10.17-buster

# Add Node.js app
RUN mkdir /src
WORKDIR /src


COPY package.json /src/package.json
RUN yarn

COPY . /src
ENV PORT=8000
EXPOSE 8000
CMD yarn deployed-start