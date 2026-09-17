import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin.component').then(c => c.AdminComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component').then(c => c.DashboardComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./users/users.component').then(c => c.UsersComponent)
      },
      {
        path: 'charities',
        loadComponent: () => import('./charities/charities.component').then(c => c.CharitiesComponent)
      },
      {
        path: 'marketplaces',
        loadComponent: () => import('./marketplaces/marketplaces.component').then(c => c.MarketplacesComponent)
      },
      {
        path: 'donations',
        loadComponent: () => import('./donations/donations.component').then(c => c.DonationsComponent)
      },
      {
        path: 'reconciliation',
        loadComponent: () => import('./reconciliation/reconciliation.component').then(c => c.ReconciliationComponent)
      }
    ]
  },
  {
    path: 'login',
    loadComponent: () => import('./loginpages/loginpages.component').then(c => c.LoginpagesComponent)
  }
];
