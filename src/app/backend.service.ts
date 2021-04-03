import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { InformationSchema }from './information-schema.interface';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(
    private messageService: MessageService
  ) { }

  public getSchema(schemaName: string): Observable<InformationSchema> {
    // return Schema for document in information-schema with OID==OID
    let schema: InformationSchema;

    // REMOVE: Fixed value for testing
    // ADD: query real backend for schema-data
    switch(schemaName) {
      case 'it.changelog':
        schema = { name: 'it.changelog', view: 'table'};
        break;

      default:
        schema = { name: null, view: null };
    }

    return of(schema);
  }
}
