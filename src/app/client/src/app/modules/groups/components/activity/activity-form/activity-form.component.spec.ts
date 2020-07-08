import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityFormComponent } from './activity-form.component';
import { ResourceService, SharedModule } from '@sunbird/shared';
import { FormsModule } from '@angular/forms';
import { configureTestSuite } from '@sunbird/test-util';
import { CoreModule, FormService } from '@sunbird/core';
import { TelemetryModule } from '@sunbird/telemetry';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

describe('ActivityFormComponent', () => {
  let component: ActivityFormComponent;
  let fixture: ComponentFixture<ActivityFormComponent>;

  const resourceBundle = {
    'messages': {
      'fmsg': {
        'm0085': 'There is some technical error',
      }
    },
    'frmelmnts': {
      'lbl': {}
    }
  };
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ActivityFormComponent],
      imports: [SharedModule.forRoot(), CoreModule, FormsModule, TelemetryModule.forRoot(), HttpClientTestingModule],
      providers: [
        { provide: ResourceService, useValue: resourceBundle }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call chooseActivity', () => {
    component.chooseActivity({ title: 'courses' });
    expect(component.selectedActivity).toEqual({ title: 'courses' });
  });

  it('should call next', () => {
    component.selectedActivity = { title: 'courses' };
    spyOn(component.nextClick, 'emit');
    component.next();
    expect(component.nextClick.emit).toHaveBeenCalledWith({ activityType: 'courses' });
  });

  it('should get getFormDetails', () => {
    const response = [{ 'index': 1, 'title': 'ACTIVITY_COURSE_TITLE', 'desc': 'ACTIVITY_COURSE_DESC', 'activityType': 'Content', 'activityValues': ['Course'] }, { 'index': 2, 'title': 'ACTIVITY_TEXTBOOK_TITLE', 'desc': 'ACTIVITY_TEXTBOOK_DESC', 'activityType': 'Content', 'activityValues': ['TextBook'] }];
    const formService = TestBed.get(FormService);
    spyOn(component, 'chooseActivity');
    spyOn(formService, 'getFormConfig').and.returnValue(of(response));
    component['getFormDetails']();
    expect(component.chooseActivity).toHaveBeenCalledWith(response[0]);
    expect(component.activityTypes).toBeDefined();
  });

  it('should get getFormDetails', () => {
    const formService = TestBed.get(FormService);
    spyOn(formService, 'getFormConfig').and.returnValue(throwError({}));
    component['getFormDetails']();
    expect(component.activityTypes).not.toBeDefined();
  });
});
