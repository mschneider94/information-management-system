export interface InformationSchema {
  _id?: string;
  schemaVersion: string;
  name: string;
  view: string;
  content: any;
  parents: string[];
  metaData: any[];
}
