# CTab-Page

TODO: remove modules

:warning: Refresh extension in chrome://extensions/ after editing manifest.json

## Get to work(Install)
1. clone the repo
1. yarn / npm install
1. see Add as new tab section

## Ideas
- https://developer.chrome.com/extensions/getstarted#unpacked
- extension button in bar to add to config
- Switch between configurations and save on server -> able to add from one to the other (spotify playlist idea)


## Add as new tab page
1. open chrome://extensions
1. make sure developer mode is enabled
1. click "load unpacked extension"
1. select the project root folder


## Features
|Feature | Status |
| ---            | ---                    |
|localstorage    |done - need session storage |
|lower json size |todo: needed for session storage|
|styling         |in progress             |
|link preview    |bad solution :(         |
|simple add      |temporary solution      |
|multi type blocks<br>calendar<br>notes<br>clock|needs good implementation|
|Shortcut to save|implemented; Ctrl+Shift+S|


## To do
- ✅ Position save is not correctly used 
- set bg color -> document.style.setproperty
- Less or Sass for css structured
- Bind textareas of note items back to the settings so they can be edited
- simple add logo is not centered (anymore)

When the ctab page is open, and a bookmark is created within the browser. This site is also added to the ctab grid. The title change currently does not track the changing of the name, since this is probably an event triggered after the oncreate is already called. Need to figure out a way to track this.

Maybe it is an idea to only check for bookmarks added to a specific folder. Then keep track of the id's that chrome bookmarks use and on opening ctab page check if any new ones exist so page does not have to stay open.
