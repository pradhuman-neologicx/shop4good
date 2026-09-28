import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SlugComponent } from './slug.component';

describe('SlugComponent', () => {
  let component: SlugComponent;
  let fixture: ComponentFixture<SlugComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlugComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SlugComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
