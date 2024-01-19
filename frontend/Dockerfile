FROM nginx:latest

WORKDIR /app
COPY ./dist/ ./static

ARG BACKEND_HOST=http://localhost:3333
ENV BACKEND_HOST=$BACKEND_HOST

COPY nginx.conf /etc/nginx/nginx.conf
RUN mkdir /etc/nginx/templates
COPY nginx.server.template /etc/nginx/templates/server.conf.template

EXPOSE 80
