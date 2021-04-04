import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterState } from '@angular/router';
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
import { UserID } from '../user-id.interface';
import { InformationSchema } from '../information-schema.interface';
import { UserIDService } from '../user-id.service';
import { MessageService } from '../message.service';
import { BackendService } from '../backend.service';
import { SortingService, Leaf } from '../sorting.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  constructor(
    private router: Router,
    private userIDService: UserIDService,
    private messageService: MessageService,
    private backendService: BackendService,
    private sortingService: SortingService
  ) { }

  ngOnInit(): void {
    UIkit.use(Icons);
    this.getSchema();
    this.subscribeRouterEvents$();
  }

  public schema: InformationSchema[] = [];
  public schemaTree: Leaf = { name: 'root', path: '', children: [] };
  private getSchema(): void {
    this.backendService.getSchema().subscribe(schema => {
      this.schema = schema;
      this.schemaTree = this.sortingService.tree(schema.map(object => object.category), '.', '/');
    });
  }

  private subscribeRouterEvents$(): void {
    this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd) {
        this.updateNavigation(
          event.url.replace('/category/', '')
        );
      }
    });
  }

  public selectedCategory: string = '';
  private updateNavigation(selectedCategory: string): void {
    this.selectedCategory = selectedCategory;
  }

  public getUserID(): UserID {
    return this.userIDService.getUserID();
  }

  public refresh(): void {
    this.messageService.show('Refresh!', 'success');
  }

  public signOut(): void {
    this.messageService.show('signOut');
  }
}
