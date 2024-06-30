import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApiHandlerService } from '../../shared/api-handler.service';
import { SignupComponent } from './signup.component';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';


describe('SignupComponent', () => {
  let component: SignupComponent;
  let router: Router;
  let apiHandlerService: ApiHandlerService;
  let fixture: ComponentFixture<SignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignupComponent],
      imports: [HttpClientTestingModule, MatCardModule, MatFormFieldModule, ReactiveFormsModule, FormsModule, MatInputModule, BrowserAnimationsModule],
      providers: [ApiHandlerService, Router]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    apiHandlerService = TestBed.inject(ApiHandlerService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize form on ngOnInit', () => {
      spyOn(component, 'initializeForm').and.callThrough();
      component.ngOnInit();
      expect(component.initializeForm).toHaveBeenCalled();
      expect(component.registerForm).toBeTruthy();
    });
  });

  describe('initializeForm', () => {
    it('should create the registerForm with expected validators', () => {
      expect(component.registerForm).toBeTruthy();
      const formGroup = component.registerForm as FormGroup;
      expect(component.registerForm.contains('first_name')).toBe(true);
      expect(component.registerForm.contains('last_name')).toBe(true);
      expect(component.registerForm.contains('address')).toBe(true);
      expect(component.registerForm.contains('email')).toBe(true);
      expect(component.registerForm.contains('password')).toBe(true);
    });
  });

  describe('ascii_to_hexa', () => {
    it('should convert ASCII characters to hexadecimal string', () => {
      let result = component.ascii_to_hexa('A');
      expect(result).toBe('41');
      result = component.ascii_to_hexa('Hello');
      expect(result).toBe('48656c6c6f');
      result = component.ascii_to_hexa('');
      expect(result).toBe('');
      result = component.ascii_to_hexa('@#$%');
      expect(result).toBe('40232425');
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

  describe('registeruser', () => {
    it('should call apiService.postRequest with correct url and data on successful registration', () => {
      const expectedUrl = 'admin';
      const formData = { first_name: 'testuser', last_name: 'test', address: 'abc', email: 'abc@gmail.com', password: 'testpassword' };
      component.registerForm.setValue(formData);
      const mockApiResponse = 'mock response data';
      const mockApiService = spyOn(apiHandlerService, 'postRequest');
      mockApiService.and.returnValue(of(mockApiResponse));
      const swalSpy = spyOn(component, 'openSwal');
      component.registeruser();
      expect(mockApiService).toHaveBeenCalledWith(expectedUrl, formData);
      expect(swalSpy).toHaveBeenCalledWith('User registered', 'success');
    });

    it('should call swalService.openSwal with error message on API error', () => {
      const expectedUrl = 'admin';
      const formData = { first_name: 'testuser', last_name: 'test', address: 'abc', email: 'abc@gmail.com', password: 'testpassword' };
      component.registerForm.setValue(formData);
      const mockApiError = 'Error message';
      const mockApiService = spyOn(apiHandlerService, 'postRequest');
      mockApiService.and.returnValue(throwError(() => mockApiError));
      const swalSpy = spyOn(component, 'openSwal');
      component.registeruser();
      expect(mockApiService).toHaveBeenCalledWith(expectedUrl, formData);
      expect(swalSpy).toHaveBeenCalledWith('Something went wrong', 'error');
    });
  });

  describe('onSubmit', () => {
    it('should call emailCheck and registeruser on valid form and unique email', () => {
      const expectedUrl = 'admin';
      const formData = {
        first_name: 'John',
        last_name: 'Doe',
        address: '123 Main St',
        email: 'test@example.com',
        password: 'testpassword'
      };
      component.registerForm.setValue(formData);
      const mockApiService = spyOn(apiHandlerService, 'postRequest');
      const mockApiResponse = 'mock response data';
      mockApiService.and.returnValue(of(mockApiResponse));
      const mockService = spyOn(apiHandlerService, 'emailCheck').and.returnValue(of(false));
      component.registerForm.setValue(formData);
      component.onSubmit();
      expect(mockService).toHaveBeenCalledWith({ email: formData.email });
      component.registeruser();
    });

    it('should show error message when email is already registered', fakeAsync(() => {
      const formData = {
        first_name: 'John',
        last_name: 'Doe',
        address: '123 Main St',
        email: 'test@example.com',
        password: 'testpassword'
      };
      component.registerForm.setValue(formData);
      const mockApiService = spyOn(apiHandlerService, 'postRequest');
      const mockService = spyOn(apiHandlerService, 'emailCheck').and.returnValue(of('test@example.com'));
      const swalSpy = spyOn(component, 'openSwal');
      component.onSubmit();
      tick();
      expect(mockService).toHaveBeenCalledWith({ email: formData.email });
      expect(mockApiService).not.toHaveBeenCalled();
      expect(swalSpy).toHaveBeenCalledWith('Email already registered. Please try with another.', 'error');
    }));
  })

});
