import imageObject from './imageObject';
import * as utils from './utils';
import ValidateObject from './validationObject';
import IPreviewObject from './IPreviewObject';


describe('imageObject', () => {
    it('Test constructor', () => {
        utils.variablesUtils.validateObject = new ValidateObject();
        jest.spyOn(utils.variablesUtils.validateObject, 'addValidateFunction').mockImplementation(() => { })
        const instance = new imageObject();
        expect(utils.variablesUtils.validateObject.addValidateFunction).toHaveBeenCalledWith('image', instance.validatePotentialUrl);
    });

    describe('validatePotentialUrl', () => {

        it('should get image file', () => {
            utils.variablesUtils.validateObject = new ValidateObject();
            utils.variablesUtils.potentialUrl = "tiger.jpg";
            utils.variablesUtils.previewObjectList.image = {} as imageObject
            const instance = new imageObject();
            const foundUrl = { url: undefined }
            instance.validatePotentialUrl(foundUrl)
            expect(foundUrl.url).toEqual(utils.variablesUtils.potentialUrl);
            expect(utils.variablesUtils.currentPreviewObject).toEqual(utils.variablesUtils.previewObjectList.image);
        });

        it('should do nothing when url is not undefined', () => {
            utils.variablesUtils.validateObject = new ValidateObject();
            utils.variablesUtils.potentialUrl = "blabla.png";
            const currentPreviewObject = utils.variablesUtils.currentPreviewObject = {} as IPreviewObject
            const instance = new imageObject();
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
            const instance = new imageObject();
            const url = undefined;
            const foundUrl = { url }
            instance.validatePotentialUrl(foundUrl)
            expect(foundUrl.url).toEqual(url);
            expect(utils.variablesUtils.currentPreviewObject).toEqual(currentPreviewObject);
        });

        it('check potentialUrl is not image file', () => {
            utils.variablesUtils.validateObject = new ValidateObject();
            utils.variablesUtils.potentialUrl = "blabla.txt";
            const currentPreviewObject = utils.variablesUtils.currentPreviewObject = {} as IPreviewObject
            const instance = new imageObject();
            const url = undefined
            const foundUrl = { url }
            instance.validatePotentialUrl(foundUrl)
            expect(foundUrl.url).toEqual(url);
            expect(utils.variablesUtils.currentPreviewObject).toEqual(currentPreviewObject);
        });
    });

});