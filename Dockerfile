### STAGE 1: Build ###
FROM node:16-alpine AS build

#### make the 'app' folder the current working directory
WORKDIR /opt/app-root

#### copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

#### install angular cli
RUN npm install -g @angular/cli

#### install project dependencies
RUN npm install --legacy-peer-deps

#### copy things
COPY . .

#### generate build --prod
RUN npm run build

### STAGE 2: Run ###
FROM nginxinc/nginx-unprivileged

#### copy nginx conf
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

#### copy artifact build from the 'build environment'
COPY --from=build /opt/app-root/dist/ /usr/share/nginx/html

#### don't know what this is, but seems cool and techy
CMD ["nginx", "-g", "daemon off;"]