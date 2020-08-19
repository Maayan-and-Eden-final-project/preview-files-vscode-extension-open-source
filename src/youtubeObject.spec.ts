import youtubeObject from './youtubeObject';
import * as utils from './utils';
import ValidateObject from './validationObject';
import IPreviewObject from './IPreviewObject'

describe('youtubeObject', () => {
    it('Test constructor', () => {
        utils.variablesUtils.validateObject = new ValidateObject();
        jest.spyOn(utils.variablesUtils.validateObject, 'addValidateFunction').mockImplementation(() => { })
        const instance = new youtubeObject();
        expect(utils.variablesUtils.validateObject.addValidateFunction).toHaveBeenCalledWith('youtube', instance.validatePotentialUrl);
    });

    describe('validatePotentialUrl', () => {

        it('should get youtube url', () => {
            utils.variablesUtils.validateObject = new ValidateObject();
            utils.variablesUtils.potentialUrl = "https://www.youtube.com/watch?v=xUPMcmns3DE&list=RDMMxUPMcmns3DE&start_radio=1";
            utils.variablesUtils.previewObjectList.youtube = {} as youtubeObject
            const instance = new youtubeObject();
            const foundUrl = { url: undefined }
            instance.validatePotentialUrl(foundUrl)
            expect(foundUrl.url).toEqual(utils.variablesUtils.potentialUrl);
            expect(utils.variablesUtils.currentPreviewObject).toEqual(utils.variablesUtils.previewObjectList.youtube);
        });

        it('should do nothing when url is not undefined', () => {
            utils.variablesUtils.validateObject = new ValidateObject();
            utils.variablesUtils.potentialUrl = "https://www.youtube.com/watch?v=xUPMcmns3DE&list=RDMMxUPMcmns3DE&start_radio=1";
            const currentPreviewObject = utils.variablesUtils.currentPreviewObject = {} as IPreviewObject
            const instance = new youtubeObject();
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
            const instance = new youtubeObject();
            const url = undefined;
            const foundUrl = { url }
            instance.validatePotentialUrl(foundUrl)
            expect(foundUrl.url).toEqual(utils.variablesUtils.potentialUrl);
            expect(utils.variablesUtils.currentPreviewObject).toEqual(currentPreviewObject);
        });

        it('check potentialUrl is not youtube url', () => {
            utils.variablesUtils.validateObject = new ValidateObject();
            utils.variablesUtils.potentialUrl = "blabla.txt";
            const currentPreviewObject = utils.variablesUtils.currentPreviewObject = {} as IPreviewObject
            const instance = new youtubeObject();
            const url = undefined
            const foundUrl = { url }
            instance.validatePotentialUrl(foundUrl)
            expect(foundUrl.url).toEqual(url);
            expect(utils.variablesUtils.currentPreviewObject).toEqual(currentPreviewObject);

        });
    });

});