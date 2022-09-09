import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import * as colors from 'colors/safe';

import { LoggerModuleOptionsFactory } from './logger-module-options.factory';

describe('AppWinstonModuleOptionsFactory', () => {
  let factory: LoggerModuleOptionsFactory;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigService, LoggerModuleOptionsFactory],
    }).compile();

    configService = module.get<ConfigService>(ConfigService);
    factory = module.get<LoggerModuleOptionsFactory>(LoggerModuleOptionsFactory);

    jest.spyOn(configService, 'get').mockImplementation((key: string): any => {
      const config: { [key: string]: any } = {
        LOG_LEVEL: 'debug',
      };
      return config[key];
    });
  });

  it('should be defined', () => {
    expect(factory).toBeDefined();
  });

  it('should set dateTime into log info', () => {
    let info: any = {};
    const format = factory.format.dateTime();
    info = format.transform(info);

    expect(info.dateTime).toBeTruthy();
  });

  it('should not set dateTime into log info', () => {
    const previousDateTime = new Date().toISOString();
    let info: any = { dateTime: previousDateTime };
    const format = factory.format.dateTime();
    info = format.transform(info);

    expect(info.dateTime).toEqual(previousDateTime);
  });

  it('should pretty print log', () => {
    const format = factory.format.prettyPrint();
    const info = {
      context: 'LocaleMiddleware',
      dateTime: '2020-03-30 16:55:42.452',
      level: 'debug',
      locale: 'fr_FR',
      message: '[34mLocale set into context[39m',
      ms: '+8s',
      pid: '4550',
      request: { id: '7d73934e-10d2-443d-9a41-7077fd72da06', time: 800 },
    };
    const prettyPrinted: any = format.transform(info);
    const expected = [
      colors.green('[LVApp]'),
      colors.green('4550\t'),
      colors.yellow('Debug\t'),
      colors.cyan('[7d73934e-10d2-443d-9a41-7077fd72da06]'),
      colors.white('800ms\t'),
      colors.gray('[fr_FR]'),
      colors.yellow('[LocaleMiddleware]'),
      '[34mLocale set into context[39m',
      colors.yellow('+8s'),
      '',
    ].join(' ');

    expect(prettyPrinted[Symbol.for('message')].toString()).toEqual(expected.toString());
  });

  it('should create winston module options', () => {
    const options = factory.createWinstonModuleOptions();
    expect(options).toBeDefined();
    expect(options.transports).toHaveLength(1);
  });
});
