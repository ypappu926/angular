import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

export interface Person {
    id?: string;
    // isActive: boolean;
    // age: number;
    // name: string;
    // gender: string;
    // company: string;
    // email: string;
    // phone: string;
    disabled?: boolean;
    SchemeName: string;
    LoanType: string;

}

@Injectable({
    providedIn: 'root'
})
export class DataService {
    constructor(private http: HttpClient) { }

    // getGithubAccounts(term: string = null) {
    //     if (term) {
    //         return this.http.get<any>(`https://api.github.com/search/users?q=${term}`).pipe(map(rsp => rsp.items));
    //     } else {
    //         return of([]);
    //     }
    // }

    // getAlbums() {
    //     return this.http.get<any[]>('https://jsonplaceholder.typicode.com/albums');
    // }

    // getPhotos() {
    //     return this.http.get<any[]>('https://jsonplaceholder.typicode.com/photos');
    // }

    getPeople(term: string = null): Observable<Person[]> {
        let items = getMockPeople();
        if (term) {
            items = items.filter(x => x.SchemeName.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
        }
      //  return null;
      return of(items).pipe(delay(500));
    }
}

function getMockPeople() {
    return [
        {
            'SchemeName': 'CSIS',
            'LoanType': 'Education loan',
            'SchemeId':1
        },
        {
            'SchemeName': 'DR.Ambedkar',
            'LoanType': 'Education loan',
            'SchemeId':3
        },
        {
            'SchemeName': 'Pradho Paredesh',
            'LoanType': 'Education loan',
            'SchemeId':2
        },
        {
            'SchemeName': 'PMAY',
            'LoanType': 'Home loan',
            'SchemeId':4
        },
        {
            'SchemeName': 'PMMY',
            'LoanType': 'Business loan',
            'SchemeId':9
        },
        {
            'SchemeName': 'SWMS',
            'LoanType': 'Business loan',
            'SchemeId':8
        },
        {
            'SchemeName': 'SRMS',
            'LoanType': 'Business loan',
            'SchemeId':12
        },
		{
            'SchemeName': 'SUIS',
            'LoanType': 'Business loan',
            'SchemeId':13
        },
	     {
            'SchemeName': 'AIF',
            'LoanType': 'Agri Loan',
            'SchemeId':15
        },
		{
            'SchemeName': 'AMI',
            'LoanType': 'Agri Loan',
            'SchemeId':7
        },
		{
            'SchemeName': 'ACABC',
            'LoanType': 'Agri Loan',
            'SchemeId':6
        },
		{
            'SchemeName': 'DAY-NULM',
            'LoanType': 'Livelihood Loan',
            'SchemeId':11
        },
		{
            'SchemeName': 'DAY-NRLM',
            'LoanType': 'Livelihood Loan',
            'SchemeId':14
        }
        
    ]
}
