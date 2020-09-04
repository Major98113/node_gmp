import { injectable } from 'inversify';
import 'reflect-metadata';
import { LoggerInterface } from '../types/logger.types';

@injectable()
class CLILogger implements LoggerInterface{
    logServiceRequest( message: string ){
        console.log( message );
    }
}

export { CLILogger };