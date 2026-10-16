import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChooseCauseComponent } from './choose-cause.component';

describe('ChooseCauseComponent', () => {
  let component: ChooseCauseComponent;
  let fixture: ComponentFixture<ChooseCauseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChooseCauseComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ChooseCauseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
