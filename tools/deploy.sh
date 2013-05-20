#!/bin/bash

# the folder this script is in (*/bootplate/tools)
TOOLS=$(cd `dirname $0` && pwd)

# enyo location
ENYO="$TOOLS/../enyo"

# deploy script location
DEPLOY="$ENYO/tools/deploy.js"

# check for node, but quietly
if command -v node >/dev/null 2>&1; then
	# use node to invoke deploy with imported parameters
	echo "enyo/tools/minify.sh args: " $@
	node $DEPLOY $@
else
	echo "No node found in path"
	exit 1
fi

# create a zip and upload to build.phonegap.com
echo "create zip" 
cd /home/micha/stopandgo/Enyo2/mySongs/deploy/mySongs
zip -rq /home/micha/stopandgo/Enyo2/mySongs/deploy/mySongs.zip *
echo "upload to build.phonegap.com"
curl -X PUT -F file=@/home/micha/stopandgo/Enyo2/mySongs/deploy/mySongs.zip https://build.phonegap.com/api/v1/apps/302264?auth_token=dFZDtwNV7MF3DJ5RZHx2
# copy a build to Dropbox public folder
echo "copy a build to Dropbox public folder"
cp -rf /home/micha/stopandgo/Enyo2/mySongs/deploy/mySongs/* /home/micha/Dropbox/Public/mySongs/
