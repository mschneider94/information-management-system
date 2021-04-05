import { Component, Input, OnInit } from '@angular/core';
import { BackendService } from 'src/app/backend.service';
import { InformationData } from 'src/app/information-data.interface';
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
    this.pullData();
    }

  public schemaParents: InformationSchema[] = [];
  private resolveSchema(): void {
    for (let parent of this.schema.parents) {
      this.backendService.getSchema(parent, 'byId').subscribe(schemas => schemas.forEach(schema => this.schemaParents.push(schema)));
    }
  }

  public informationData: InformationData[] = [];
  public pullData(): void {
    this.backendService.getData(this.schema._id, 'bySchema').subscribe(informationDataArray => {
      informationDataArray.forEach(informationData => {
        this.informationData.push(informationData);
      });
      // Fix parents, ?make recursive?
      for (let x = 0; x < this.informationData.length; x++) {
        for (let y = 0; y < this.informationData[x].parents.length; y++) {
          this.backendService.getData(this.informationData[x].parents[y], 'byId').subscribe(res => this.informationData[x].parents[y] = res);
        }
      }
    });
  }
}
