import {
  Constructor,
  ICommand,
  CommandHandler as NestCommandHandler,
  ICommandHandler as NestICommandHandler,
} from '@nestjs/cqrs';

export class Command<R> implements ICommand {
  /**
   * This field is mandatory to be able to extract {@link R} from the command.
   * It won't never have a value and it is only used for type inference.
   */
  protected resultType?: R;
}

/**
 * Extract the result type generic of a command.
 */
export type ResultTypeOfCommand<C> = C extends Command<infer R> ? R : never;

/**
 * Type replacement for {@link NestICommandHandler ICommandHandler} which allows to infer the result type of the command.
 */
export type ICommandHandler<C extends Command<unknown>> = NestICommandHandler<C, ResultTypeOfCommand<C>>;

/**
 * @see {@link NestCommandHandler CommandHandler}
 */
export const CommandHandler: (command: Constructor<Command<unknown>>) => ClassDecorator = NestCommandHandler;

export { CommandBus } from '@nestjs/cqrs';
