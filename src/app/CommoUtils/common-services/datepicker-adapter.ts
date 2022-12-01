import { Component, Injectable } from '@angular/core';
import { NgbCalendar, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

/**
 * This Service handles how the date is represented in scripts i.e. ngModel.
 */

 function padNumber(value: number) {
    if (isNumber(value)) {
        return `0${value}`.slice(-2);
    } else {
        return "";
    }
}

function isNumber(value: any): boolean {
    return !isNaN(toInteger(value));
}

function toInteger(value: any): number {
    return parseInt(`${value}`, 10);
}

@Injectable()
export class CustomAdapter extends NgbDateAdapter<string> {

    readonly DELIMITER = '-';

    // fromModel(value: string | null): NgbDateStruct | null {
    //     if (value) {
    //         let date = value.split(this.DELIMITER);
    //         return {
    //             day: parseInt(date[0], 10),
    //             month: parseInt(date[1], 10),
    //             year: parseInt(date[2], 10)
    //         };
    //     }
    //     return null;
    // }

    // toModel(date: NgbDateStruct | null): string | null {
    //     return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : null;
    // }

    fromModel(value: string | null): NgbDateStruct | null {
        if (value) {
          const dateParts = value.trim().split('-');
          if (dateParts.length === 1 && isNumber(dateParts[0])) {
            return {day: toInteger(dateParts[0]), month: null, year: null};
          } else if (dateParts.length === 2 && isNumber(dateParts[0]) && isNumber(dateParts[1])) {
            return {day: toInteger(dateParts[0]), month: toInteger(dateParts[1]), year: null};
          } else if (dateParts.length === 3 && isNumber(dateParts[0]) && isNumber(dateParts[1]) && isNumber(dateParts[2])) {
            return {day: toInteger(dateParts[0]), month: toInteger(dateParts[1]), year: toInteger(dateParts[2])};
          }
        }
        return null;
      }
    
      toModel(date: NgbDateStruct | null): string | null {
        return date ?
            `${isNumber(date.day) ? padNumber(date.day) : ''}-${isNumber(date.month) ? padNumber(date.month) : ''}-${date.year}` :
            '';
      }
}

/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {

     readonly DELIMITER = '-';

    // parse(value: string): NgbDateStruct | null {
    //     if (value) {
    //         let date = value.split(this.DELIMITER);
    //         return {
    //             day: parseInt(date[0], 10),
    //             month: parseInt(date[1], 10),
    //             year: parseInt(date[2], 10)
    //         };
    //     }
    //     return null;
    // }

    // format(date: NgbDateStruct | null): string {
    //     return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : '';
    // }
    parse(value: string): NgbDateStruct {
        if (value) {
          const dateParts = value.trim().split('-');
          if (dateParts.length === 1 && isNumber(dateParts[0])) {
            return {day: toInteger(dateParts[0]), month: null, year: null};
          } else if (dateParts.length === 2 && isNumber(dateParts[0]) && isNumber(dateParts[1])) {
            return {day: toInteger(dateParts[0]), month: toInteger(dateParts[1]), year: null};
          } else if (dateParts.length === 3 && isNumber(dateParts[0]) && isNumber(dateParts[1]) && isNumber(dateParts[2])) {
            return {day: toInteger(dateParts[0]), month: toInteger(dateParts[1]), year: toInteger(dateParts[2])};
          }
        }
        return null;
      }
    
      format(date: NgbDateStruct): string {
        return date ?
            `${isNumber(date.day) ? padNumber(date.day) : ''}-${isNumber(date.month) ? padNumber(date.month) : ''}-${date.year}` :
            '';
      }
}