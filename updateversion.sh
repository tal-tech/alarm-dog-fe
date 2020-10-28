#!/bin/sh

if [ -n "$DOG_FE_VERSION" ]; then
  # read from env
  tag=$DOG_FE_VERSION
else
  if [ "$DOG_FE_VERSION_TYPE" == "hash" ]; then
    git rev-parse --short HEAD > /dev/null 2>&1

    if [ $? -eq 0 ]; then
      # for publish
      tag=`git rev-parse --short HEAD`
    elif [ -n "$image" ]; then
      # for k8s
      tag=`echo -n $image | awk -F ':' '{print $NF}'`
    else
      # error
      tag='unknown'
    fi
  else
    git rev-list --tags --max-count=1 > /dev/null 2>&1

    if [ $? -eq 0 ]; then
      # continue
      git describe --tags $(git rev-list --tags --max-count=1) > /dev/null 2>&1
      if [ $? -eq 0 ]; then
        # for publish
        tag=`git describe --tags $(git rev-list --tags --max-count=1)`
      elif [ -n "$image" ]; then
        # for k8s
        tag=`echo -n $image | awk -F ':' '{print $NF}'`
      else
        # other
        tag='unknown'
      fi
    else
      # error
      tag='unknown'
    fi
  fi
fi

if [ -n "$DOG_FE_VERSION_PREFIX" ]; then
  tag="$DOG_FE_VERSION_PREFIX""$tag"
fi

echo "current update version tag is $tag"
if [ `uname -s` == "Darwin" ]; then
  sed -i "" "s/version: '.*'/version: '$tag'/" src/settings.js
else
  sed -i "s/version: '.*'/version: '$tag'/" src/settings.js
fi
