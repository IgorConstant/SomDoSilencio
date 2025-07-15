import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarPostsSiteComponent } from './listar-posts-site.component';

describe('ListarPostsSiteComponent', () => {
  let component: ListarPostsSiteComponent;
  let fixture: ComponentFixture<ListarPostsSiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarPostsSiteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarPostsSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
