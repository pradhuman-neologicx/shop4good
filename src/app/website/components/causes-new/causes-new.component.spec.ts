import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CausesNewComponent } from './causes-new.component';

describe('CausesNewComponent', () => {
  let component: CausesNewComponent;
  let fixture: ComponentFixture<CausesNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CausesNewComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CausesNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
