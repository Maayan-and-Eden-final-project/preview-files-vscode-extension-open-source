
import { MarkdownString} from 'vscode';

export default interface IPreviewObject
{
	getHtmlContent(url: string): string;
	makeMrkdownString(url: string): MarkdownString;
	validatePotentialUrl(foundUrl: {url: string| undefined}): void;
};