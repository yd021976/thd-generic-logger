import { NgModule, ModuleWithProviders, InjectionToken, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThdAppLoggerServiceConfig } from './config/thd-app-logger-config.class';
import { ThdAppLoggerService } from './service/thd-app-logger.service';
import { ThdAppLoggerConfigToken, ThdAppLoggerServiceToken } from './thd-app-logger-token';
import { ThdAppLoggerAdapter } from './logger-sample/thd-sample-logger-adapter';
import { ThdLevels } from './service/thd-levels.class';


export function thd_loggerFactory(config: ThdAppLoggerServiceConfig): ThdAppLoggerService {
  var instance: ThdAppLoggerService = null;
  instance = new ThdAppLoggerService(config);
  return instance;
}

const thd_defaultAppLoggerConfig: ThdAppLoggerServiceConfig = {
  loggerAdapter: ThdAppLoggerAdapter,
  onlyLoggers: [], // output all loggers
  serviceConfig: {
    isDeveloppementMode: true,
    logLevels: [ThdLevels.DATA]
  },
  defaultLoggerConfig: {
    logLevels: [ThdLevels.DATA],
    isDeveloppementMode: true,
    color: "#000000",
    mute: false,
    fixedWidth: 0
  }
}

/**
 * 
 */
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
export class thd_AppLoggerModule {
  public static forRoot(config?: ThdAppLoggerServiceConfig): ModuleWithProviders {
    return {
      ngModule: thd_AppLoggerModule,
      providers: [
        {
          provide: ThdAppLoggerConfigToken,
          useValue: config || thd_defaultAppLoggerConfig
        },
        {
          provide: ThdAppLoggerServiceToken,
          useFactory: thd_loggerFactory,
          multi: false,
          deps: [ThdAppLoggerConfigToken]
        }
      ],
    }
  }

}
