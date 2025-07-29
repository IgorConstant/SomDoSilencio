import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsPostsComponent } from './cards-posts.component';

describe('CardsPostsComponent', () => {
  let component: CardsPostsComponent;
  let fixture: ComponentFixture<CardsPostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardsPostsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardsPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
