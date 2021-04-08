import { Injectable } from '@angular/core';
import { BackendService } from '../backend.service';
import { InformationData } from '../information-data.interface';
import { InformationSchema, MetaData } from '../information-schema.interface';

@Injectable({
  providedIn: 'root'
})
export class ViewService {

  constructor(
    private backendService: BackendService
  ) { }

  public schema: InformationSchema;
  public initialize(schema: InformationSchema): void {
    // Import Schema
    this.schema = schema;
    // Resolve Schema-Parents
    this.schemaParents = [];
    this.resolveSchema();
    // Pull InformationData
    this.informationData = [];
    this.pullData();
  }

  public schemaParents: InformationSchema[];
  private resolveSchema(): void {
    // Get InformationObject for every parent (ObjectID) of schema and store those in this.schema.parents
    for (let parent of this.schema.parents) {
      this.backendService.getSchema(parent, 'byId').subscribe(schemas => schemas.forEach(schema => this.schemaParents.push(schema)));
    }
  }

  public informationData: InformationData[];
  private pullData(): void {
    // Request all InformationData of current InformationSchema, subscribe Observable
    this.backendService.getData(this.schema._id, 'bySchema').subscribe(informationDataArray => {
      // Push InformationData-Object into this.informationData-Array
      informationDataArray.forEach(informationData => this.informationData.push(informationData));
      // Resolv parents of this.informationData only, no necessity for recursion here right now...
      // ...recursive resolution of parents could lead to inifinte loop, as InformationData could be cross-linked!
      // Iterate through every element of this.informationData[]
      for (let x = 0; x < this.informationData.length; x++) {
        // Iterate thorugh every parents[] of current InformationObject
        for (let y = 0; y < this.informationData[x].parents.length; y++) {
          // Request InformationObject for current parent of current InformationObject, subscribe Observable
          // Instruct Subscription to overwrite current parent:string with requested InformationData (resolve linked documents)
          this.backendService.getData(this.informationData[x].parents[y], 'byId').subscribe(res => this.informationData[x].parents[y] = res[0]);
        }
      }
    });
  }
  
  public formatContent(input, format: string, metaDataContent?: any[], metaDataType?: MetaData[]): string {
    let content: string = '';

    switch (format) {
      case 'text':
        content = input;
        break;
      case 'dateTime':
        content = new Date(input).toLocaleString('de-DE');
        //content += isoDate.getFullYear() + '-' + (isoDate.getMonth()+1) + '-' + isoDate.getDate() + ' ' + isoDate.getHours() + ':' 
        break;
      case 'dynamic':
        input.string.forEach(component => /^#.*/.test(component) ? content += metaDataContent.map(object => object[component.substring(1)]).find(object => typeof(object) === 'string') : content += component);
        break;
      default:
        content = input;
    }

    return content;
  }
}
