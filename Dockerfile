FROM oven/bun:latest as build-step

WORKDIR /app

# Env setup

COPY package.json bun.lock /app/
COPY components-sdk/package.json /app/components-sdk/
COPY website/package.json /app/website/

RUN <<EOF
corepack enable
bun install --immutable
EOF

COPY components-sdk /app/components-sdk
COPY website /app/website

#EXPOSE 8080
#ENTRYPOINT ["bun"]
#CMD ["dev", "--host", "0.0.0.0", "--port", "8080", "--strictPort"]

CMD ["bun", "build"]

FROM nginx
COPY --from=build-step /app/website/dist /usr/share/nginx/html
COPY --from=build-step /app/website/dist/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
STOPSIGNAL SIGTERM
CMD ["nginx", "-g", "daemon off;"]
