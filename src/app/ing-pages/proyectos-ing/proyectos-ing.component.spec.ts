import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectosIngComponent } from './proyectos-ing.component';

describe('ProyectosIngComponent', () => {
  let component: ProyectosIngComponent;
  let fixture: ComponentFixture<ProyectosIngComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProyectosIngComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProyectosIngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
