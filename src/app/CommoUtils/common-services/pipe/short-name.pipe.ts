import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "shortName"
})
export class ShortNamePipe implements PipeTransform {
  transform(fullName: string, numChars: number = 2): string{
    return fullName
      .split(" ")
      .slice(0, numChars)
      .map(n => n[0].toUpperCase())
      .join('');
  }

  // transform(fullName:string):string[] {
  //   return fullName.split('');
  // }

  // transform(fullName:string): string {
  //   let first = fullName.substr(0,1).toUpperCase();
  //   return first + fullName.substr(1); 
  // }

  
}
