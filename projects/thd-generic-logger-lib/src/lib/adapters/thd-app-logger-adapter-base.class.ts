import { ThdLevels } from '../service/thd-levels.class';
import { ThdAppLoggerConfig } from '../config/thd-app-logger-config.class';
import { ThdLoggerMessage } from '../service/thd-app-logger.service';

/**
 * Simple decorator to avoid overriding class method
 */
function sealed(target, key, descriptor) {
    descriptor.writable = false;
    descriptor.configurable = false;
}

/**
 * Logger adapter base class
 */
export abstract class ThdAppLoggerAdapterBase<T extends any> {
    public name: string;
    protected config: ThdAppLoggerConfig;
    protected logger: T; // logger instance

    public abstract setConfig(config: ThdAppLoggerConfig): void
    public abstract mute(mute: boolean): void
    public abstract data(message: ThdLoggerMessage): void
    public abstract info(message: ThdLoggerMessage): void
    public abstract warn(message: ThdLoggerMessage): void
    public abstract error(message: ThdLoggerMessage): void
    public abstract output(message: ThdLoggerMessage, outputLevel: ThdLevels, loggerCallBack: string): void
}