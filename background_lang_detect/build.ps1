cd ".\background_lang_detect\assets\"
browserify main.js -o app_bundle.js
cd ..
zcli apps:update