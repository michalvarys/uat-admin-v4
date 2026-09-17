# Creating multi-stage build for production
FROM node:18-alpine AS build
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev git > /dev/null 2>&1
ENV NODE_ENV=production

WORKDIR /opt/
COPY package.json yarn.lock ./
# node-gyp se instaluje bez verze, takže yarn bral nejnovější — ta od
# verze 11 vyžaduje Node 22+, zatímco image stojí na Node 18, a build
# padal na "The engine node is incompatible". Připnuto na poslední
# verzi kompatibilní s Node 18.
RUN yarn global add node-gyp@10.2.0
RUN yarn config set network-timeout 600000 -g && yarn install --production
ENV PATH /opt/node_modules/.bin:$PATH
WORKDIR /opt/app
COPY . .
RUN yarn build

# Creating final production image
FROM node:18-alpine
RUN apk update && apk add --no-cache vips-dev && rm -rf /var/cache/apk/*
ENV NODE_ENV=production
WORKDIR /opt/
COPY --from=build /opt/node_modules ./node_modules
WORKDIR /opt/app
COPY --from=build /opt/app ./
ENV PATH /opt/node_modules/.bin:$PATH

RUN chown -R node:node /opt/app
# Use more restrictive permissions instead of 777
RUN chmod 755 -R /opt/app/public
USER node
EXPOSE 1337
CMD ["yarn", "start"]
