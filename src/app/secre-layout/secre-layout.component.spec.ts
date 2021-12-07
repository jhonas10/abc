import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecreLayoutComponent } from './secre-layout.component';

describe('SecreLayoutComponent', () => {
  let component: SecreLayoutComponent;
  let fixture: ComponentFixture<SecreLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecreLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecreLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
