import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
import { UserID } from '../user-id.interface';
import { UserIDService } from '../user-id.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  constructor(
    private activeRoute: ActivatedRoute,
    private userIDService: UserIDService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    UIkit.use(Icons);
    this.whichSchema();
  }

  public selectedSchema: string = null;
  public whichSchema(): void {
    this.selectedSchema = this.activeRoute.snapshot.paramMap.get('schema');
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
