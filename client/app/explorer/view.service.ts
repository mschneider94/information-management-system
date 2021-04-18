import { Injectable } from '@angular/core';
import { cloneDeep, remove } from 'lodash';
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
  public editorCache: InformationData;
  // check if content possible
  // input metaData
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
    this.editorCache = this.generateNewInformationData(this.schema);
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
        let object: Record<string,any> = {
          schema: schema.parents[i]._id,
          name: schema.parents[i].displayName,
          key: 'parents',
          index: i,
          type: schema.parents[i].content,
          choice: null,
          values: {}
        };
        this.pullParentPreview(schema.parents[i], object.values);
        filters.push(object);
      }
    }

    return filters;
  }

  private generateNewInformationData(schema: InformationSchema): InformationData {
    let newInformationData = {
      schema: schema._id,
      content: null,
      parents: [],
      metaData: []
    };

    for (let filter of this.filters.filter(filter => filter.key === 'metaData')) {
      newInformationData.metaData.push({
        [filter.name]: null
      });
    }

    return newInformationData;
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

  private setVisibility(dataset: InformationData): void {
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

  public shout(): void {
    console.log(this.filters);
  }

  public updateEditorCache(dataset?: InformationData): void {
    if (dataset) {
      this.editorCache = cloneDeep(dataset);
    } else {
      this.editorCache = cloneDeep(this.generateNewInformationData(this.schema));
    }
  }

  public editorCacheAddParent(id: string): void {
    // Request InformationData by by id, subscribe Observable
    this.backendService.getData(id, 'byId').subscribe(informationDataArray => {
      informationDataArray.forEach(informationData => {
        // Push InformationData-Object into this.editorCache.parents
        this.editorCache.parents.push(informationData);
      });
    });
  }

  public editorCacheRemoveParent(id: string): void {
    remove(this.editorCache.parents, item => id === item._id);
  }

  public writeEditorCache(): void {
    if (this.editorCache._id) {
      let index = this.data.findIndex(item => this.editorCache._id === item._id);

      if (index !== -1) {
        //this.data[index] = this.editorCache;
        this.backendService.updateData(this.editorCache).subscribe(result => this.data[index] = result);
      } else {
        this.messageService.show(`ViewService.writeEditorCache: invalid Object-ID ${this.editorCache._id}`, 'danger');
      }
    } else {
      //this.data.push(this.editorCache);
      this.backendService.addData(this.editorCache).subscribe(result => this.data.push(result));
    }

    this.updateVisibility();

    // Write to Database!!!
  }

  public deleteEditorCache(): void {
    if (this.editorCache._id) {
      this.backendService.deleteData(this.editorCache._id).subscribe(result => {
        remove(this.data, item => result._id === item._id);
      });
    }

    this.editorCache = this.generateNewInformationData(this.schema);
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

  private pullParentPreview(parent: Record<string,any>, target: Record<string,any>[]): void {
    // Request all InformationData of selected InformationSchema, subscribe Observable
    this.backendService.getData(parent._id, 'bySchema').subscribe(informationDataArray => {
      informationDataArray.forEach(informationData => {
        // Push Preview of Parent into target
        target[informationData._id] = this.formatContent(informationData.content, parent.content, informationData.metaData, parent.metaData);
        console.log(target);
      });
    });
  }

  public getContent(dataset: InformationData, filter: Record<string, any>): string {
    let content: string = null;
    
    switch (filter.key) {
      case 'metaData':
        let metaData = dataset.metaData.find(item => Object.keys(item).find(key => key === filter.name));
        if (metaData) {
          content = this.formatContent(
            metaData[filter.name], 
            filter.type
          );
        }
        break;
      case 'content':
        content = this.formatContent(
          dataset.content, 
          filter.type
        );
        break;
      case 'parents':
        let parent = dataset.parents.find(item => item.schema === filter.schema);
        if (parent) {
          content = this.formatContent(
            parent.content, 
            filter.type, 
            parent.metaData, 
            this.schema.parents[filter.index].metaData
          );
        }
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
