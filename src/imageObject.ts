import { variablesUtils, makeExplicitPathFromRelative } from './utils';
import { MarkdownString } from 'vscode';
import IPreviewObject from './IPreviewObject';


export default class ImageObject implements IPreviewObject {

	constructor() {
		variablesUtils.validateObject.addValidateFunction("image", this.validatePotentialUrl);
	}

	validatePotentialUrl(foundUrl: { url: string | undefined }) {
		var winningExtension = null;

		if (typeof foundUrl.url === 'undefined') {
			let imageTypeExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp'];
			imageTypeExtensions.forEach(element => {
				if (variablesUtils.potentialUrl?.search(element) != -1) {
					winningExtension = element;
				}
			});

			if (winningExtension) {
				foundUrl.url = variablesUtils.potentialUrl;
				variablesUtils.currentPreviewObject = variablesUtils.previewObjectList["image"];
			}
		}
	}

	getHtmlContent(url: string): string {

		const body = `<img src="${url}"></img>`;
		const mainHtml = `<!DOCTYPE html>
							<html lang="en">
								<head>
									<meta charset="UTF-8">
								</head>
								<body>${url ? body : '<h1 style="color: red;">NO URL</h1>'}</body>
							</html>`;

		return mainHtml;
	}

	makeMrkdownString(url: string): MarkdownString {
		url = url.trimLeft();
		let imageMarkdownString: MarkdownString;

		if (url != undefined && url.includes("http")) {
			imageMarkdownString = this.getImageMarkdownString(url);
		}
		else {
			imageMarkdownString = this.getLocalImageMarkdownString(url);
		}

		return imageMarkdownString;
	}

	getImageMarkdownString(url: string): MarkdownString {
		variablesUtils.hoverStringValue.value = `[Open In Browser](${url}) | 
		[Open Image In New Tab](${variablesUtils.commandUriNewTab})
		![image name](${url}|height=${200})`;

		return variablesUtils.hoverStringValue;
	}

	getLocalImageMarkdownString(url: string): MarkdownString {
		let explicitUrl;

		if (url.indexOf("file:///") == -1) //if there is no "file:///" (and it's local) concat it to the url
		{
			explicitUrl = makeExplicitPathFromRelative(url);
			url = "file:///" + explicitUrl;
			if (url.endsWith("/")) {
				url = url.substr(0, url.length - 1);
			}
		}
		//local markdown is a bit different
		variablesUtils.hoverStringValue.value = `[Open Image In New Tab](${url}) 
		![image name](${url}|height=${200})`;

		return variablesUtils.hoverStringValue;
	}
}