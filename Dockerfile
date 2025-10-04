FROM node:22.20-alpine3.22 as build-step

WORKDIR /app

# Env setup

COPY package.json yarn.lock .yarnrc.yml /app/
COPY components-sdk/package.json /app/components-sdk/
COPY website/package.json /app/website/

RUN <<EOF
corepack enable
yarn install --immutable
EOF

COPY components-sdk /app/components-sdk
COPY website /app/website

#EXPOSE 8080
#ENTRYPOINT ["yarn"]
#CMD ["dev", "--host", "0.0.0.0", "--port", "8080", "--strictPort"]

CMD ["yarn", "build"]

FROM nginx
COPY --from=build-step /app/website/dist /usr/share/nginx/html
COPY --from=build-step /app/website/dist/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
STOPSIGNAL SIGTERM
CMD ["nginx", "-g", "daemon off;"]
