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
    // Pull InformationData
    this.informationData = [];
    this.pullData();
  }

  public informationData: InformationData[];
  private pullData(): void {
    // Request all InformationData of current InformationSchema, subscribe Observable
    this.backendService.getData(this.schema._id, 'bySchema').subscribe(informationDataArray => {
      // Push InformationData-Object into this.informationData-Array
      informationDataArray.forEach(informationData => this.informationData.push(informationData));
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
