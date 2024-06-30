import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit(): void {
  }

  logout() {
    localStorage.setItem("isLoggedin", "false");
    this.router.navigate(['/']);
  }
}
