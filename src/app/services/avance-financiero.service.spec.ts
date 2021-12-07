import { TestBed } from '@angular/core/testing';

import { AvanceFinancieroService } from './avance-financiero.service';

describe('AvanceFinancieroService', () => {
  let service: AvanceFinancieroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AvanceFinancieroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
