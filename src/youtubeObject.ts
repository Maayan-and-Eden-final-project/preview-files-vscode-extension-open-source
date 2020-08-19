import { variablesUtils } from './utils';
import { MarkdownString } from 'vscode';
import IPreviewObject from './IPreviewObject';

export default class YouTubeObject implements IPreviewObject{

	constructor(){
		variablesUtils.validateObject.addValidateFunction("youtube", this.validatePotentialUrl);
	}

	validatePotentialUrl(foundUrl: {url: string| undefined})
	{
		if(typeof foundUrl.url === 'undefined' && variablesUtils.potentialUrl != undefined){
	
			if(variablesUtils.potentialUrl.includes("youtu")) //url may contain "youtube" or "youtu.be"
			{
				foundUrl.url = variablesUtils.potentialUrl;
				variablesUtils.currentPreviewObject = variablesUtils.previewObjectList["youtube"];
			}
		}
	}

	extractYouTubeIdFromUrl(url: string ): string | undefined
	{
		let urlId = undefined;
		let regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
		let match = url.match(regExp);
		if(match)
		{
			urlId = match[7].toString();
		}
		return urlId;
	}

	getHtmlContent(url: string): string
	{
		return "";
	}

	makeMrkdownString(url: string): MarkdownString
	{
		url=url.trimLeft();
		let videoId = this.extractYouTubeIdFromUrl(url);
		let videoThumbnail = `https://img.youtube.com/vi/${videoId}/1.jpg`; 
		variablesUtils.hoverStringValue.value = `[Open YouTube Video In Browser](${url}) 
		![image name](${videoThumbnail})`;

		return variablesUtils.hoverStringValue; 
	}
}
