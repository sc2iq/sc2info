# base node image
FROM node:18-bullseye-slim AS base

FROM base AS deps

WORKDIR /myapp

ADD package.json package-lock.json ./
RUN npm ci

# Setup production node_modules
FROM deps AS production-deps

# set for base and all layer that inherit from it
ENV NODE_ENV="production"

WORKDIR /myapp

COPY --from=deps /myapp/node_modules /myapp/node_modules
ADD package.json package-lock.json ./
RUN npm prune --production

# Build the app
FROM deps AS build

WORKDIR /myapp

COPY --from=deps /myapp/node_modules /myapp/node_modules

ADD . .
RUN npm run build

# Finally, build the production image with minimal footprint
FROM build

ENV PORT="8080"

ENV NODE_ENV="production"

WORKDIR /myapp

COPY --from=production-deps /myapp/node_modules /myapp/node_modules

COPY --from=build /myapp/build /myapp/build
COPY --from=build /myapp/public /myapp/public
COPY --from=build /myapp/package.json /myapp/package.json
COPY --from=build /myapp/start.sh /myapp/start.sh

USER node

ENTRYPOINT [ "sh", "./start.sh" ]
