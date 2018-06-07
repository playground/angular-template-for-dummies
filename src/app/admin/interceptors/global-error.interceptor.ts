import { ErrorHandler, Injectable } from '@angular/core';
import { AlertService } from '../services/alert.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class GlobalErrorInterceptor implements ErrorHandler {

    constructor(
        private alertService: AlertService
    ) {

    }

    handleError(error: Error) {
        console.log('GlobalErrorInterceptor error catched:');
        console.log(error);
        this.alertService.addError(error);
        //throw error;
    }

}