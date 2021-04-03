import { Component, OnInit, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { MessageService } from '../message.service';
import { ExplorerService } from './explorer.service';
import { InformationSchema }from '../information-schema.interface';
import { ViewObject } from './view.object';
import { ViewDirective } from './view.directive';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.css']
})
export class ExplorerComponent implements OnInit {

  @ViewChild(ViewDirective, { static: true }) viewDirective: ViewDirective;

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private componentFactoryResolver: ComponentFactoryResolver,
    private messageService: MessageService,
    private explorerService: ExplorerService
  ) { }

  ngOnInit(): void {
    // get handle of the appView-Container
    this.viewContainerRef = this.viewDirective.viewContainerRef;
    // subscribe to the explorer-service to get schema-data dynamically
    this.subscribeRouterEvents$();
    this.subscribeSchema$();
  }

  // handle of the appView-Container
  private viewContainerRef = null;

  // Stream of schemaName, which is subscribed by the explorer-service
  private schemaName$: Subject<string> = new Subject();
  
  public updateSchemaName$(): void {
    this.schemaName$.next(this.activeRoute.snapshot.paramMap.get('schema'));
  }

  // subscribe to the router events to update schemaName$ at NavigationEnd
  private subscribeRouterEvents$(): void {
    this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd) {
        this.updateSchemaName$();
      }
    });
  }

  // subscribe to the explorer-service to get schema-data dynamically
  private subscribeSchema$(): void {
    this.explorerService.getSchema$(this.schemaName$)
      .subscribe(schema => {
        this.showView(schema);
      });

    this.updateSchemaName$();
  }

  // Generate the needed Viewer
  public showView(schema: InformationSchema): void {
    this.viewContainerRef.clear();
    
    if (schema.view) {
      // Create new ng-Component using ComponentFactory
      this.viewContainerRef.createComponent(
        // Resolve ComponentFactory using ViewObject.component
        this.componentFactoryResolver.resolveComponentFactory(
          // Get ViewObject.component
          this.explorerService.getViewObject(schema.view).component
        )
      );
    }
  }
}
