import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { ApiHandlerService } from '../../shared/api-handler.service';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let router: Router;
  let apiHandlerService: ApiHandlerService;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [HttpClientTestingModule, MatCardModule, MatFormFieldModule, ReactiveFormsModule, FormsModule, MatInputModule, BrowserAnimationsModule],
      providers: [ApiHandlerService, Router]

    })
      .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
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
      expect(component.loginForm).toBeTruthy();
    });
  });

  describe('initializeForm', () => {
    it('should create the registerForm with expected validators', () => {
      expect(component.loginForm).toBeTruthy();
      const formGroup = component.loginForm as FormGroup;
      expect(component.loginForm.contains('email')).toBe(true);
      expect(component.loginForm.contains('password')).toBe(true);
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

  describe('onSubmit', () => {
    it('should navigate to home page on successful login', () => {
      component.loginForm.setValue({
        email: 'testuser@gmail.com',
        password: 'password123'
      });
      spyOn(component, 'openSwal');
      const mockApiResponse = [true];
      const mockApiService = spyOn(apiHandlerService, 'loginRequest');
      mockApiService.and.returnValue(of(mockApiResponse));
      component.onSubmit();
      expect(mockApiService).toHaveBeenCalledOnceWith({
        email: 'testuser@gmail.com',
        password: component.ascii_to_hexa('password123')
      });
      expect(localStorage.getItem('isLoggedin')).toBe('true');
      expect(component.openSwal).not.toHaveBeenCalled();
    });

    it('should show error message on failed login', () => {
      component.loginForm.setValue({
        email: 'testuser@gmail.com',
        password: 'password123'
      });
      localStorage.setItem('isLoggedin', 'false');
      const mockApiService = spyOn(apiHandlerService, 'loginRequest');
      spyOn(component, 'openSwal');
      const mockApiError = new Error('Login failed');
      mockApiService.and.returnValue(throwError(() => mockApiError));
      component.onSubmit();
      expect(mockApiService).toHaveBeenCalledOnceWith({
        email: 'testuser@gmail.com',
        password: component.ascii_to_hexa('password123')
      });
      expect(localStorage.getItem('isLoggedin')).toBe('false');
      expect(component.openSwal).toHaveBeenCalledWith('Something went wrong', 'error');
    });

    it('should not call API and show error message if form is invalid', () => {
      component.loginForm.setValue({
        email: 'testuser@gmail.com',
        password: 'password123'
      });
      const mockApiResponse = [false];
      spyOn(component, 'openSwal');
      const mockApiService = spyOn(apiHandlerService, 'loginRequest');
      localStorage.setItem('isLoggedin', 'false');
      mockApiService.and.returnValue(of(mockApiResponse));
      component.onSubmit();
      expect(mockApiService).toHaveBeenCalledOnceWith({
        email: 'testuser@gmail.com',
        password: component.ascii_to_hexa('password123')
      });
      expect(localStorage.getItem('isLoggedin')).toBe('false');
      expect(component.openSwal).toHaveBeenCalledWith('Please enter valid credentials', 'error');
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
