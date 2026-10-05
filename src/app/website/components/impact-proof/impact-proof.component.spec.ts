import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImpactProofComponent } from './impact-proof.component';

describe('ImpactProofComponent', () => {
  let component: ImpactProofComponent;
  let fixture: ComponentFixture<ImpactProofComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImpactProofComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ImpactProofComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
