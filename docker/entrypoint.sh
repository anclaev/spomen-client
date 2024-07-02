#!/bin/sh
echo "
{
  \"appId\": \"$VK_ID_APP_ID\",
  \"redirectUrl\": \"$VK_ID_REDIRECT_URL\",
  \"apiUrl\": \"$API_URL\",
  \"origin\": \"$ORIGIN\",
  \"sentryDsn\": \"$SENTRY_DSN\",
  \"environment\": \"$NODE_ENV\"
}
" > /usr/share/nginx/html/assets/config.json

nginx -g 'daemon off;'
