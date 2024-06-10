import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundSquareComponent } from './background-square.component';

describe('BackgroundSquareComponent', () => {
  let component: BackgroundSquareComponent;
  let fixture: ComponentFixture<BackgroundSquareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackgroundSquareComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BackgroundSquareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
