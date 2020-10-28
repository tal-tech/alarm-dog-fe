FROM nginx:1.13.3-alpine as builder

RUN sed -i 's/^user.*$/user  root;/' /etc/nginx/nginx.conf \
    && sed -i 's#/usr/share/nginx/html#/var/www#' /etc/nginx/conf.d/default.conf

FROM node:12.18.4-alpine3.9

LABEL maintainer="ethananony <ethananony@aliyun.com>" version="1.0"

COPY --from=builder /etc/nginx/conf.d/default.conf /tmp/default.conf

# update
RUN set -ex \
    && sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories \
    && apk update \
    && apk add --no-cache git bash nginx \
    # modify configure files
    && mv /tmp/default.conf /etc/nginx/conf.d/default.conf \
    && sed -i 's/^user.*$/user  root;/' /etc/nginx/nginx.conf \
    && sed -i 's#/usr/share/nginx/html#/var/www#' /etc/nginx/conf.d/default.conf \
    && mkdir -p /var/www \
    && echo 'hello nginx!' > /var/www/index.html \
    && mkdir -p /run/nginx \
    && mkdir -p /var/log/nginx \
    # show versions
    && node --version \
    && npm --version \
    && yarn --version \
    && nginx -v \
    # ---------- clear works ----------
    && rm -rf /var/cache/apk/* /tmp/* /usr/share/man \
    && echo -e "\033[42;37m Build Completed :).\033[0m\n"

WORKDIR /var/www

ENTRYPOINT ["nginx", "-g", "daemon off;"]
