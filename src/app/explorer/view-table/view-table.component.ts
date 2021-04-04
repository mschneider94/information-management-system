import { Component, Input, OnInit } from '@angular/core';
import { BackendService } from 'src/app/backend.service';
import { InformationSchema } from 'src/app/information-schema.interface';

@Component({
  selector: 'app-view-table',
  templateUrl: './view-table.component.html',
  styleUrls: ['./view-table.component.css']
})
export class ViewTableComponent implements OnInit {
  @Input() schema: InformationSchema;

  constructor(
    private backendService: BackendService
  ) { }

  ngOnInit(): void {
    this.resolveSchema();
    }

  public schemaParents: InformationSchema[] = [];
  private resolveSchema(): void {
    for (let parent of this.schema.parents) {
      this.backendService.getSchema(parent, 'byId').subscribe(schemas => schemas.forEach(schema => this.schemaParents.push(schema)));
    }
  }
}
