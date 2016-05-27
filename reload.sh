#!/usr/bin/env bash
rimraf component-gallery
git clone git@git.qapint.com:ewizard/component-gallery.git
cd component-gallery
git checkout develop
git pull