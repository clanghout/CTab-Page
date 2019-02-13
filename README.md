# CTab-Page

:warning: Refresh extension in chrome://extensions/ after editing manifest.json

## Get to work(Install)
1. clone the repo
1. yarn / npm install
1. see Add as new tab section
    - or navigate to the index.html file (might cause issues with script loading)


## Add as new tab page
1. open chrome://extensions
1. make sure developer mode is enabled
1. click "load unpacked extension"
1. select the project root folder


## Usage
Below the ways of using the cTab page are described.

You start off with an empty page with a random background. This background changes on (almost) every refresh of the page (thanks to https://source.unsplash.com/random/1920x1080).

To add widgets to the page, use the red 'plus' button in the lower right of the screen. The first thing you can select is the type of widget you want to add. The current available types are:
- **link**: A widget displaying a title and taking you to the url of this widget.
- **note**: A widget displaying a textbox where any kind of text can be typed in.
- **clock**: displaying the current time your browser is set to.
- **buienradar**: displaying an 'iframe' from the website www.buienradar.com showing rain info for the Netherlands.

Depending on the type, you are asked to set the title and url for the widget. Furthermore, two color selectors are present to provide custom background and text colors for every widget.

### Saving
After every change you made and want to keep, the save button in the bottom left needs to be pressed. If you are using the page as an extension in google chrome, the key combination `ctrl + shift + s` also will save the current configuration. To undo any changes you made after your last save, refresh the page and confirm the message that you have unsaved changes. This will revert the page to the last saved configuration.


### Developer mode
Upon selecting the developer mode checkbox, some more buttons and text show up. The 'Reset to Default' button will clear the internally stored configuration and save an near empty version of the dashboard. :warning: You are unable to undo this with a refresh since it overwrites the existing configuration.
The add test widget button will add one extra widget to the dashboard.

The most important part of the developer mode options is the big textarea at the bottom of the screen. This area represents the current configuration as it is saved in your browser. Here every part of the existing widgets can be changed, new widgets can be added, and old ones deleted. This requires some technical knowledge, since making mistakes here and saving the dev config can result in crashes of the page. Important is after saving the dev config to ignore the unsaved changes prompt, since the developer config is not directly synced to the active configuration. Refresh the page and ignore the warning to be able to see changes made via the developer config.

### Bookmarks to add links
When the ctab page is open, and a bookmark is created within the browser. This site is also added to the ctab grid. The title change currently does not track the changing of the name, since this is probably an event triggered after the oncreate is already called. Need to figure out a way to track this.

Maybe it is an idea to only check for bookmarks added to a specific folder. Then keep track of the id's that chrome bookmarks use and on opening ctab page check if any new ones exist so page does not have to stay open.


## Development

### Implemented
- Select preferred method of sorting widgets
- Add new widgets through GUI

### Todo
- set bg color -> document.style.setproperty
- Less or Sass for css structured
- Bind textareas of note items back to the settings so they can be edited
- simple add logo is not centered (anymore)
- remove modules
### Ideas
- https://developer.chrome.com/extensions/getstarted#unpacked
- extension button in bar to add to config
- Switch between configurations and save on server -> able to add from one to the other (like spotify playlist idea)

### Deps
- https://github.com/haltu/muuri
- https://www.cssscript.com/color-picker-alpha-selection/

#### Widget sizes
Changes to the size of widgets need to be made in `scripts/createSizeStyles.js`. Run `node createSizeStyles.js` after changing and make sure to push the recreated `sizeStyles.css` along.
#### TODO-muuri
- Fix the hasChanges() method so the unsaved changes dialog can be turned on again.
  - Requires fixes to:
    - `hasChanges()`
    - `window.onbeforeunload`
    - `service.grid.on("change", ...`  or equivalent
- Re-add option to delete widgets.
- Ensure `textfill` is called for every widget.
- Check if saving and loading is happening deterministic.
- Add ability to resize widgets


- Add sub-grids to act as folders
- Add trash area to remove widgets
    - Add recently deleted area


