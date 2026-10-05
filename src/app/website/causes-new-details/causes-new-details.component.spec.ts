import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CausesNewDetailsComponent } from './causes-new-details.component';

describe('CausesNewDetailsComponent', () => {
  let component: CausesNewDetailsComponent;
  let fixture: ComponentFixture<CausesNewDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CausesNewDetailsComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CausesNewDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
