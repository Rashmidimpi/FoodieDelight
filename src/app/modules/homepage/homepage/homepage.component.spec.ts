import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ResturantListComponent } from '../resturant-list/resturant-list.component';

import { HomepageComponent } from './homepage.component';

describe('HomepageComponent', () => {
  let component: HomepageComponent;
  let fixture: ComponentFixture<HomepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomepageComponent, ResturantListComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, MatPaginatorModule, MatTableModule, MatCardModule, MatFormFieldModule, ReactiveFormsModule, FormsModule, MatInputModule, BrowserAnimationsModule],
      providers: []

    })
      .compileComponents();

    fixture = TestBed.createComponent(HomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should have ngOnInit', () => {
      component.ngOnInit();
    });
  });

  describe('logOut', () => {
    it('should set localStorage to false and navigate to home on logout', () => {
      localStorage.setItem('isLoggedin', 'false');
      const mockRouter = jasmine.createSpyObj('Router', ['navigate']);
      component.logout();
      expect(localStorage.getItem("isLoggedin")).toBe('false');
    });
  })
});
