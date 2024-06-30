import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { ApiHandlerService } from '../../../shared/api-handler.service';
import { ResturantModalComponent } from '../resturant-modal/resturant-modal.component';
import { ResturantListComponent } from './resturant-list.component';


describe('ResturantListComponent', () => {
  let component: ResturantListComponent;
  let apiHandlerService: ApiHandlerService;
  let matPaginator: MatPaginator;
  let dialog: MatDialog;
  let fixture: ComponentFixture<ResturantListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResturantListComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, MatPaginatorModule, MatSortModule, MatPaginator, MatTableModule, MatCardModule, MatFormFieldModule, ReactiveFormsModule, FormsModule, MatInputModule, BrowserAnimationsModule],
      providers: [ApiHandlerService, Router, { provide: MatDialog, useValue: { open: () => { } } }]


    })
      .compileComponents();

    fixture = TestBed.createComponent(ResturantListComponent);
    apiHandlerService = TestBed.inject(ApiHandlerService);
    dialog = TestBed.inject(MatDialog);
    const paginatorSpy = TestBed.inject(MatPaginatorModule);
    const sortSpy = TestBed.inject(MatSortModule);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call getResturantList on ngOnInit', () => {
      const mockApiService = spyOn(apiHandlerService, 'getRequest');
      const mockRestaurantList = ['Restaurant A', 'Restaurant B'];
      mockApiService.and.returnValue(of(mockRestaurantList));
      component.ngOnInit();
      expect(mockApiService).toHaveBeenCalled();
    });
  });

  describe('getResturantList', () => {
    it('should fetch restaurant list and populate data source', () => {
      const mockApiService = spyOn(apiHandlerService, 'getRequest');
      const mockRestaurantList = ['Restaurant A', 'Restaurant B'];
      mockApiService.and.returnValue(of(mockRestaurantList));
      component.getResturantList();
      expect(mockApiService).toHaveBeenCalledWith('resturant');
      expect(component.dataSource).toBeDefined();
      expect(component.dataSource.data).toEqual(mockRestaurantList);
      expect(component.dataSource.paginator).toBeDefined();
      expect(component.dataSource.sort).toBeDefined();
    });
  });

  describe('onSearchKeyUp', () => {
    it('should update dataSource filter', () => {
      const searchValue = { value: 'Restaurant A' };
      component.onSearchKeyUp(searchValue);
      expect(component.dataSource.filter).toBe('Restaurant A');
    });

    it('should handle empty search value', () => {
      const searchValue = { value: '' };
      component.onSearchKeyUp(searchValue);
      expect(component.dataSource.filter).toBe('');
    });
  });

  describe('deleteRecord', () => {
    it('should delete record when confirmed', fakeAsync(() => {
      const idToDelete = 123;
      const mockResponse = { message: 'Record deleted' };
      const mockApiService = spyOn(apiHandlerService, 'deleteRequest');
      const swalFireSpy = spyOn(Swal, 'fire').and.callThrough();

      swalFireSpy.and.returnValue(Promise.resolve({
        isConfirmed: true,
        isDenied: false,
        isDismissed: false,
      } as SweetAlertResult<any>));
      mockApiService.and.returnValue(of(mockResponse));
      spyOn(component, 'getResturantList');
      component.deleteRecord(idToDelete);
      tick();
      expect(swalFireSpy).toHaveBeenCalledWith(jasmine.objectContaining({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }));
      expect(mockApiService).toHaveBeenCalledWith('resturant/', idToDelete);
      expect(component.getResturantList).toHaveBeenCalled();
    }));

    it('should not delete record when cancelled', fakeAsync(() => {
      const idToDelete = 123;
      const mockApiService = spyOn(apiHandlerService, 'deleteRequest');
      const swalFireSpy = spyOn(Swal, 'fire').and.callThrough();
      spyOn(component, 'getResturantList');
      swalFireSpy.and.returnValue(Promise.resolve({
        isConfirmed: false,
        isDenied: true,
        isDismissed: false,
      } as SweetAlertResult<any>));
      component.deleteRecord(idToDelete);
      expect(swalFireSpy).toHaveBeenCalledWith(jasmine.objectContaining({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }));
      expect(mockApiService).not.toHaveBeenCalled();
      expect(component.getResturantList).not.toHaveBeenCalled();
    }));
  });

  describe('editRecord', () => {
    it('should open edit dialog and update record on closure', fakeAsync(() => {
      const idToUpdate = 123;
      const mockApiService = spyOn(component, 'updateRecord');
      const mockData = { id: 1, name: 'abc', description: 'desc' };
      const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(mockData) });
      spyOn(dialog, 'open').and.returnValue(dialogRefSpyObj as MatDialogRef<any>);
      component.editRecord(idToUpdate, mockData);
      const expectedDialogConfig = new MatDialogConfig();
      expectedDialogConfig.disableClose = true;
      expectedDialogConfig.autoFocus = true;
      expectedDialogConfig.height = '90%';
      expectedDialogConfig.width = '50%';
      const expectedInitialState = {
        isEdit: true,
        selectedItem: mockData,
      };
      expect(dialog.open).toHaveBeenCalledWith(ResturantModalComponent, jasmine.objectContaining({
        ...expectedDialogConfig,
        data: expectedInitialState
      }));
      tick();
      expect(mockApiService).toHaveBeenCalledWith(mockData, idToUpdate);
    }));
  });

  describe('addResturant', () => {
    it('should open add dialog and create new record on closure', fakeAsync(() => {
      const mockData = { id: 1, name: 'abc', description: 'desc' };
      const mockApiService = spyOn(component, 'createNewRecord');
      const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(mockData) });
      spyOn(dialog, 'open').and.returnValue(dialogRefSpyObj as MatDialogRef<any>);
      component.addResturant();
      const expectedDialogConfig = new MatDialogConfig();
      expectedDialogConfig.disableClose = true;
      expectedDialogConfig.autoFocus = true;
      expectedDialogConfig.height = '90%';
      expectedDialogConfig.width = '50%';
      const expectedInitialState = {
        isEdit: false,
      };
      expect(dialog.open).toHaveBeenCalledWith(ResturantModalComponent, jasmine.objectContaining({
        ...expectedDialogConfig,
        data: expectedInitialState
      }));
      tick();
      expect(mockApiService).toHaveBeenCalledWith(mockData);
    }));
  });

  describe('createNewRecord', () => {
    it('should create new record and show success message', () => {
      const mockData = { id: 1, name: 'abc', description: 'desc' };
      const mockResponse = { success: 'Record created' };
      const mockApiService = spyOn(apiHandlerService, 'postRequest');
      mockApiService.and.returnValue(of(mockResponse));
      const swalFireSpy = spyOn(Swal, 'fire').and.callThrough();
      spyOn(component, 'getResturantList');
      component.createNewRecord(mockData);
      const expectedUrl = 'resturant';
      expect(mockApiService).toHaveBeenCalledWith(expectedUrl, mockData);
      expect(component.getResturantList).toHaveBeenCalled();
      expect(swalFireSpy).toHaveBeenCalledWith({
        title: 'Resturant data stored',
        icon: 'success',
        showCancelButton: false,
        showDenyButton: false,
        confirmButtonText: 'Ok',
        denyButtonText: "Don't save"
      } as any);
    });

    it('should handle error from API and show error message', () => {
      const mockData = { id: 1, name: 'abc', description: 'desc' };
      const mockError = 'API Error';
      const mockApiService = spyOn(apiHandlerService, 'postRequest');
      const swalFireSpy = spyOn(Swal, 'fire').and.callThrough();
      mockApiService.and.returnValue(throwError(() => mockError));
      component.createNewRecord(mockData);
      const expectedUrl = 'resturant';
      expect(mockApiService).toHaveBeenCalledWith(expectedUrl, mockData);
      expect(swalFireSpy).toHaveBeenCalledWith({
        title: 'Something went wrong',
        icon: 'error',
        showCancelButton: false,
        showDenyButton: false,
        confirmButtonText: 'Ok',
        denyButtonText: "Don't save"
      } as any);
    });
  });

  describe('updateRecord', () => {
    it('should update record and show success message', () => {
      const mockData = { id: 1, name: 'abc', description: 'desc' };
      const mockResponse = { success: 'Record updated' };
      const mockApiService = spyOn(apiHandlerService, 'updateRequest');
      mockApiService.and.returnValue(of(mockResponse));
      spyOn(component, 'getResturantList');
      const swalFireSpy = spyOn(Swal, 'fire');
      component.updateRecord(mockData, 1);
      const expectedUrl = 'resturant/';
      expect(mockApiService).toHaveBeenCalledWith(expectedUrl, 1, mockData);
      expect(component.getResturantList).toHaveBeenCalled();
      expect(swalFireSpy).toHaveBeenCalledWith({
        title: 'Restaurant data updated',
        icon: 'success',
        showCancelButton: false,
        showDenyButton: false,
        confirmButtonText: 'Ok',
        denyButtonText: "Don't save"
      } as any);
    });

    it('should handle error from API and show error message', () => {
      const mockData = { id: 1, name: 'abc', description: 'desc' };
      const mockError = 'API Error';
      const mockApiService = spyOn(apiHandlerService, 'updateRequest');
      mockApiService.and.returnValue(throwError(() => mockError));
      const swalFireSpy = spyOn(Swal, 'fire');
      component.updateRecord(mockData, 1);
      const expectedUrl = 'resturant/';
      expect(mockApiService).toHaveBeenCalledWith(expectedUrl, 1, mockData);
      expect(swalFireSpy).toHaveBeenCalledWith({
        title: 'Something went wrong',
        icon: 'error',
        showCancelButton: false,
        showDenyButton: false,
        confirmButtonText: 'Ok',
        denyButtonText: "Don't save"
      } as any);
    });
  });

  describe('openSwal', () => {
    it('should call Swal with expected options and navigate on confirm', () => {
      const mockTitle = 'Success!';
      const mockIcon = 'success';
      const swalSpy = spyOn(Swal, 'fire').and.callThrough();
      component.openSwal(mockTitle, mockIcon);
      const expectedOptions: any = {
        title: mockTitle,
        icon: mockIcon,
        showDenyButton: false,
        showCancelButton: false,
        confirmButtonText: 'Ok',
        denyButtonText: 'Don\'t save',
      };
      expect(swalSpy).toHaveBeenCalledWith(expectedOptions);
    });
  });
});
