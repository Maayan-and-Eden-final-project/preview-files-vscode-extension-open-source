
import ValidateObject from './validationObject';
import IPreviewObject from './IPreviewObject';
import { workspace, TextDocument, MarkdownString, Uri, ExtensionContext, TextEditor, window, commands, ViewColumn } from 'vscode';

const whiteSpaceRegex = /\s/g;

/** 
* @hoverStringValue - a static variable of the type vscode.MarkdownString.
we use it to update the current markdown string value.
It is used in the makeMrkdownString functions (an interface function).

* @previewObjectList - a static "dictionary" with a string key and a IPreviewObject value.
It is used to hold one instans of each format object (ImageObject, YoutubeObject...).
We use it to update the currentPreviewObject variable in the validatePotentialUrl functions (an interface function).
We also use it in the initializePreviewObjectList function, which create the instances of the objects.
All features must "register" to this dictionary by adding themselves to the initializePreviewObjectList function (like we showed)
and updating the currentPreviewObject once it was validated as the relevant format.

* @currentPreviewObject - a static variable of the type IPreviewObject. 
It is used to hold the current validated format object. 
For example, if it was veriefied the current URL is an image then the currentPreviewObject 
will be updated to the ImageObject instance in the previewObjectList["image"] (the updating accure in the validatePotentialUrl function).

* @validateObject - a static variable of the type ValidateObject. 
It is used to add and remove functions from the validateFunctionArray variable. 
The ValidateObject is used similarly to the C# delegate concept. 
It has a "dictionary" member with a string as key and a function with a signature validatePotentialUrl(foundUrl: {url: string| undefined}) : void as a value.
This mamber is a private member so no one outside this class will have direct access to the dictionary. 
We added functions to add a new signature function to the dictionary or remove one.

* @potentialUrl - a string which holds the extracted line the cursor is standing on
(the extraction accures in getPotentialUrl function in the extension.ts file).
We use it in the validatePotentialUrl functions, and if it was veriefied as the right format,
we update the foundUrl.url (sent as parameter to the validatePotentialUrl function).
The potentialUrl is updated in the extractCurrentLine function each time the cursor moves.

* @commandUriNewTab ,@commandUriOpenCssFile , @commandUriOpenTextFile - uri variables which holds the uri to the commands we registered.
commandUriNewTab is activated when clicking on "open in new tab command" on image format markdown.
commandUriOpenCssFile is called when clicking on "open css in new tab" button.
commandUriOpenTextFile is called when clicking on "open text in new tab" button. 
*/

export class variablesUtils {
	static hoverStringValue: MarkdownString;
	static previewObjectList: { [id: string]: IPreviewObject } = {};
	static currentPreviewObject: IPreviewObject;
	static validateObject: ValidateObject;
	static potentialUrl: string | undefined;
	static commandUriNewTab: Uri;
	static commandUriOpenCssFile: Uri;
	static commandUriOpenTextFile: Uri;
}


export function openFile(url: string) {
	if (url.indexOf("http") != -1) {
		// TODO: should be implemented
	}
	else {
		let filePath = makeExplicitPathFromRelative(url);
		if (filePath) {
			let fileUri = Uri.file(filePath);
			workspace.openTextDocument(fileUri).then((a: TextDocument) => {
				window.showTextDocument(a, ViewColumn.Beside, false);
			}, (error: any) => {
				console.error(error);
			});
		}
	}
}

export function makeExplicitPathFromRelative(url: string): string | undefined {
	let currentPath = window.activeTextEditor?.document.uri.path;
	currentPath = currentPath?.substr(1);
	let splitPathByFolders = currentPath?.split(/[\/]/);
	let splitUrlByFolders = url.split(/[/\\\\]/);

	if (splitUrlByFolders.length == 1) //the file is in the current folder
	{
		if (splitPathByFolders) { splitPathByFolders[splitPathByFolders?.length - 1] = splitUrlByFolders[0]; }

	}
	else if (splitUrlByFolders.length == 2) // the file is in another folder inside the current folder
	{
		if (splitUrlByFolders[0] == "..") // the file is located in the folder one level up from the current folder
		{
			if (splitPathByFolders) {
				splitPathByFolders[splitPathByFolders?.length - 1] = "";
				splitPathByFolders[splitPathByFolders?.length - 2] = splitUrlByFolders[1];
			}
		}
		else {
			if (splitPathByFolders) { splitPathByFolders[splitPathByFolders?.length - 1] = splitUrlByFolders[0]; }
			splitPathByFolders?.push(splitUrlByFolders[1]);
		}
	}

	let explicitPath = splitPathByFolders?.join("/");
	if (explicitPath == currentPath) {
		explicitPath = url;
	}
	return explicitPath;
}

export function createNewTabCommand(context: ExtensionContext): void {
	const newTabCommand = 'previewHover.newTabCommand';

	let newTabCommandHandler = () => {
		const panel = window.createWebviewPanel(
			'preview',
			'Image preview',
			ViewColumn.Beside,
			{}
		);
		panel.webview.html = variablesUtils.currentPreviewObject.getHtmlContent(String(variablesUtils.potentialUrl));
	};
	context.subscriptions.push(commands.registerCommand(newTabCommand, newTabCommandHandler));
	variablesUtils.commandUriNewTab = Uri.parse('command:previewHover.newTabCommand');
}

export function getPotentialUrl(editor: TextEditor | undefined): string | undefined {
	let foundUrl = { url: undefined };

	if (editor) {
		let text = editor.document.getText();
		let currentPosition = editor.document.offsetAt(editor.selection.anchor);
		extractCurrentLine(text, currentPosition);
		variablesUtils.validateObject.invokeValidationFunctions(foundUrl);
	}

	return foundUrl.url;
}

export function extractCurrentLine(text: string, selStart: number) {
	let rightSubstr = text.substring(selStart, text.length);
	let leftSubstr = text.substring(0, selStart);
	let singleQuote = "\'";
	let Apostrophe = "\"";
	let leftBarrier;
	let rightBarrier;
	let barriersList = new Array(singleQuote, Apostrophe);
	let lineBetweenBarriers;

	barriersList.forEach(element => {
		leftBarrier = leftSubstr.lastIndexOf(element);
		rightBarrier = rightSubstr.indexOf(element);

		if (leftBarrier != -1 && rightBarrier != -1) {
			lineBetweenBarriers = leftSubstr.substr(leftBarrier + 1) + rightSubstr.substring(0, rightBarrier);

			if (lineBetweenBarriers.search(/[\n\t]/) == -1) {
				variablesUtils.potentialUrl = lineBetweenBarriers;
			}
		}
	});

	if (variablesUtils.potentialUrl != lineBetweenBarriers || (variablesUtils.potentialUrl == undefined && lineBetweenBarriers == undefined)) {
		leftBarrier = getLastIndexOfWhiteSpace(leftSubstr);
		rightBarrier = getFirstIndexOfWhiteSpace(rightSubstr);

		if (leftBarrier != undefined && rightBarrier != undefined) { lineBetweenBarriers = leftSubstr.substr(leftBarrier) + rightSubstr.substring(0, rightBarrier); }
		else if (leftBarrier == undefined) { lineBetweenBarriers = leftSubstr + rightSubstr.substring(0, rightBarrier); }
		else { lineBetweenBarriers = leftSubstr.substr(leftBarrier) + rightSubstr; }

		variablesUtils.potentialUrl = lineBetweenBarriers;
	}

}

export function getFirstIndexOfWhiteSpace(str: string): number | undefined {
	let foundRegxArray;
	foundRegxArray = whiteSpaceRegex.exec(str);
	return foundRegxArray?.index;
}

export function getLastIndexOfWhiteSpace(str: string): number | undefined {
	let foundRegxArray;
	let lastIndex;

	while ((foundRegxArray = whiteSpaceRegex.exec(str)) != null) {
		lastIndex = whiteSpaceRegex.lastIndex;
	}
	return lastIndex;


}


