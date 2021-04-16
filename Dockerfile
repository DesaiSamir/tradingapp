FROM node:lts AS development

ENV CI=true
# ENV PORT=3000

WORKDIR /code
COPY package.json /code/package.json
COPY yarn.lock /code/yarn.lock
# RUN npm ci
COPY . /code

CMD [ "yarn", "start" ]