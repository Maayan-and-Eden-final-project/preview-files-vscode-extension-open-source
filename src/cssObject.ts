import { variablesUtils, makeExplicitPathFromRelative, openFile} from './utils';
import { Uri, MarkdownString, commands, ExtensionContext  } from 'vscode';
import IPreviewObject from './IPreviewObject';


export default class CssObject implements IPreviewObject{

	constructor(){
		variablesUtils.validateObject.addValidateFunction("css", this.validatePotentialUrl);
	}

	validatePotentialUrl(foundUrl: {url: string| undefined})
	{
		if(typeof foundUrl.url === 'undefined')
		{
			if(variablesUtils.potentialUrl?.search(".css") != -1)
			{
				foundUrl.url = variablesUtils.potentialUrl;
				variablesUtils.currentPreviewObject = variablesUtils.previewObjectList["css"];
			}
		}
	}

	getHtmlContent(url: string): string{
		return "";
	}

	makeMrkdownString(url: string): MarkdownString
	{
		variablesUtils.hoverStringValue.value = `[Open Css File In New Tab](${variablesUtils.commandUriOpenCssFile})`;

		return variablesUtils.hoverStringValue; 
    }
    
}

export function createCssFileEditorCommand(context: ExtensionContext): void
{
	const cssFileEditorCommand = 'previewHover.cssFileEditorCommand'; 

	let cssFileEditorCommandHandler = () => {
		openFile(String(variablesUtils.potentialUrl));
	  };
	context.subscriptions.push(commands.registerCommand(cssFileEditorCommand, cssFileEditorCommandHandler));
	variablesUtils.commandUriOpenCssFile = Uri.parse('command:previewHover.cssFileEditorCommand');	
}
