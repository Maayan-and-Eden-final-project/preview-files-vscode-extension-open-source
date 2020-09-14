import htmlObject from './htmlObject';
import * as utils from './utils';
import ValidateObject from './validationObject';
import IPreviewObject from './IPreviewObject';


describe('htmlObject', () => {
    it('Test constructor', () => {
        utils.variablesUtils.validateObject = new ValidateObject();
        jest.spyOn(utils.variablesUtils.validateObject, 'addValidateFunction').mockImplementation(() => { })
        const instance = new htmlObject();
        expect(utils.variablesUtils.validateObject.addValidateFunction).toHaveBeenCalledWith('html', instance.validatePotentialUrl);
    });

    describe('validatePotentialUrl', () => {

        it('should get html file', () => {
            utils.variablesUtils.validateObject = new ValidateObject();
            utils.variablesUtils.potentialUrl = "blabla.html";
            utils.variablesUtils.previewObjectList.html = {} as htmlObject
            const instance = new htmlObject();
            const foundUrl = { url: undefined }
            instance.validatePotentialUrl(foundUrl)
            expect(foundUrl.url).toEqual(utils.variablesUtils.potentialUrl);
            expect(utils.variablesUtils.currentPreviewObject).toEqual(utils.variablesUtils.previewObjectList.html);
        });

        it('should do nothing when url is not undefined', () => {
            utils.variablesUtils.validateObject = new ValidateObject();
            utils.variablesUtils.potentialUrl = "blabla.html";
            const currentPreviewObject = utils.variablesUtils.currentPreviewObject = {} as IPreviewObject
            const instance = new htmlObject();
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
            const instance = new htmlObject();
            const url = undefined;
            const foundUrl = { url }
            instance.validatePotentialUrl(foundUrl)
            expect(foundUrl.url).toEqual(url);
            expect(utils.variablesUtils.currentPreviewObject).toEqual(currentPreviewObject);
        });

        it('check potentialUrl is not html file', () => {
            utils.variablesUtils.validateObject = new ValidateObject();
            utils.variablesUtils.potentialUrl = "blabla.txt";
            const currentPreviewObject = utils.variablesUtils.currentPreviewObject = {} as IPreviewObject
            const instance = new htmlObject();
            const url = undefined
            const foundUrl = { url }
            instance.validatePotentialUrl(foundUrl)
            expect(foundUrl.url).toEqual(url);
            expect(utils.variablesUtils.currentPreviewObject).toEqual(currentPreviewObject);

        });
    });

});