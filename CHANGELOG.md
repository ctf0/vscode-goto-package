# Change Log

## 0.0.1

- Initial release.

## 0.0.3

- add remove package command to the popup
- cleanup

## 0.0.4

- make package more flexible to support more pms with ease
- terminal window will be reused instead of creating a new window for each removal
- remove both `showRemovePackageLink & openReadMeInstead` option and merge them under the pms details
- cleaner api

## 0.0.6

- fix package settings name

## 0.0.7

- typo

## 0.1.0

- fix a long running issue of https://github.com/microsoft/vscode/issues/113328

## 0.1.1

- show pkg info on hover

## 0.2.0

- fix not showing installed version

## 0.2.2

- add support to show changelog as well

## 0.2.5

- remove hover provider support, for composer u can instead use https://marketplace.visualstudio.com/items?itemName=DEVSENSE.composer-php-vscode
- u can also now remove
    - package manager link, if `registry` is an empty string,
    - installation folder link if `folder` if an empty string

## 0.2.6

- cleanup
- support nested vendor folders, now we search for folders next to the PM file instead of global only
- also dont show a link for packages if its not installed
