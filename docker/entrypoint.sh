#!/bin/sh
echo "
{
  \"appId\": \"$VK_ID_APP_ID\",
  \"redirectUrl\": \"$VK_ID_REDIRECT_URL\",
  \"apiUrl\": \"$API_URL\",
  \"origin\": \"$ORIGIN\"
}
" > /usr/share/nginx/html/assets/config.json

nginx -g 'daemon off;'
