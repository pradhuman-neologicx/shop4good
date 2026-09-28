import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgoImpactComponent } from './ngo-impact.component';

describe('NgoImpactComponent', () => {
  let component: NgoImpactComponent;
  let fixture: ComponentFixture<NgoImpactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgoImpactComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(NgoImpactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
