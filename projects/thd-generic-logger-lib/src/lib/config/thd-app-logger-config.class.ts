import { ThdLevels } from "../service/thd-levels.class";
import { ThdAppLoggerAdapterBase } from "../adapters/thd-app-logger-adapter-base.class";

/**
 * Type for creating app logger adapter
 * @see ThdAppLoggerAdapterBase
 */
export type ThdloggerAdapterType<T extends ThdAppLoggerAdapterBase<any>> = {
    new(
        name: string,
        config: ThdAppLoggerConfig
    ): T
}

/**
 * Base config class for logger service properties
 */
export abstract class ThdAppLoggerConfigBase {
    // Main logger instance (i.e Service logger)
    isDeveloppementMode: boolean;
    logLevels: ThdLevels[];
}

/**
 * Logger config class
 */
export abstract class ThdAppLoggerConfig extends ThdAppLoggerConfigBase {
    color: string;
    mute: boolean;
    fixedWidth: number;
    loggerConfig?: any; // Permit to set any config object for implemented logger if needed
}

export abstract class ThdAppLoggerServiceConfig {
    /**
     * Logger adapter class to use when creating new logger
     */
    public loggerAdapter: ThdloggerAdapterType<ThdAppLoggerAdapterBase<any>>
    /**
     * Array of logger instances name to show (empty = all modules)
     */
    public onlyLoggers: Array<string>;
    /**
     * Service configuration
     */
    public serviceConfig: ThdAppLoggerConfigBase;
    /**
     * config for new logger instances
     */
    public defaultLoggerConfig: ThdAppLoggerConfig;
}