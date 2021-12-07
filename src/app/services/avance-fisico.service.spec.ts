import { TestBed } from '@angular/core/testing';

import { AvanceFisicoService } from './avance-fisico.service';

describe('AvanceFisicoService', () => {
  let service: AvanceFisicoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AvanceFisicoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
