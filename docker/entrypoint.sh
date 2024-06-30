#!/bin/sh
cat <<EOT >> /usr/share/nginx/html/assets/config.json
{
  \"appId\": \"$VKID_APP_ID\",
  \"redirectUrl\": \"$VKID_REDIRECT_URL\",
  \"apiUrl\": \"$API_URL\",
  {\"origin\": \"$ORIGIN\"}
}
EOT

nginx -g 'daemon off;'
