import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewTableComponent } from './view-table/view-table.component';

import { ViewObject } from './view.object';

describe('View', () => {
  it('should create an instance', () => {
    expect(new ViewObject(ViewTableComponent)).toBeTruthy();
  });
});
