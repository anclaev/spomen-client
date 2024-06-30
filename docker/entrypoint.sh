#!/bin/sh
# cat <<EOT >> /usr/share/nginx/html/assets/config.json
# {
#   \"appId\": \"$VK_ID_APP_ID\",
#   \"redirectUrl\": \"$VK_ID_REDIRECT_URL\",
#   \"apiUrl\": \"$API_HOST\",
#   {\"origin\": \"$ORIGIN\"}
# }
# EOT

echo "aefaef" >> /usr/share/nginx/html/assets/config.json

nginx -g 'daemon off;'
