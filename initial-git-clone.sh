#bash 
GIT_TOKEN=$1

# Use authenticated URL if GIT_TOKEN exists, otherwise use public URL
if [ -n "$GIT_TOKEN" ]; then
    BASE_URL="https://${GIT_TOKEN}@github.com/belivvr"
else
    BASE_URL="https://github.com/belivvr"
fi

git clone ${BASE_URL}/xrcloud-backend.git
git clone ${BASE_URL}/xrcloud-frontend.git
git clone ${BASE_URL}/xrcloud-nginx.git
git clone ${BASE_URL}/hubs-all-in-one.git
cd hubs-all-in-one
git clone ${BASE_URL}/dialog.git
git clone ${BASE_URL}/hubs.git
git clone ${BASE_URL}/spoke.git
git clone ${BASE_URL}/reticulum.git