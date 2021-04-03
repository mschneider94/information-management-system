import { TestBed } from '@angular/core/testing';

import { UserIDService } from './user-id.service';

describe('UserIDService', () => {
  let service: UserIDService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserIDService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
