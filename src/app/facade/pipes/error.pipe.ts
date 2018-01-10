import { Pipe, PipeTransform } from '@angular/core';
import { AdminGuiError } from '../errors/admin-gui.error';

@Pipe({
  name: 'error'
})
export class ErrorPipe implements PipeTransform {

  transform(error: Error, format?: string): string {
    if (format != undefined || format == 'rootMessage') {
      return this.formatRootMessage(error);
    } else {
      return this.formatAllDetails(error);
    }
  }

  private formatRootMessage(error: Error): string {
    let errors = this.findErrorsStack(error);
    return errors[errors.length - 1].message;
  }

  private formatAllDetails(error: Error): string {
    let res: string = "";
    let errors = this.findErrorsStack(error);
    errors.forEach(e => res += (e.stack == undefined ? e.message : e.stack) + "\n\n")
    return res;
  }


  private findErrorsStack(error: Error): Array<Error> {
    var errors: Array<Error> = new Array<Error>();
    this.iterateErrorsStack(error, errors);
    return errors;
  }

  private iterateErrorsStack(error: Error, result: Array<Error>): void {
    result.push(error);
    if (error instanceof AdminGuiError && error.innerError != undefined) {
      this.iterateErrorsStack(error.innerError, result);
    }
  }

}
