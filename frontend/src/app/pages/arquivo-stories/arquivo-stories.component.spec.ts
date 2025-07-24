import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArquivoStoriesComponent } from './arquivo-stories.component';

describe('ArquivoStoriesComponent', () => {
  let component: ArquivoStoriesComponent;
  let fixture: ComponentFixture<ArquivoStoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArquivoStoriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArquivoStoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
