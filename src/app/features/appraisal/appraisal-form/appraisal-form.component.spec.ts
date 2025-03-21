import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppraisalFormComponent } from './appraisal-form.component';

describe('AppraisalFormComponent', () => {
  let component: AppraisalFormComponent;
  let fixture: ComponentFixture<AppraisalFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppraisalFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppraisalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
