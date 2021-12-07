import { TestBed } from '@angular/core/testing';

import { TramosService } from './tramos.service';

describe('TramosService', () => {
  let service: TramosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TramosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
