import { ThdAppLoggerService, ThdLoggerMessage } from './thd-app-logger.service';
import { ThdAppLoggerServiceConfig, ThdAppLoggerConfig } from '../config/thd-app-logger-config.class';
import { ThdLevels } from './thd-levels.class';
import { ThdAppLoggerAdapter } from '../logger-sample/thd-sample-logger-adapter';
import { ThdAppLoggerAdapterBase } from '../adapters/thd-app-logger-adapter-base.class';

describe('Service create logger adapter instances', () => {
    let service: ThdAppLoggerService
    let config: ThdAppLoggerServiceConfig = {
        defaultLoggerConfig: {
            color: "#000000",
            fixedWidth: 0,
            isDeveloppementMode: true,
            loggerConfig: {},
            logLevels: [ThdLevels.DATA],
            mute: false
        },
        loggerAdapter: ThdAppLoggerAdapter,
        onlyLoggers: [],
        serviceConfig: {
            isDeveloppementMode: true,
            logLevels: [ThdLevels.DATA]
        }
    }
    beforeEach(() => {
        service = new ThdAppLoggerService(config)
    })

    it('Should create logger adapter instance', () => {
        expect(service['instances'][service['serviceLoggerName']]).toBeDefined();
    })

    it('Should logger adapter is instance of AppLoggerAdapter', () => {
        expect(service['instances'][service['serviceLoggerName']] instanceof ThdAppLoggerAdapter).toBeTruthy()
    })

    it('Should create a new named logger', () => {
        let newLogger = service.createLogger('test');
        expect(service["instances"]['test']).toBeDefined()
    })
})

describe('Service main logger output all message types', () => {
    let logger: any;
    let service: ThdAppLoggerService
    let config: ThdAppLoggerServiceConfig = {
        defaultLoggerConfig: {
            color: "#000000",
            fixedWidth: 0,
            isDeveloppementMode: true,
            loggerConfig: {},
            logLevels: [ThdLevels.DATA],
            mute: false
        },
        loggerAdapter: ThdAppLoggerAdapter,
        onlyLoggers: [],
        serviceConfig: {
            isDeveloppementMode: true,
            logLevels: [ThdLevels.DATA, ThdLevels.INFO, ThdLevels.ERROR, ThdLevels.WARN]
        }
    }
    beforeEach(() => {
        service = new ThdAppLoggerService(config)
        logger = service['instances'][service['serviceLoggerName']];
    })

    it('Should output debug message', () => {
        spyOn(logger, "output");
        service.debug(null, { message: 'test', otherParams: [] });
        expect(logger.output).toHaveBeenCalled();
    })
    it('Should output info message', () => {
        spyOn(logger, "output");
        service.info(null, { message: 'test', otherParams: [] });
        expect(logger.output).toHaveBeenCalled();
    })
    it('Should output warn message', () => {
        spyOn(logger, "output");
        service.warn(null, { message: 'test', otherParams: [] });
        expect(logger.output).toHaveBeenCalled();
    })
    it('Should output error message', () => {
        spyOn(logger, "output");
        service.error(null, { message: 'test', otherParams: [] });
        expect(logger.output).toHaveBeenCalled();
    })
})

describe('Service main logger output only "info" message types', () => {
    let logger: any;
    let service: ThdAppLoggerService
    let config: ThdAppLoggerServiceConfig = {
        defaultLoggerConfig: {
            color: "#000000",
            fixedWidth: 0,
            isDeveloppementMode: true,
            loggerConfig: {},
            logLevels: [ThdLevels.DATA],
            mute: false
        },
        loggerAdapter: ThdAppLoggerAdapter,
        onlyLoggers: [],
        serviceConfig: {
            isDeveloppementMode: true,
            logLevels: [ThdLevels.INFO]
        }
    }
    beforeEach(() => {
        service = new ThdAppLoggerService(config)
        logger = service['instances'][service['serviceLoggerName']];
    })

    it('Should output debug message', () => {
        spyOn(logger, "output");
        service.debug(null, { message: 'test', otherParams: [] });
        expect(logger.output).not.toHaveBeenCalled();
    })
    it('Should output info message', () => {
        spyOn(logger, "output");
        service.info(null, { message: 'test', otherParams: [] });
        expect(logger.output).toHaveBeenCalled();
    })
    it('Should output warn message', () => {
        spyOn(logger, "output");
        service.warn(null, { message: 'test', otherParams: [] });
        expect(logger.output).not.toHaveBeenCalled();
    })
    it('Should output error message', () => {
        spyOn(logger, "output");
        service.error(null, { message: 'test', otherParams: [] });
        expect(logger.output).not.toHaveBeenCalled();
    })
})

describe('Service filter loggers and mute features tests', () => {
    let loggerAdapter: any, loggerAdapter2: any, loggerAdapter3: any;
    let service: ThdAppLoggerService
    let config: ThdAppLoggerServiceConfig = {
        defaultLoggerConfig: {
            color: "#000000",
            fixedWidth: 0,
            isDeveloppementMode: true,
            loggerConfig: {},
            logLevels: [ThdLevels.INFO],
            mute: false
        },
        loggerAdapter: ThdAppLoggerAdapter,
        onlyLoggers: [],
        serviceConfig: {
            isDeveloppementMode: true,
            logLevels: [ThdLevels.INFO]
        }
    }
    beforeEach(() => {
        loggerAdapter2 = undefined, loggerAdapter3 = undefined;
        service = new ThdAppLoggerService(config)
        loggerAdapter = service['instances'][service['serviceLoggerName']]; // Main service logger
        service.createLogger('test');
        service.createLogger('test2');
        loggerAdapter2 = service['instances']['test']; // another logger named "test"
        loggerAdapter3 = service['instances']['test2']; // another logger named "test"
        if (loggerAdapter2 === undefined || loggerAdapter3 === undefined) throw new Error('Logger2 is not created');
    })

    it('Should mute service logs type INFO from service logger', () => {
        let logger = loggerAdapter['logger'];
        spyOn(logger, 'info');
        service.mute(null, true);
        service.info(null, { message: 'test', otherParams: [] });
        expect(logger.info).not.toHaveBeenCalled()
    })
    it('Should mute service logs type INFO from TEST logger', () => {
        let logger = loggerAdapter2['logger'];
        spyOn(logger, 'info');
        service.mute('test', true);
        service.info('test', { message: 'test', otherParams: [] });
        expect(logger.info).not.toHaveBeenCalled()
    })
    it('Should apply logger filter and exclude TEST logger output', () => {
        let logger = loggerAdapter2['logger'];
        spyOn(logger, "info");
        service.onlyLoggers([service['serviceLoggerName']]);
        service.info('test', { message: 'test', otherParams: [] });
        expect(logger.info).not.toHaveBeenCalled();
    })
    it('Should apply logger filter with regex and output only loggers containing name TEST', () => {
        let logger = loggerAdapter['logger']
        spyOn(logger, 'info');
        service.onlyLoggers(['^test']);
        service.info(null, { message: 'test', otherParams: [] });
        expect(logger.info).not.toHaveBeenCalled();
    })
})

describe('Service configuration changes at runtime', () => {
    class fakeLogger {
        output(...args) {
            return true;
        }
    }
    class fakeAdapter extends ThdAppLoggerAdapterBase<fakeLogger> {
        protected config: ThdAppLoggerConfig;
        protected logger: fakeLogger; // logger instance
        constructor(public name: string, config: ThdAppLoggerConfig) {
            super()
            this.logger = new fakeLogger();
        }
        public setConfig(config: ThdAppLoggerConfig): void { }
        public getConfig() { }
        public mute(mute: boolean): void { }
        public data(message: ThdLoggerMessage): void { }
        public info(message: ThdLoggerMessage): void { }
        public warn(message: ThdLoggerMessage): void { }
        public error(message: ThdLoggerMessage): void { }
        public output(message: ThdLoggerMessage, outputLevel: ThdLevels, loggerCallBack: string): void {
            this.logger.output();
        }
    }

    let loggerAdapter: any = undefined, loggerAdapter2: any = undefined, loggerAdapter3: any = undefined;
    let service: ThdAppLoggerService
    let config: ThdAppLoggerServiceConfig = {
        defaultLoggerConfig: {
            color: "#000000",
            fixedWidth: 0,
            isDeveloppementMode: true,
            loggerConfig: {},
            logLevels: [ThdLevels.INFO],
            mute: false
        },
        loggerAdapter: ThdAppLoggerAdapter,
        onlyLoggers: [],
        serviceConfig: {
            isDeveloppementMode: true,
            logLevels: [ThdLevels.INFO]
        }
    }
    beforeEach(() => {
        loggerAdapter = undefined, loggerAdapter2 = undefined, loggerAdapter3 = undefined
        service = new ThdAppLoggerService(config)
        loggerAdapter = service['instances'][service['serviceLoggerName']]; // Main service logger
        if (loggerAdapter === undefined) throw new Error('Logger2 is not created');
    })
    it('Should create logger of type FakeAdapter', () => {
        let newConfig: ThdAppLoggerServiceConfig = { ...config, loggerAdapter: fakeAdapter }
        service.setConfig(newConfig);
        service.createLogger('test'); // Should create adapter instance of FakeAdapter
        loggerAdapter2 = service['instances']['test'];
        expect(loggerAdapter2 instanceof fakeAdapter).toBeTruthy();
    })
    it('Should filter logger by name starting with \'test\' and output nothing', () => {
        // Set new service config
        let newConfig: ThdAppLoggerServiceConfig = { ...config, onlyLoggers: ['^test'] } // We want only loggers with name starting with "test" to output
        newConfig.serviceConfig = { ...newConfig.serviceConfig, logLevels: [ThdLevels.INFO] } // Ensure we log info level

        service.setConfig(newConfig);
        spyOn(loggerAdapter['logger'], 'info');
        service.info(null, { message: 'test', otherParams: [] });

        // The default service logger should not have been called since it's name doesn't start with "test"
        expect(loggerAdapter['logger'].info).not.toHaveBeenCalled()
    })

    it('Should mute all except errors when setting developement mode to false',()=>{
        // Set new service config
        let newConfig: ThdAppLoggerServiceConfig = { ...config}
        newConfig.serviceConfig = { ...newConfig.serviceConfig, logLevels: [ThdLevels.INFO],isDeveloppementMode:false } // Ensure we log info level
        service.setConfig(newConfig);
        spyOn(loggerAdapter['logger'], 'info');
        service.info(null, { message: 'test', otherParams: [] });

        // The default service logger should not have been called since "developement mode" is false
        expect(loggerAdapter['logger'].info).not.toHaveBeenCalled()
    })
})