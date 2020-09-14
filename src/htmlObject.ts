import { variablesUtils, makeExplicitPathFromRelative, openFile } from './utils';
import { Uri, MarkdownString, commands, ExtensionContext } from 'vscode';
import IPreviewObject from './IPreviewObject';


export default class HtmlObject implements IPreviewObject {

    constructor() {
        variablesUtils.validateObject.addValidateFunction("html", this.validatePotentialUrl);
    }

    validatePotentialUrl(foundUrl: { url: string | undefined }) {
        if (typeof foundUrl.url === 'undefined') {
            if (variablesUtils.potentialUrl?.search(".html") != -1) {
                foundUrl.url = variablesUtils.potentialUrl;
                variablesUtils.currentPreviewObject = variablesUtils.previewObjectList["html"];
            }
        }
    }


    makeMrkdownString(url: string): MarkdownString {
        url = url.trimLeft();
        let imageMarkdownString: MarkdownString;

        if (url != undefined && url.includes("http")) {
            imageMarkdownString = this.getWebHtmlMarkdownString(url);
        }
        else {
            imageMarkdownString = this.getLocalHtmlMarkdownString(url);
        }

        return imageMarkdownString;
    }

    getHtmlContent(url: string): string {
        const body = `<iframe
        src='${url}' width=200 height=400 frameborder=0
        sandbox="allow-scripts">
        </iframe>`;
        const mainHtml = `<!DOCTYPE html>
							<html lang="en">
								<head>
									<meta charset="UTF-8">
                                </head>
                                <body>${url ? body : '<h1 style="color: red;">NO URL</h1>'}</body>
                
							</html>`;

        return mainHtml;
    }

    getLocalHtmlMarkdownString(url: string): MarkdownString {
        variablesUtils.hoverStringValue.value = `[Open Html File In New Tab](${variablesUtils.commandUriOpenHtmlFile})`;

        return variablesUtils.hoverStringValue;
    }

    getWebHtmlMarkdownString(url: string): MarkdownString {
        variablesUtils.hoverStringValue.value = `[Open In Browser](${url})
        [Open Html File In New Tab](${variablesUtils.commandUriNewTab})`;

        return variablesUtils.hoverStringValue;
    }

}

export function createHtmlFileEditorCommand(context: ExtensionContext): void {
    const htmlFileEditorCommand = 'previewHover.htmlFileEditorCommand';

    let htmlFileEditorCommandHandler = () => {
        openFile(String(variablesUtils.potentialUrl));
    };
    context.subscriptions.push(commands.registerCommand(htmlFileEditorCommand, htmlFileEditorCommandHandler));
    variablesUtils.commandUriOpenHtmlFile = Uri.parse('command:previewHover.htmlFileEditorCommand');
}
