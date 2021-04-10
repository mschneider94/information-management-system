import { Injectable } from '@angular/core';
import { BackendService } from '../backend.service';
import { InformationData } from '../information-data.interface';
import { InformationSchema, MetaData } from '../information-schema.interface';
import { MessageService } from '../message.service';

@Injectable({
  providedIn: 'root'
})
export class ViewService {

  public schema: InformationSchema;
  public data: InformationData[];
  public filters: Record<string,any>[];
  public visibleData: {};
  private updateVisibilityTimeout;

  constructor(
    private backendService: BackendService,
    private messageService: MessageService
  ) { }

  public initialize(schema: InformationSchema): void {
    // Reset variables
    this.schema = schema;
    this.filters = this.generateFilters(this.schema);
    this.data = [];
    this.visibleData = {};
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

  public updateVisibility(): void {
    let timeout = 300;
    // Clear last timeout
    clearTimeout(this.updateVisibilityTimeout);
    // Set new timeout
    this.updateVisibilityTimeout = setTimeout(() => {
      this.messageService.debug(`ViewService.updateVisibility`);
      for (let i = 0; i < this.data.length; i++) {
        if (this.data[i]) {
          this.setVisibility(this.data[i]);
        }
      }
    }, timeout);
  }

  private setVisibility(dataset?: InformationData): void {
    let visibility = true;

    // Iterate over this.filters
    for (let i = 0; i < this.filters.length && visibility; i++) {
      // skip empty choices
      if (this.filters[i].choice && this.filters[i].choice !== '') {
        // test each term of choice
        for (let term of this.filters[i].choice.split(' ')) {
          // create regex from term
          let regex = new RegExp(`\\b${term.replace(/\*/g, '.*')}\\b`, 'i');
          // test regex against content
          if (!regex.test(this.getContent(dataset, this.filters[i]))) {
            visibility = false;
            break; // break inner-loop explicit, outer-loop will break implicit
          }
        }
      }
    }

    this.visibleData[dataset._id] = visibility;
  }

  public shout(filter: Record<string,any>): void {
    console.log(filter);
  }

  private pullData(): void {
    // Request all InformationData of current InformationSchema, subscribe Observable
    this.backendService.getData(this.schema._id, 'bySchema').subscribe(informationDataArray => {
      informationDataArray.forEach(informationData => {
        // Push InformationData-Object into this.informationData-Array
        this.data.push(informationData);
        // Include into this.visibleData
        this.setVisibility(informationData);
      });
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
