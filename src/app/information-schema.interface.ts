export interface InformationSchema {
  _id?: string;
  schemaVersion: string;
  category: string;
  view: string;
  content: any;
  displayName: string;
  parents: string[];
  metaData: any[];
}
