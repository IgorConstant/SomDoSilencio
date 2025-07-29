import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarPostDashboardComponent } from './editar-post-dashboard.component';

describe('EditarPostDashboardComponent', () => {
  let component: EditarPostDashboardComponent;
  let fixture: ComponentFixture<EditarPostDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarPostDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarPostDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
