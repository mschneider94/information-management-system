import { Injectable } from '@angular/core';
import { BackendService } from '../backend.service';
import { InformationData } from '../information-data.interface';
import { InformationSchema, MetaData } from '../information-schema.interface';

@Injectable({
  providedIn: 'root'
})
export class ViewService {

  public schema: InformationSchema;
  public data: InformationData[];
  public filters: {}[];

  constructor(
    private backendService: BackendService
  ) { }

  public initialize(schema: InformationSchema): void {
    // Reset variables
    this.schema = schema;
    this.filters = this.generateFilters(this.schema);
    this.data = [];
    // Pull InformationData
    this.pullData();
  }

  private generateFilters(schema: InformationSchema): {}[] {
    let filters: {}[] = [];

    for (let i = 0; i < schema.metaData.length; i++) {
      filters.push({
        name: schema.metaData[i].name,
        key: 'metaData',
        index: i,
        type: schema.metaData[i].type,
        choice: null
      });
    }

    if (schema.content !== 'none' && schema.content !== 'dynamic') {
      filters.push({
        name: schema.displayName,
        key: 'content',
        index: null,
        type: schema.content,
        choice: null
      });
    }

    for (let i = 0; i < schema.parents.length; i++) {
      if (schema.parents[i].content !== 'none') {
        filters.push({
          name: schema.parents[i].displayName,
          key: 'parents',
          index: i,
          type: schema.parents[i].content,
          choice: null
        });
      }
    }

    return filters;
  }

  private pullData(): void {
    // Request all InformationData of current InformationSchema, subscribe Observable
    this.backendService.getData(this.schema._id, 'bySchema').subscribe(informationDataArray => {
      // Push InformationData-Object into this.informationData-Array
      informationDataArray.forEach(informationData => this.data.push(informationData));
    });
  }

  public getContent(dataset: InformationData, filter: Record<string, any>): string {
    let content: string = null;
    
    switch (filter.key) {
      case 'metaData':
        content = this.formatContent(
          dataset[filter.key][filter.index][filter.name], 
          filter.type
        );
        break;
      case 'content':
        content = this.formatContent(
          dataset.content, 
          filter.type
        );
        break;
      case 'parents':
        content = this.formatContent(
          dataset[filter.key][filter.index].content, 
          filter.type, 
          dataset[filter.key][filter.index].metaData, 
          this.schema[filter.key][filter.index].metaData
        );
        break;
      default:
        content = '';
    }

    return content;
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
