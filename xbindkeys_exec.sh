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

pkill -f 'xbindkeys -f' > /dev/null 2>&1 || true
if [ -f ${dir}/${appname_filename}/${apptitle_filename}.${suffix} ]; then
    xbindkeys -f ${dir}/${appname_filename}/${apptitle_filename}.${suffix}
elif [ -f ${dir}/${appname_filename}/${appname_filename}.${suffix} ]; then
    xbindkeys -f ${dir}/${appname_filename}/${appname_filename}.${suffix}
elif [ -f ${dir}/${appname_filename}/${appid_filename}.${suffix} ]; then
    xbindkeys -f ${dir}/${appname_filename}/${appid_filename}.${suffix}
fi
