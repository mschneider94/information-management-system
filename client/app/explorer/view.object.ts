import { Type } from '@angular/core';

export class ViewObject {

  constructor(
    public component: Type<any>
  ) { }
}
