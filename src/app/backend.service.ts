import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { MessageService } from './message.service';
import { InformationSchema }from './information-schema.interface';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.messageService.show(`${operation} failed: ${error.message}`, 'danger');

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  public getSchema(schemaName?: string): Observable<InformationSchema[]> {
    let fallbackSchema: InformationSchema[] = [{ name: null, view: null }];

    let apiEndpoint: string = environment.backendUrl;
    if(schemaName) {
      apiEndpoint += '/' + schemaName;
    }

    return this.http.get<InformationSchema[]>(apiEndpoint, this.httpOptions).pipe(
      tap(_ => console.log(`BackendService.getSchema(${schemaName})`)),
      catchError(this.handleError<InformationSchema[]>(`BackendService.getSchema(${schemaName})`, fallbackSchema))
    );
  }
}
