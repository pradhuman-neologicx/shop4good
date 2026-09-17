import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth/auth-guard';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./website/home/home.component').then(c => c.HomeComponent) 
  },
  { 
    path: 'privacy-policy', 
    loadComponent: () => import('./website/privacy-policy/privacy-policy.component').then(c => c.PrivacyPolicyComponent) 
  },
  { 
    path: 'terms-and-conditions', 
    loadComponent: () => import('./website/terms-and-conditions/terms-and-conditions.component').then(c => c.TermsAndConditionsComponent) 
  },
  { 
    path: 'contact', 
    loadComponent: () => import('./website/contact/contact.component').then(c => c.ContactComponent) 
  },

  {
    path: 'auth/login',
    loadComponent: () => import('./website/auth/login/login.component').then(c => c.LoginComponent)
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./website/auth/register/register.component').then(c => c.RegisterComponent)
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./admin/loginpages/signin/signin.component').then(c => c.SigninComponent)
  },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES)
  }
];
