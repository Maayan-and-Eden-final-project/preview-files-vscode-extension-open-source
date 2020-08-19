import textObject from './textObject';
import * as utils from './utils';
import ValidateObject from './validationObject';
import IPreviewObject from './IPreviewObject'

describe('textObject', () => {
    it('Test constructor', () => {
        utils.variablesUtils.validateObject = new ValidateObject();
        jest.spyOn(utils.variablesUtils.validateObject, 'addValidateFunction').mockImplementation(() => { })
        const instance = new textObject();
        expect(utils.variablesUtils.validateObject.addValidateFunction).toHaveBeenCalledWith('text', instance.validatePotentialUrl);
    });

    describe('validatePotentialUrl', () => {

        it('should get text file', () => {
            utils.variablesUtils.validateObject = new ValidateObject();
            utils.variablesUtils.potentialUrl = "textfiletest.txt";
            utils.variablesUtils.previewObjectList.text = {} as textObject
            const instance = new textObject();
            const foundUrl = { url: undefined }
            instance.validatePotentialUrl(foundUrl)
            expect(foundUrl.url).toEqual(utils.variablesUtils.potentialUrl);
            expect(utils.variablesUtils.currentPreviewObject).toEqual(utils.variablesUtils.previewObjectList.text);
        });

        it('should do nothing when url is not undefined', () => {
            utils.variablesUtils.validateObject = new ValidateObject();
            utils.variablesUtils.potentialUrl = "textfiletest.txt";
            const currentPreviewObject = utils.variablesUtils.currentPreviewObject = {} as IPreviewObject
            const instance = new textObject();
            const url = 'shouldNotChange'
            const foundUrl = { url }
            instance.validatePotentialUrl(foundUrl)
            expect(foundUrl.url).toEqual(url);
            expect(utils.variablesUtils.currentPreviewObject).toEqual(currentPreviewObject);
        });

        it('check potentialUrl and foundUrl is empty', () => {
            utils.variablesUtils.validateObject = new ValidateObject();
            utils.variablesUtils.potentialUrl = undefined;
            const currentPreviewObject = utils.variablesUtils.currentPreviewObject = {} as IPreviewObject
            const instance = new textObject();
            const url = undefined;
            const foundUrl = { url }
            instance.validatePotentialUrl(foundUrl)
            expect(foundUrl.url).toEqual(url);
            expect(utils.variablesUtils.currentPreviewObject).toEqual(currentPreviewObject);
        });

        it('check potentialUrl is not text file', () => {
            utils.variablesUtils.validateObject = new ValidateObject();
            utils.variablesUtils.potentialUrl = "blabla.css";
            const currentPreviewObject = utils.variablesUtils.currentPreviewObject = {} as IPreviewObject
            const instance = new textObject();
            const url = undefined
            const foundUrl = { url }
            instance.validatePotentialUrl(foundUrl)
            expect(foundUrl.url).toEqual(url);
            expect(utils.variablesUtils.currentPreviewObject).toEqual(currentPreviewObject);

        });
    });

});