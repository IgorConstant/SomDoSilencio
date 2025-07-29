import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarPostagensDashboardComponent } from './listar-postagens-dashboard.component';

describe('ListarPostagensDashboardComponent', () => {
  let component: ListarPostagensDashboardComponent;
  let fixture: ComponentFixture<ListarPostagensDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarPostagensDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarPostagensDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
