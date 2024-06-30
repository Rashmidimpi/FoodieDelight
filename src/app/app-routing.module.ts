import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SignupComponent } from './components/signup/signup.component';
import { AuthGuardService } from './shared/auth.guard';

const routes: Routes = [
  { path: '', component: NavbarComponent },
  { path: 'home', loadChildren: () => import('./modules/homepage/homepage.module').then(m => m.HomepageModule), canActivate: [AuthGuardService] },
  { path: 'sign-in', component: LoginComponent },
  { path: 'signup', component: SignupComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
