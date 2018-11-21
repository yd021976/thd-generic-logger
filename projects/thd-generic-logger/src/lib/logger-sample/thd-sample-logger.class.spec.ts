import { ThdLevels } from '../service/thd-levels.class';
import { ThdSampleLogger } from './thd-sample-logger.class';

describe('Logger logs', () => {
    let logger: ThdSampleLogger
    beforeEach(() => {
        logger = new ThdSampleLogger('test', '#000000', true, [ThdLevels.DATA, ThdLevels.ERROR, ThdLevels.INFO, ThdLevels.WARN], false, 0);
    })

    it('Should output data log', () => {
        spyOn(logger, 'outputToConsole');
        logger.data({ message: 'test', otherParams: [] });
        expect(logger.outputToConsole).toHaveBeenCalled()
    })
    it('Should output info log', () => {
        spyOn(logger, 'outputToConsole');
        logger.info({ message: 'test', otherParams: [] });
        expect(logger.outputToConsole).toHaveBeenCalled()
    })
    it('Should output warn log', () => {
        spyOn(logger, 'outputToConsole');
        logger.warn({ message: 'test', otherParams: [] });
        expect(logger.outputToConsole).toHaveBeenCalled()
    })
    it('Should output error log', () => {
        spyOn(logger, 'outputToConsole');
        logger.error({ message: 'test', otherParams: [] });
        expect(logger.outputToConsole).toHaveBeenCalled()
    })
})
describe('Logger levels filter and mute', () => {
    let logger: ThdSampleLogger
    let config = {
        color: "#000000",
        isDeveloppementMode: true,
        logLevels: [ThdLevels.DATA, ThdLevels.ERROR, ThdLevels.INFO, ThdLevels.WARN],
        mute: false,
        fixedWidth: 0
    }
    beforeEach(() => {
        logger = new ThdSampleLogger('test', '#000000', true, [ThdLevels.DATA, ThdLevels.ERROR, ThdLevels.INFO, ThdLevels.WARN], false, 0);
        logger.setConfig(config);
    })
    it('Should mute logger', () => {
        logger.mute(true);
        spyOn(logger, 'outputToConsole');
        logger.info({ message: 'test', otherParams: [] });
        expect(logger.outputToConsole).not.toHaveBeenCalled()
    })
    it('Should not output info message', () => {
        logger.setConfig({ ...config, logLevels: [ThdLevels.DATA, ThdLevels.ERROR, ThdLevels.WARN] }) // All levels EXCEPT info level
        spyOn(logger, 'outputToConsole');
        logger.info({ message: 'test', otherParams: [] });
        expect(logger.outputToConsole).not.toHaveBeenCalled()
    })
})