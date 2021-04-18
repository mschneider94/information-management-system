import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { MessageService } from './message.service';
import { InformationSchema }from './information-schema.interface';
import { InformationData } from './information-data.interface';

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

  public getSchema(identifier?: string, mode?: string): Observable<InformationSchema[]> {
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
        apiEndpoint += '/schema/' + identifier;
        break;

      default:
        if(identifier) {
          apiEndpoint += '/schema?name=' + identifier;
        } else {
          apiEndpoint += '/schema';
        }
    }

    return this.http.get<InformationSchema[]>(apiEndpoint, this.httpOptions).pipe(
      tap(_ => this.messageService.debug(`BackendService.getSchema(${identifier})`)),
      catchError(this.handleError<InformationSchema[]>(`BackendService.getSchema(${identifier})`, fallbackSchema))
    );
  }

  public getData(identifier?: string, mode?: string): Observable<InformationData[]> {
    let fallbackData: InformationData[] = [{
      schema: null, 
      content: null,
      parents: [],
      metaData: []
    }];

    let apiEndpoint: string = environment.backendUrl;

    switch (mode) {
      case 'byId':
        apiEndpoint += '/data/' + identifier;
        break;

      case 'bySchema':
        apiEndpoint += '/data?schema=' + identifier;
        break;
      
      default:
        apiEndpoint += '/data/';
    }

    return this.http.get<InformationData[]>(apiEndpoint, this.httpOptions).pipe(
      tap(_ => this.messageService.debug(`BackendService.getData(${identifier})`)),
      catchError(this.handleError<InformationData[]>(`BackendService.getSchema(${identifier})`, fallbackData))
    );
  }

  public addData(data: InformationData): Observable<InformationData> {
    let apiEndpoint: string = environment.backendUrl + '/data/';
    
    return this.http.post<InformationData>(apiEndpoint, data, this.httpOptions).pipe(
      tap((newData: InformationData) => this.messageService.debug(`BackendService.addData(${newData})`)),
      catchError(this.handleError<InformationData>(`BackendService.addData(${data})`, data))
    );
  }

  public updateData(data: InformationData): Observable<InformationData> {
    let apiEndpoint: string = environment.backendUrl + '/data/' + data._id;
    
    return this.http.put(apiEndpoint, data, this.httpOptions).pipe(
      tap(_ => this.messageService.debug(`BackendService.updateData${data._id}`)),
      catchError(this.handleError<any>(`BackendService.updateData${data._id}`, data))
    );
  }

  public deleteData(id: string): Observable<Record<string,string>> {
    let apiEndpoint: string = environment.backendUrl + '/data/' + id;

    console.log(apiEndpoint);
    
    return this.http.delete<Record<string,string>>(apiEndpoint, this.httpOptions).pipe(
      tap(_ => this.messageService.debug(`BackendService.deleteData${id}`)),
      catchError(this.handleError<Record<string,string>>(`BackendService.deleteData${id}`))
    );
  }
}
