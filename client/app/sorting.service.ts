import { Injectable } from '@angular/core';

export interface Leaf {
  name: string;
  path: string;
  children?: Leaf[];
}

@Injectable({
  providedIn: 'root'
})
export class SortingService {

  constructor() { }

  public tree(branches: string[], fork: string, pathDelim: string): Leaf {
    branches.sort();

    let root: Leaf = { name: 'root', path: '', children: [] };
    
    for (let branch of branches) {
      let twigs: string[] = branch.split(fork);
    
      let pointer = root;

      for (let i = 0; i < twigs.length; i++) {
        let leaf: Leaf = null;

        leaf = pointer.children.find(element => element.name == twigs[i])
        if (!leaf) {
          leaf = { name: twigs[i], path: twigs.slice(0, i+1).join(pathDelim), children: [] };
          pointer.children.push(leaf);
        }
        pointer = leaf;
      }
    }
    
    return root;
  }
}
