import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
    NotAcceptableException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as validUrl from 'valid-url';

@Injectable()
export class ValidUrlInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const url = context.switchToHttp().getRequest().query['url'];
        const isValid = validUrl.isUri(url);

        return next.handle().pipe(
            tap(() => {
                if (!isValid) {
                    throw new NotAcceptableException(`${url} is not a valid url.`);
                }
            }),
        );
    }
}
