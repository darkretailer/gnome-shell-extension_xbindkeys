#!/bin/bash

# Params
appid=${1}
appname=${2}
apptitle=${3}

# Prepare vars
appid_filename=$(echo ${appid} | sed -e 's/\.desktop//g' | sed -e 's/[^A-Za-z0-9_-]/_/g')
appname_filename=$(echo ${appname} | sed -e 's/[^A-Za-z0-9_-]/_/g')
apptitle_filename=$(echo ${apptitle} | sed -e 's/[^A-Za-z0-9_-]/_/g')

# Configuration-vars
dir=~/.config/xbindkeys
suffix=xkbnd

test -d ${dir}/${appname_filename} || mkdir -p ${dir}/${appname_filename}
if [ ! -f ${dir}/${appname_filename}/${apptitle_filename}.${suffix} ]; then
    echo -ne "# \n# AppID: ${appid}\n# AppName: ${appname}\n# AppTitle: ${apptitle}\n# \n\n" \
    > ${dir}/${appname_filename}/${apptitle_filename}.${suffix}
fi
if [ ! -f ${dir}/${appname_filename}/${appname_filename}.${suffix} ]; then
    echo -ne "# \n# AppID: $appid\n# AppName: $appname\n# \n\n" \
    > ${dir}/${appname_filename}/${appname_filename}.${suffix}
fi
if [ ! -f ${dir}/${appname_filename}/${appid_filename}.${suffix} ]; then
    echo -ne "# \n# AppID: ${appid}\n# AppName: ${appname}\n# \n\n" \
    > ${dir}/${appname_filename}/${apptitle_filename}.${suffix}
fi
