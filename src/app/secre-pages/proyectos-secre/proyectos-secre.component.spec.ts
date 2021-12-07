import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectosSecreComponent } from './proyectos-secre.component';

describe('ProyectosSecreComponent', () => {
  let component: ProyectosSecreComponent;
  let fixture: ComponentFixture<ProyectosSecreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProyectosSecreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProyectosSecreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
