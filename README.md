# CTab-Page

## move from master to main
run:
```
git branch -m master main
git fetch origin
git branch -u origin/main main
git remote set-head origin -a
```

:warning: Reminder to back up grid config regularly if it is important to you.

:warning: Refresh extension in chrome://extensions/ after editing manifest.json


## Get to work(Install)
1. clone the repo
1. run `yarn` or `npm install`
1. run `yarn start` or `npm start`
1. Go to the provided url (default: http://localhost:1234/)

- [Parcel](https://parceljs.org) is used for bundling, building, compiling, minifying, ... the code.
- [Typescript]() is used for scripting.
- [Sass]() is used for styling.


## Add as new tab page
When released, you can find this in the chrome/ firefox extension store
For developers:
1. Run `yarn build` or `npm build`
1. open chrome://extensions
1. make sure developer mode is enabled
1. click "load unpacked extension"
1. select the `dist` folder


## Usage
Below the ways of using the cTab page are described.

You start off with an empty page with a random background.
This background changes on every refresh of the page (thanks to https://source.unsplash.com/random/1920x1080).

To add widgets to the page, use the red 'plus' button in the lower right of the screen.
The first thing you can select is the type of widget you want to add.
The current available types are:
- **link**: A widget displaying a title and taking you to the url of this widget.
- **note**: A widget displaying a textbox where any kind of text can be typed in.
- **clock**: displaying the current time your browser is set to.
- **buienradar**: displaying an 'iframe' from the website www.buienradar.com showing rain info for the Netherlands.
- **weather**: displaying you the current weather and temperature of a city you select.

Depending on the type, you are asked to set the title and url for the widget.
Furthermore, two color selectors are present to provide custom background and text colors for every widget.

### Saving
After every change you made and want to keep, the save button in the bottom left needs to be pressed.
If you are using the page as an extension in google chrome, the key combination `ctrl + shift + s` also will save the current configuration.
To undo any changes you made after your last save, refresh the page and confirm the message that you have unsaved changes.
This will revert the page to the last saved configuration.


### Developer mode
Upon selecting the developer mode checkbox, some more buttons and text show up.
The 'Reset to Default' button will clear the internally stored configuration and save a near empty version of the dashboard.
:warning: You are unable to undo this with a refresh since it overwrites the existing configuration.
The add-test-widget button will add one extra widget to the dashboard.

The most important part of the developer mode options is the big textarea at the bottom of the screen.
This area represents the current configuration as it is saved in your browser.
Here every part of the existing widgets can be changed, new widgets can be added, and old ones deleted.
This requires some technical knowledge, since making mistakes here and saving the dev config can result in crashes of the page.
Important is after saving the dev config to ignore the unsaved changes prompt, since the developer config is not directly synced to the active configuration.
Refresh the page and ignore the warning to be able to see changes made via the developer config.

### Bookmarks to add links
When the ctab page is open, and you create a bookmark within the browser, this site will also be added to the ctab grid.
The title change does not track the changing of the name, since this is probably an event triggered after the oncreate is already called.
Need to figure out a way to track this.

This behaviour can be disabled by checking the checkbox 'Disable adding a widget on bookmarking' in the settings menu.
