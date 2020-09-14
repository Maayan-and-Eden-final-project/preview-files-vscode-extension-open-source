import IPreviewObject from './IPreviewObject';
import { variablesUtils, openFile } from './utils';
import { MarkdownString, ExtensionContext, commands, Uri } from 'vscode';

export default class TextObject implements IPreviewObject {

	constructor() {
		variablesUtils.validateObject.addValidateFunction("text", this.validatePotentialUrl);
	}

	validatePotentialUrl(foundUrl: { url: string | undefined }) {
		if (typeof foundUrl.url === 'undefined' && variablesUtils.potentialUrl != undefined) {

			if (variablesUtils.potentialUrl.includes(".txt")) {
				foundUrl.url = variablesUtils.potentialUrl;
				variablesUtils.currentPreviewObject = variablesUtils.previewObjectList["text"];
			}
		}
	}

	getHtmlContent(url: string): string {
		return "";
	}

	makeMrkdownString(url: string): MarkdownString {
		variablesUtils.hoverStringValue.value = `[Open Text File In New Tab](${variablesUtils.commandUriOpenTextFile})`;

		return variablesUtils.hoverStringValue;
	}
}

export function createTextFileEditorCommand(context: ExtensionContext): void {
	const textFileEditorCommand = 'previewHover.textFileEditorCommand';

	let textFileEditorCommandHandler = () => {
		openFile(String(variablesUtils.potentialUrl));
	};
	context.subscriptions.push(commands.registerCommand(textFileEditorCommand, textFileEditorCommandHandler));
	variablesUtils.commandUriOpenTextFile = Uri.parse('command:previewHover.textFileEditorCommand');
}




