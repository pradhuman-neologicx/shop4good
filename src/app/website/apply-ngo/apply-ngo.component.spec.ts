import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApplyNgoComponent } from './apply-ngo.component';

describe('ApplyNgoComponent', () => {
  let component: ApplyNgoComponent;
  let fixture: ComponentFixture<ApplyNgoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplyNgoComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ApplyNgoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
