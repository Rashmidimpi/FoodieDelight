import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { ApiHandlerService } from '../../../shared/api-handler.service';
import { ResturantModalComponent } from './resturant-modal.component';


describe('ResturantModalComponent', () => {
  let component: ResturantModalComponent;
  let dialog: MatDialog;
  let apiHandlerService: ApiHandlerService;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ResturantModalComponent>>;
  let fixture: ComponentFixture<ResturantModalComponent>;

  beforeEach(async () => {
    const matDialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    await TestBed.configureTestingModule({
      declarations: [ResturantModalComponent],
      imports: [HttpClientTestingModule, MatCardModule, MatDialogModule, MatFormFieldModule, ReactiveFormsModule, FormsModule, MatInputModule, BrowserAnimationsModule],
      providers: [ApiHandlerService, Router, {
        provide: MAT_DIALOG_DATA, useValue: []
      },
        { provide: MatDialogRef, useValue: { matDialogRefSpy } },
        { provide: MatDialog, useValue: { open: () => { } } }]

    })
      .compileComponents();

    fixture = TestBed.createComponent(ResturantModalComponent);
    apiHandlerService = TestBed.inject(ApiHandlerService);
    dialog = TestBed.inject(MatDialog);
    dialogRefSpy = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<ResturantModalComponent>>;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize form and fetch restaurant data if isEdit is true', () => {
      component.isEdit = true;
      component.selectedItem = { id: 1 };
      const mockRestaurantData = { id: 1, name: 'Restaurant 1' };
      component.getResturantData(mockRestaurantData.id);
      spyOn(component, 'initializeForm').and.callThrough();
      spyOn(component, 'getResturantData').and.callThrough();
      component.ngOnInit();
      expect(component.initializeForm).toHaveBeenCalled();
      expect(component.getResturantData).toHaveBeenCalledWith(component.selectedItem.id);
      expect(component.createRecordform).toBeDefined();
    });

    it('should initialize form but not fetch restaurant data if isEdit is false', () => {
      component.isEdit = false;
      spyOn(component, 'initializeForm').and.callThrough();
      spyOn(component, 'getResturantData').and.callThrough();
      component.ngOnInit();
      expect(component.initializeForm).toHaveBeenCalled();
      expect(component.getResturantData).not.toHaveBeenCalled();
      expect(component.createRecordform).toBeDefined();
    });
  });

  describe('getResturantData', () => {
    it('should update form with selectedItem data', () => {
      component.selectedItem = {
        id: 1,
        name: 'Test Restaurant',
        description: 'Test description',
        address: 'xys',
        zip: '123445',
        mobile: '42424424242',
        city: 'test'
      };
      component.getResturantData(component.selectedItem.id);
      expect(component.createRecordform.value).toEqual({
        name: 'Test Restaurant',
        description: 'Test description',
        address: 'xys',
        zip: '123445',
        mobile: '42424424242',
        city: 'test'
      });
    });

  })
});
