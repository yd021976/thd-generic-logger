import { Inject } from '@angular/core';
import { ThdLevels } from './thd-levels.class';
import { ThdAppLoggerServiceConfig, ThdloggerAdapterType, ThdAppLoggerConfig } from '../config/thd-app-logger-config.class';
import { ThdAppLoggerConfigToken } from '../thd-app-logger-token';
import { contain } from '../utils/thd-app-logger-utils';
import { ThdAppLoggerAdapter } from '../logger-sample/thd-sample-logger-adapter';
import { ThdAppLoggerAdapterBase } from '../adapters/thd-app-logger-adapter-base.class';


export type ThdLoggerMessage = { message: string, otherParams: any[] }

export class ThdAppLoggerService<T extends ThdAppLoggerAdapterBase<any>=ThdAppLoggerAdapter> {
  protected readonly serviceLoggerName: string = "AppLoggerService main logger";
  protected instances: { [name: string]: T } = {};
  protected config: ThdAppLoggerServiceConfig;
  protected levels: ThdLevels[];
  protected isMuted: boolean = false;
  protected loggerAdapterConstructor: ThdloggerAdapterType<any>

  constructor(@Inject(ThdAppLoggerConfigToken) config: ThdAppLoggerServiceConfig) {
    // Create the "Service logger"
    this.loggerAdapterConstructor = config.loggerAdapter;
    this.setConfig(config);
    this.createLogger(this.serviceLoggerName);
  }
  /**
   * Create or get a logger by name
   * @param name Name of the logger
   * @param levels Loggin levels for this logger
   */
  public createLogger(name: string, loggerConfig: ThdAppLoggerConfig | null = null, loggerAdapter?: ThdloggerAdapterType<T>): void {
    /**
     * If no overrided logger config, apply current service default config
     */
    if (loggerConfig === null) loggerConfig = { ...this.config.defaultLoggerConfig } // Ensure we create a new config object instance

    if (this.instances[name] == undefined) {
      this.instances[name] = new (loggerAdapter ? loggerAdapter : this.loggerAdapterConstructor)(
        name,
        loggerConfig || { isDeveloppementMode: false, logLevels: [ThdLevels.DATA], color: "#000000", fixedWidth: 0, mute: false });
    }
    else {
      this.warn(null, {
        message: 'Logger already exists. No new instance is created',
        otherParams: [name]
      });
    }
  }

  /**
   * 
   * @param adapterInstanceName 
   * @param data 
   */
  public debug(adapterInstanceName: string | null = this.serviceLoggerName, data: ThdLoggerMessage): void {
    this.log(adapterInstanceName, data, ThdLevels.DATA);
  }

  /**
   * 
   * @param adapterInstanceName 
   * @param data 
   */
  public info(adapterInstanceName: string | null = this.serviceLoggerName, data: ThdLoggerMessage) {
    this.log(adapterInstanceName, data, ThdLevels.INFO);
  }

  /**
   * 
   * @param adapterInstanceName 
   * @param data 
   */
  public warn(adapterInstanceName: string | null = this.serviceLoggerName, data: ThdLoggerMessage) {
    this.log(adapterInstanceName, data, ThdLevels.WARN);
  }

  /**
   * 
   * @param adapterInstanceName 
   * @param data 
   */
  public error(adapterInstanceName: string | null = this.serviceLoggerName, data: ThdLoggerMessage) {
    this.log(adapterInstanceName, data, ThdLevels.ERROR);
  }

  /**
   * 
   * @param adapterInstanceName 
   * @param data 
   * @param messageLevel 
   */
  private log(adapterInstanceName: string | null, data: ThdLoggerMessage, messageLevel: ThdLevels): void {
    if (adapterInstanceName === null) adapterInstanceName = this.serviceLoggerName;
    if (!this.canOutput(adapterInstanceName, messageLevel)) return;

    var loggerMethod: string = null;
    switch (messageLevel) {
      case ThdLevels.DATA:
        loggerMethod = "data";
        break;
      case ThdLevels.INFO:
        loggerMethod = "info";
        break;
      case ThdLevels.WARN:
        loggerMethod = "warn";
        break;
      case ThdLevels.ERROR:
        loggerMethod = "error";
        break;
      default:
        loggerMethod = "info";
        break;
    }
    this.instances[adapterInstanceName][loggerMethod](data);
  }
  /**
   * Set new config and apply it to main service logger and all logger instances
   */
  public setConfig(config: ThdAppLoggerServiceConfig) {
    this.config = config;
    this.loggerAdapterConstructor = config.loggerAdapter;

    /**
     * Update logger instances config
     */
    var instance: T | ThdAppLoggerAdapter;
    for (var instanceName in this.instances) {
      instance = this.instances[instanceName];
      instance.setConfig(config.defaultLoggerConfig);

      if (this.config.onlyLoggers.length != 0)
        this.filterLogger(instance, this.config.onlyLoggers);
    }
  }

  /**
   * Set logger output filter : Mute filter whom name doesn't meet a regexp 
   * @param onlyLoggers Array of regexp that filter logger that can output messages
   */
  public onlyLoggers(onlyLoggers: string[] = []) {
    // Update service config
    this.config.onlyLoggers = onlyLoggers;

    for (var instanceName in this.instances) {
      this.filterLogger(this.instances[instanceName], this.config.onlyLoggers);
    }
  }


  private filterLogger(loggerInstance: T, onlyLoggers: string[]) {
    if (!contain(onlyLoggers, loggerInstance.name)) {
      loggerInstance.mute(true)
    } else {
      loggerInstance.mute(false)
    }
  }
  /**
   * Mute service logs or mute a logger by its name
   * @param adapterInstanceName Adapter name to mute, mute service logs if null
   */
  public mute(adapterInstanceName: string | null, state: boolean) {
    adapterInstanceName === null ? this.isMuted = state : this.instances[adapterInstanceName].mute(state);
  }

  /**
   * @param adapterInstanceName Adapter instance name
   * @param incommingLevel Message level (data, debug ...)
   */
  private canOutput(adapterInstanceName: string, incommingLevel: ThdLevels): boolean {
    var canOutput: boolean = true;
    // Ensure adapter instance exists. If not create new one
    if (!this.instances[adapterInstanceName]) {
      this.createLogger(adapterInstanceName)
    }

    // Check message log level can be outputed by service level config
    if (!contain(this.config.serviceConfig.logLevels, incommingLevel)) canOutput = false;

    // Check that service is not muted or developement mode is not disabled
    if (this.isMuted || this.config.serviceConfig.isDeveloppementMode == false) canOutput = false;

    return canOutput;
  }
}
