import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuradoriaComponent } from './curadoria.component';

describe('CuradoriaComponent', () => {
  let component: CuradoriaComponent;
  let fixture: ComponentFixture<CuradoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuradoriaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuradoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
