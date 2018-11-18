import { ThdAppLoggerAdapter } from './thd-sample-logger-adapter';
import { ThdLevels } from '../service/thd-levels.class';
import { ThdAppLoggerConfig } from '../config/thd-app-logger-config.class';

describe('Logger adapter with developpement mode set to true', () => {
    let loggerAdapter: ThdAppLoggerAdapter = null;
    let logger: any;
    let config = {
        color: "#000000",
        isDeveloppementMode: true,
        logLevels: [ThdLevels.DATA, ThdLevels.ERROR, ThdLevels.INFO, ThdLevels.WARN],
        mute: false,
        fixedWidth: 0
    }
    beforeEach(() => {
        loggerAdapter = new ThdAppLoggerAdapter('test', config);
        logger = loggerAdapter['logger'];
    })
    it('Should create logger adapter instance', () => {
        expect(loggerAdapter).toBeDefined();
    })

    it('Should have create a logger instance', () => {
        expect(logger).toBeDefined();
    })
    it('Should call adapter output method', () => {
        spyOn(loggerAdapter, "output");
        loggerAdapter.data({ message: 'Test', otherParams: [] });
        expect(loggerAdapter.output).toHaveBeenCalled();
    })
    it('Should call logger data method', () => {
        spyOn(logger, "data");
        loggerAdapter.data({ message: 'Test', otherParams: [] });
        expect(logger.data).toHaveBeenCalled();
    })
    it('Should call logger info method', () => {
        spyOn(logger, "info");
        loggerAdapter.info({ message: 'Test', otherParams: [] });
        expect(logger.info).toHaveBeenCalled();
    })
    it('Should call logger warn method', () => {
        spyOn(logger, "warn");
        loggerAdapter.warn({ message: 'Test', otherParams: [] });
        expect(logger.warn).toHaveBeenCalled();
    })
    it('Should call logger error method', () => {
        spyOn(logger, "error");
        loggerAdapter.error({ message: 'Test', otherParams: [] });
        expect(logger.error).toHaveBeenCalled();
    })
    it('Should mute logger with mute method', () => {
        loggerAdapter.mute(true);
        spyOn(loggerAdapter['logger'], "error");
        loggerAdapter.error({ message: 'Test', otherParams: [] });
        expect(loggerAdapter['logger'].error).not.toHaveBeenCalled();
    })
})

describe('Logger adapter with developpement mode set to false', () => {
    let loggerAdapter: ThdAppLoggerAdapter = null;
    let logger: any;
    let config = {
        color: "#000000",
        isDeveloppementMode: false,
        logLevels: [ThdLevels.DATA, ThdLevels.ERROR, ThdLevels.INFO, ThdLevels.WARN],
        mute: false,
        fixedWidth: 0
    }
    beforeEach(() => {
        loggerAdapter = new ThdAppLoggerAdapter('test', config);
        logger = loggerAdapter['logger'];
    })
    it('Should mute "info" levels', () => {
        spyOn(logger, "info");
        loggerAdapter.info({ message: 'Test', otherParams: [] });
        expect(logger.info).not.toHaveBeenCalled();
    })

    it('Should output "error" levels', () => {
        spyOn(logger, "error");
        loggerAdapter.error({ message: 'Test', otherParams: [] });
        expect(logger.error).toHaveBeenCalled();
    })
})
describe('Logger adapter change config at runtime', () => {
    let loggerAdapter: ThdAppLoggerAdapter = null;
    let logger: any;
    let config = {
        color: "#000000",
        isDeveloppementMode: true,
        logLevels: [ThdLevels.DATA, ThdLevels.ERROR, ThdLevels.INFO, ThdLevels.WARN],
        mute: false,
        fixedWidth: 0
    }
    beforeEach(() => {
        loggerAdapter = new ThdAppLoggerAdapter('test', config);
        logger = loggerAdapter['logger'];
    })
    it('Should disable developpement mode and output error', () => {
        let newConfig: ThdAppLoggerConfig = { ...config, isDeveloppementMode: false }
        loggerAdapter.setConfig(newConfig);
        spyOn(logger, "error");
        loggerAdapter.error({ message: 'Test', otherParams: [] });
        expect(logger.error).toHaveBeenCalled();
    })

    it('Should disable developpement mode and mute info level', () => {
        let newConfig: ThdAppLoggerConfig = { ...config, isDeveloppementMode: false }
        loggerAdapter.setConfig(newConfig);
        spyOn(logger, "info");
        loggerAdapter.info({ message: 'Test', otherParams: [] });
        expect(logger.info).not.toHaveBeenCalled();
    })
    it('Should mute info logs', () => {
        let newConfig: ThdAppLoggerConfig = { ...config, mute: true }
        loggerAdapter.setConfig(newConfig);
        spyOn(logger, "info");
        loggerAdapter.info({ message: 'Test', otherParams: [] });
        expect(logger.info).not.toHaveBeenCalled();
    })
    it('Should mute data logs', () => {
        let newConfig: ThdAppLoggerConfig = { ...config, mute: true }
        loggerAdapter.setConfig(newConfig);
        spyOn(logger, "data");
        loggerAdapter.data({ message: 'Test', otherParams: [] });
        expect(logger.data).not.toHaveBeenCalled();
    })
    it('Should mute warn logs', () => {
        let newConfig: ThdAppLoggerConfig = { ...config, mute: true }
        loggerAdapter.setConfig(newConfig);
        spyOn(logger, "warn");
        loggerAdapter.warn({ message: 'Test', otherParams: [] });
        expect(logger.warn).not.toHaveBeenCalled();
    })
    it('Should mute error logs', () => {
        let newConfig: ThdAppLoggerConfig = { ...config, mute: true }
        loggerAdapter.setConfig(newConfig);
        spyOn(logger, "error");
        loggerAdapter.error({ message: 'Test', otherParams: [] });
        expect(logger.error).not.toHaveBeenCalled();
    })

    it('Should change config instance', () => {
        let newConfig: ThdAppLoggerConfig = { ...config, mute: true }
        loggerAdapter.setConfig(newConfig);
        let getConfig = loggerAdapter.getConfig();
        expect(getConfig).not.toBe(config);
    })
})