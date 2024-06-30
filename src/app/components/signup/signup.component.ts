import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiHandlerService } from '../../shared/api-handler.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit {
  registerForm!: FormGroup;
  errors = null;
  constructor(public router: Router, public fb: FormBuilder, private apiService: ApiHandlerService) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.registerForm = this.fb.group({
      first_name: [null, [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      last_name: [null, [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      address: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(8)]],
    })
  }

  ascii_to_hexa(str: any) {
    let arr1 = [];
    for (let n = 0, l = str.length; n < l; n++) {
      let hex = Number(str.charCodeAt(n)).toString(16);
      arr1.push(hex);
    }
    return arr1.join('');
  }

  openSwal(title: any, icon: any) {
    Swal.fire({
      title: title,
      icon: icon,
      showDenyButton: false,
      showCancelButton: false,
      confirmButtonText: `Ok`,
      denyButtonText: `Don't save`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/']);
      } else if (result.isDenied) {

      }
    })
  }

  registeruser() {
    let url = 'admin';
    let apidata = this.registerForm.value;
    this.apiService.postRequest(url, apidata).subscribe({
      next: (data) => {
        this.openSwal('User registered', 'success');
      },
      error: (error) => {
        console.log(error);
        this.openSwal('Something went wrong', 'error');
      }
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      let apiData = this.registerForm.value;
      apiData['password'] = this.ascii_to_hexa(this.registerForm.value.password);
      this.apiService.emailCheck({ email: this.registerForm.value.email }).subscribe(
        (data) => {
          if (data[0]) {
            this.openSwal('Email already registered. Please try with another.', 'error');
          } else {
            this.registeruser();
          }
        }
      )
    }
  }

}
