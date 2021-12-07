import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngLayoutComponent } from './ing-layout.component';

describe('IngLayoutComponent', () => {
  let component: IngLayoutComponent;
  let fixture: ComponentFixture<IngLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IngLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IngLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
