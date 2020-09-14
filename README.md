# Preview Files README

This is an extension for visual studio code.
Currently we support previewing images, Css files, text files, html files and youtube videos.

## Features

This extension currently supports:

+ Non local images (URLs that begins with 'http' and ends with one of: 'png', 'jpg', 'jpeg', 'gif', 'bmp')
  
  * View image in a new tab inside the vscode.
  * View image in browser.
  * Image preview when hovering.
  
+ Local images (explicit and relative path)

  * View image in a new tab.
  * Image preview when hovering.
  
+ YouTube videos (youtube URLs)

  * Open video in browser.
  * Video thumbnail preview when hovering.
  
+ CSS files (currently only some relative paths)

  * Open Css files in a new tab (on clicking a button when hovering).
  
+ Text files (currently only some relative paths)

  * Open text files in a new tab (on clicking a button when hovering).

+ Html files (local and external path)

  * Open local html file (resource file) in a new tab.
  * Open external html as resource file or as rendered web page (in external or "internal" browser).  
  
![image](images/youtube-video-gif.gif)

![image](images/images-working-gif.gif)

![image](images/textgif.gif)


## Extension Settings

We registered some new commands (in package.json file), for example:

```json
"commands": [
			{
				"command": "extension.previewHover",
				"title": "Preview Hover"
			},
			{
				"command": "previewHover.newTabCommand",
				"title": "newTabCommand"
			}
		
]
```
Preview Hover is called to activate the extension.

newTabCommand is only called from inside the extension whenever a new tab must be displayed.

If you want to add some new features to this project, check out [our tutorial](https://vscodeextensiondev.blogspot.com/2020/07/turorial.html)
 
## About us:

This is our computer science Bachelor degree final project.
We developed an extension for visual studio code that currently previews images and youtube videos.
We made our project an open source for other people to try and expand our extension to similar features (Pdf files, office file etc.)


## Known Issues

All issues and solutions are documented in [our blog](https://vscodeextensiondev.blogspot.com/)
