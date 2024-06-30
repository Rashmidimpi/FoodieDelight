import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiHandlerService } from '../../shared/api-handler.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errors = null;

  constructor(public router: Router, public fb: FormBuilder, private apiService: ApiHandlerService) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, , Validators.email]],
      password: [null, [Validators.required, Validators.minLength(8)]],
    })
  }

  ascii_to_hexa(str: any) {
    var arr1 = [];
    for (var n = 0, l = str.length; n < l; n++) {
      var hex = Number(str.charCodeAt(n)).toString(16);
      arr1.push(hex);
    }
    return arr1.join('');
  }

  onSubmit() {
    if (this.loginForm.valid) {
      let apidata = this.loginForm.value;
      apidata['password'] = this.ascii_to_hexa(this.loginForm.value.password);
      this.apiService.loginRequest(apidata).subscribe({
        next: (data: any) => {
          if (data[0]) {
            localStorage.setItem("isLoggedin", "true");
            this.router.navigate(['/home']);
          } else {
            localStorage.setItem("isLoggedin", "false");
            this.openSwal('Please enter valid credentials', 'error');
          }
        },
        error: (error: any) => {
          console.error(error);
          this.openSwal('Something went wrong', 'error');
        }
      });
    }
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

      } else if (result.isDenied) {
      }
    })
  }

}
