// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import ImageObject from './imageObject';
import CssObject, { createCssFileEditorCommand } from './cssObject';
import YouTubeObject from './youtubeObject';
import ValidateObject from './validationObject';
import TextObject, { createTextFileEditorCommand } from './textObject';
import { Hover, Position, Range, Disposable, TextDocument, languages, MarkdownString, window, commands, ExtensionContext } from 'vscode';
import { variablesUtils, createNewTabCommand, getPotentialUrl } from './utils';

/** 
* @hoverPanel - a variable of type vscode.Hover (in the extension.ts file).
It is used in the extension.ts file to show the markdown when hovering over a validated URL.
We update the content of the hover panel to the hoverStringValue.
*/


let hoverPanel: Hover;
let dis: Disposable;

export function activate(context: ExtensionContext) {

	let editor = window.activeTextEditor;
	variablesUtils.validateObject = new ValidateObject();

	initializePreviewObjectList();
	createNewTabCommand(context);
	createCssFileEditorCommand(context);
	createTextFileEditorCommand(context);
	variablesUtils.potentialUrl = getPotentialUrl(editor);
	variablesUtils.hoverStringValue = new MarkdownString("", true);
	variablesUtils.hoverStringValue.isTrusted = true;

	if (typeof variablesUtils.potentialUrl != 'undefined') {
		variablesUtils.hoverStringValue = variablesUtils.currentPreviewObject.makeMrkdownString(variablesUtils.potentialUrl);
	}

	if (typeof hoverPanel === 'undefined') {
		hoverPanel = new Hover(variablesUtils.hoverStringValue);
	}
	else {
		hoverPanel.contents[0] = variablesUtils.hoverStringValue;
	}

	context.subscriptions.push(commands.registerCommand('extension.previewHover', function () {
		variablesUtils.potentialUrl = getPotentialUrl(editor);
		dis = languages.registerHoverProvider(['*'], {
			provideHover(_document: TextDocument, _position: Position, token) {
				hoverPanel.range = new Range(_position, _position);
				let cursorPosition = window.activeTextEditor?.selection.start.line;
				if (hoverPanel.range.start.line != cursorPosition) {
					hoverPanel.contents[0] = "";
				}
				else {
					updateHoverPanel();
				}
				return hoverPanel;
			}
		});
	}));

	context.subscriptions.push(window.onDidChangeActiveTextEditor(updateHoverPanel));
	context.subscriptions.push(window.onDidChangeTextEditorSelection(updateHoverPanel));
	updateHoverPanel();
}

function initializePreviewObjectList() {
	variablesUtils.previewObjectList["image"] = new ImageObject();
	variablesUtils.previewObjectList["css"] = new CssObject();
	variablesUtils.previewObjectList["youtube"] = new YouTubeObject();
	variablesUtils.previewObjectList["text"] = new TextObject();
	variablesUtils.currentPreviewObject = variablesUtils.previewObjectList["image"];
}

function updateHoverPanel(): void {
	let currUrl = getPotentialUrl(window.activeTextEditor);

	if (currUrl != undefined) {
		variablesUtils.potentialUrl = currUrl;
		hoverPanel.contents[0] = variablesUtils.currentPreviewObject.makeMrkdownString(variablesUtils.potentialUrl);
	}
	else if (currUrl == undefined) {
		variablesUtils.potentialUrl = currUrl;
		hoverPanel.contents[0] = "";
	}
}