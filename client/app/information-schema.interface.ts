export interface MetaData {
  name: string;
  type: string;
}

export interface InformationSchema {
  _id?: string;
  schemaVersion: string;
  category: string;
  view: string;
  content: string;
  displayName: string;
  parents: string[];
  metaData: MetaData[];
}
