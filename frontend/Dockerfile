FROM nginx:latest

WORKDIR /app
COPY ./dist/ ./static

ARG VITE_API_URL=https://mealer.kristofferchr.dev
ENV VITE_API_URL=$VITE_API_URL

COPY ./nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
