#!/bin/sh
# cat <<EOT >> /usr/share/nginx/html/assets/config.json
# {
#   \"appId\": \"$VK_ID_APP_ID\",
#   \"redirectUrl\": \"$VK_ID_REDIRECT_URL\",
#   \"apiUrl\": \"$API_HOST\",
#   {\"origin\": \"$ORIGIN\"}
# }
# EOT

echo "
{\n
  \"appId\": \"$VK_ID_APP_ID\",\n
  \"redirectUrl\": \"$VK_ID_REDIRECT_URL\",\n
  \"apiUrl\": \"$API_HOST\",\n
  {\"origin\": \"$ORIGIN\"}\n
}
" > /usr/share/nginx/html/assets/config.json

nginx -g 'daemon off;'
