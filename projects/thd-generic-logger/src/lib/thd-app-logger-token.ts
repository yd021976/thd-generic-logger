import { InjectionToken } from '@angular/core';
import { ThdAppLoggerConfig } from './config/thd-app-logger-config.class';
import { ThdAppLoggerService } from './service/thd-app-logger.service';


/**
 * 
 */
export const ThdAppLoggerConfigToken: InjectionToken<ThdAppLoggerConfig> = new InjectionToken<ThdAppLoggerConfig>('ThdAppLoggerConfig');
export const ThdAppLoggerServiceToken: InjectionToken<ThdAppLoggerService> = new InjectionToken<ThdAppLoggerService>('ThdAppLoggerService');