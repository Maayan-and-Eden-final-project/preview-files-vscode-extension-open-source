import cssObject from './cssObject';
//import {Uri, MarkdownString, commands, ExtensionContext} from 'vscode';
import * as utils from './utils';
import ValidateObject from './validationObject';
import IPreviewObject from './IPreviewObject';


describe('cssObject', () => {	
	it('Test constructor', () => {
		utils.variablesUtils.validateObject = new ValidateObject();
		jest.spyOn(utils.variablesUtils.validateObject,'addValidateFunction').mockImplementation(() => {})
		const instance = new cssObject();
		expect(utils.variablesUtils.validateObject.addValidateFunction).toHaveBeenCalledWith('css',instance.validatePotentialUrl);
	});

describe('validatePotentialUrl', () => {	

	it('should get css file', () => {
		utils.variablesUtils.validateObject = new ValidateObject();
		utils.variablesUtils.potentialUrl = "blabla.css";
		utils.variablesUtils.previewObjectList.css = {} as IPreviewObject
		const instance = new cssObject();
		const foundUrl = {url: undefined}
		instance.validatePotentialUrl(foundUrl)
		expect(foundUrl.url).toEqual(utils.variablesUtils.potentialUrl);
		expect(utils.variablesUtils.currentPreviewObject).toEqual(utils.variablesUtils.previewObjectList.css);
	});

	it('should do nothing when url is not undefined', () => {
		utils.variablesUtils.validateObject = new ValidateObject();
		utils.variablesUtils.potentialUrl = "blabla.css";
		const currentPreviewObject = utils.variablesUtils.currentPreviewObject = {} as IPreviewObject
		const instance = new cssObject();
		const url = 'shouldNotChange'
		const foundUrl = {url}
		instance.validatePotentialUrl(foundUrl)
		expect(foundUrl.url).toEqual(url);
		expect(utils.variablesUtils.currentPreviewObject).toEqual(currentPreviewObject);
	});
});
	
});