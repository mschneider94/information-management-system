import { Injectable } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BackendService } from '../backend.service';
import { MessageService } from '../message.service';
import { InformationSchema }from '../information-schema.interface';
import { ViewObject } from './view.object';
import { ViewTableComponent } from './view-table/view-table.component';

@Injectable({
  providedIn: 'root'
})
export class ExplorerService {

  constructor(
    private backendService: BackendService,
    private messageService: MessageService
  ) { }

  private schema$: Subject<InformationSchema[]> = new Subject();

  getSchema$(schemaName$: Subject<string>): Subject<InformationSchema[]> {
    schemaName$.subscribe(schemaName => {
      this.backendService.getSchema(schemaName)
        .pipe(takeUntil(schemaName$)).subscribe(schema => {
          this.schema$.next(schema);
        });
    });

    return this.schema$;
  }

  public getViewObject(viewName: string): ViewObject {
    let viewObject: ViewObject = null;

    switch(viewName) {
      case 'table':
        viewObject = new ViewObject(ViewTableComponent);
        break;
      
      default:
        viewObject = null;
    }

    return viewObject;
  }
}
