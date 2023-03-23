Set-Location ".\assets\"
browserify main.js -o app_bundle.js
Set-Location ..
zcli apps:update