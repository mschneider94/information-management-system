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
      this.messageService.error(error);
      this.messageService.show(`${operation} failed: ${error.message}`, 'danger');

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  public getSchema(schemaName?: string, mode?: string): Observable<InformationSchema[]> {
    let fallbackSchema: InformationSchema[] = [{
      schemaVersion: null, 
      category: null, 
      view: null, 
      content: null,
      displayName: null,
      parents: [],
      metaData: []
    }];

    let apiEndpoint: string = environment.backendUrl;

    switch (mode) {
      case 'byId':
        apiEndpoint += '/' + schemaName;
        break;

      default:
        if(schemaName) {
          apiEndpoint += '/?name=' + schemaName;
        }
    }

    return this.http.get<InformationSchema[]>(apiEndpoint, this.httpOptions).pipe(
      tap(_ => this.messageService.info(`BackendService.getSchema(${schemaName})`)),
      catchError(this.handleError<InformationSchema[]>(`BackendService.getSchema(${schemaName})`, fallbackSchema))
    );
  }
}
