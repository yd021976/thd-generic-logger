import { ThdLevels } from '../service/thd-levels.class';
import { contain } from '../utils/thd-app-logger-utils';
import { ThdSampleLogger } from './thd-sample-logger.class';
import { ThdAppLoggerConfig } from '../config/thd-app-logger-config.class';
import { ThdLoggerMessage } from '../service/thd-app-logger.service';
import { ThdAppLoggerAdapterBase } from '../adapters/thd-app-logger-adapter-base.class';



/**
 * Module default Logger adapter
 */
export class ThdAppLoggerAdapter extends ThdAppLoggerAdapterBase<ThdSampleLogger> {
    protected logger: ThdSampleLogger;
    protected config: ThdAppLoggerConfig;

    constructor(
        public name: string,
        config: ThdAppLoggerConfig
    ) {
        super();
        this.logger = new ThdSampleLogger(name, config.color, config.isDeveloppementMode, config.logLevels, config.mute, config.fixedWidth);
        this.setConfig({...config}); // Ensure we have a new config instance
    }

    /**
     * 
     */
    public setConfig(config: ThdAppLoggerConfig): void {
        this.config = config;
        this.logger.setConfig(config);
    }
    public getConfig(): ThdAppLoggerConfig {
        return this.config;
    }
    public mute(state: boolean) {
        this.config.mute = state;
        this.logger.mute(state);
    }
    /**
     * Logs message and data with the level=data
     * @param message The message
     * @param otherParams Additional parameters
     */
    data(message: ThdLoggerMessage) {
        // this.logger.data(message);
        this.output(message, ThdLevels.DATA, "data");
    };

    /**
     * Logs message and data with the level=error
     * @param message The message
     * @param otherParams Additional parameters
     */
    error(message: ThdLoggerMessage) {
        // this.logger.error(message);
        this.output(message, ThdLevels.ERROR, "error");
    }
    /**
     * Logs message and data with the level=info
     * @param message The message
     * @param otherParams Additional parameters
     */
    info(message: ThdLoggerMessage) {
        // this.logger.info(message);
        this.output(message, ThdLevels.INFO, "info");
    }
    /**
     * Logs message and data with the level=warn
     * @param message The message
     * @param otherParams Additional parameters
     */
    warn(message: ThdLoggerMessage) {
        // this.logger.warn(message);
        this.output(message, ThdLevels.WARN, "warn");
    }

    /**
     * Output message depending on service config & logger config
     */
    public output(message: ThdLoggerMessage, outputLevel: ThdLevels, loggerCallBack: string): void {
        if (this.config.mute == false && this.config.logLevels.length >= 1 && contain(this.config.logLevels, outputLevel) && this.checkDeveloppementMode(outputLevel)) {
            this.logger[loggerCallBack](message);
        }
    }
    private checkDeveloppementMode(requestedOutputLogLevel: ThdLevels): boolean {
        var canOutput: boolean = true;

        // When developpement mode is "off", only output errors level
        if (this.config.isDeveloppementMode == false && requestedOutputLogLevel != ThdLevels.ERROR) canOutput = false

        return canOutput;
    }
}