import { ThdLevels } from '../service/thd-levels.class';
import { contain } from '../utils/thd-app-logger-utils';
import { ThdAppLoggerConfig } from '../config/thd-app-logger-config.class';
import { ThdLoggerMessage } from '../service/thd-app-logger.service';

/**
 * Module provided default logger
 */
export class ThdSampleLogger {
    protected config: ThdAppLoggerConfig;

    constructor(
        private name: string,
        public color: string,
        private developmentMode: boolean,
        private allowed: ThdLevels[],
        private isMuted: boolean,
        public fixedWidth: number | undefined,
    ) { }

    public setConfig(config: ThdAppLoggerConfig) {
        this.config = config;
        this.developmentMode = config.isDeveloppementMode;
        this.allowed = config.logLevels;
    }
    public getConfig(): ThdAppLoggerConfig {
        return this.config;
    }
    public mute(state: boolean) {
        this.isMuted = state;
    }
    public data(message: ThdLoggerMessage) {
        this._data(message);
    }
    public info(message: ThdLoggerMessage) {
        this._info(message);
    }
    public warn(message: ThdLoggerMessage) {
        this._warn(message);
    }
    public error(message: ThdLoggerMessage) {
        this._error(message);
    }

    protected _data(message: ThdLoggerMessage) {
        if (this.allowed.length >= 1 && contain(this.allowed, ThdLevels.__NOTHING)
            && !contain(this.allowed, ThdLevels.DATA)) return this;
        if (!this.developmentMode) return this;
        this.display(message.message, message.otherParams, ThdLevels.DATA);
        return this;
    }


    protected _error(message: ThdLoggerMessage) {
        if (this.allowed.length >= 1 && contain(this.allowed, ThdLevels.__NOTHING)
            && !contain(this.allowed, ThdLevels.ERROR)) return this;
        if (!this.developmentMode) return this;
        this.display(message.message, message.otherParams, ThdLevels.ERROR);
        return this;
    }

    protected _info(message: ThdLoggerMessage) {
        if (this.allowed.length >= 1 && contain(this.allowed, ThdLevels.__NOTHING)
            && !contain(this.allowed, ThdLevels.INFO)) return this;
        if (!this.developmentMode) return this;
        this.display(message.message, message.otherParams, ThdLevels.INFO);
        return this;
    }

    protected _warn(message: ThdLoggerMessage) {
        if (this.allowed.length >= 1 && contain(this.allowed, ThdLevels.__NOTHING)
            && !contain(this.allowed, ThdLevels.WARN)) return this;
        if (!this.developmentMode) return this;
        this.display(message.message, message.otherParams, ThdLevels.WARN);
        return this;
    }
    /**
     * Output log message
     * @param name 
     * @param data 
     * @param incomming 
     * @param moduleName 
    **/
    private display(name: string, data: any, incomming: ThdLevels) {
        if (!contain(this.allowed, incomming)) return;
        if (this.isMuted) return;
        
        if (incomming === ThdLevels.DATA) {
            this.outputToConsole(name, data, this.name, this.color,
                ThdLevels.DATA, this.fixedWidth);
        }
        if (incomming === ThdLevels.ERROR) {
            this.outputToConsole(name, data, this.name, this.color,
                ThdLevels.ERROR, this.fixedWidth);
        }
        if (incomming === ThdLevels.INFO) {
            this.outputToConsole(name, data, this.name, this.color,
                ThdLevels.INFO, this.fixedWidth);
        }
        if (incomming === ThdLevels.WARN) {
            this.outputToConsole(name, data, this.name, this.color,
                ThdLevels.WARN, this.fixedWidth);
        }
    }

    public outputToConsole(message: string | any, params: any[], moduleName: string, moduleColor: string, level: ThdLevels, moduleWidth: number | undefined) {
        let color = 'gray';
        if (level === ThdLevels.INFO) color = 'deepskyblue';
        if (level === ThdLevels.ERROR) color = 'red';
        if (level === ThdLevels.WARN) color = 'orange';

        if (moduleWidth) {
            const diff = moduleWidth - moduleName.length;
            if (diff > 0) {
                for (let i = 0; i < diff; i++) {
                    moduleName += ' ';
                }
            }
        }

        const isEdgeOrIe8orAbove = (document['documentMode'] || /Edge/.test(navigator.userAgent));

        if (isEdgeOrIe8orAbove) {
            if (typeof message === 'string') {
                let a1 = '[[ ' + moduleName + ' ]] ' + message + ' ';
                params.unshift(a1);
            } else {
                let a1 = '[[ ' + moduleName + ']] ';
                params.push(message);
                params.unshift(a1);
            }
            if (level === ThdLevels.INFO) {
                console.info.apply(console, params);
            } else if (level === ThdLevels.ERROR) {
                console.error.apply(console, params);
            } else if (level === ThdLevels.WARN) {
                console.warn.apply(console, params);
            } else {
                console.log.apply(console, params);
            }
        } else {
            if (typeof message === 'string') {
                let a1 = '%c ' + moduleName + '  %c ' + message + ' ';
                let a2 = 'background: ' + moduleColor + ';color:white; border: 1px solid ' + moduleColor + '; ';
                let a3 = 'border: 1px solid ' + color + '; ';
                params.unshift(a3);
                params.unshift(a2);
                params.unshift(a1);
            } else {
                let a1 = '%c ' + moduleName + ' ';
                let a2 = 'background: ' + moduleColor + ';color:white; border: 1px solid ' + color + '; ';
                params.push(message);
                params.unshift(a2);
                params.unshift(a1);
            }
            console.log.apply(console, params);
        }
    }
}