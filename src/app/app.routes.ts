import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth/auth-guard';
import { CustomerAuthGuard } from './core/auth/customer-auth-guard';

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
    path: 'help/faqs',
    loadComponent: () => import('./website/faq/faq.component').then(c => c.FaqComponent)
  },
  {
    path: 'faqs',
    loadComponent: () => import('./website/faq/faq.component').then(c => c.FaqComponent)
  },
  {
    path: 'faq',
    loadComponent: () => import('./website/faq/faq.component').then(c => c.FaqComponent)
  },


  {
    path: 'causes',
    redirectTo: 'causes/kids',
    pathMatch: 'full'
  },
  // {
  //   path: 'causes-new',
  //   redirectTo: 'causes/kids',
  //   pathMatch: 'full'
  // },
  {
    path: 'causes/:id',
    loadComponent: () => import('./website/causes-new-details/causes-new-details.component').then(c => c.CausesNewDetailsComponent)
  },
  // {
  //   path: 'causes-new/:id',
  //   loadComponent: () => import('./website/causes-new-details/causes-new-details.component').then(c => c.CausesNewDetailsComponent)
  // },
  {
    path: 'about/about-us',
    loadComponent: () => import('./website/about-us/about-us.component').then(c => c.AboutUsComponent)
  },
  {
    path: 'about-us',
    loadComponent: () => import('./website/about-us/about-us.component').then(c => c.AboutUsComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./website/about-us/about-us.component').then(c => c.AboutUsComponent)
  },
  {
    path: 'about/our-story',
    loadComponent: () => import('./website/our-story/our-story.component').then(c => c.OurStoryComponent)
  },
  {
    path: 'our-story',
    loadComponent: () => import('./website/our-story/our-story.component').then(c => c.OurStoryComponent)
  },
  {
    path: 'about/how-it-works',
    loadComponent: () => import('./website/how-it-works/how-it-works.component').then(c => c.HowItWorksComponent)
  },
  {
    path: 'how-it-works',
    loadComponent: () => import('./website/how-it-works/how-it-works.component').then(c => c.HowItWorksComponent)
  },
  {
    path: 'about/our-impact',
    loadComponent: () => import('./website/our-impact/our-impact.component').then(c => c.OurImpactComponent)
  },
  {
    path: 'our-impact',
    loadComponent: () => import('./website/our-impact/our-impact.component').then(c => c.OurImpactComponent)
  },
  {
    path: 'about/partner-with-us',
    loadComponent: () => import('./website/partner-with-us/partner-with-us.component').then(c => c.PartnerWithUsComponent)
  },
  {
    path: 'partner-with-us',
    loadComponent: () => import('./website/partner-with-us/partner-with-us.component').then(c => c.PartnerWithUsComponent)
  },
  {
    path: 'apply-ngo',
    loadComponent: () => import('./website/apply-ngo/apply-ngo.component').then(c => c.ApplyNgoComponent)
  },
  {
    path: 'about/apply-ngo',
    loadComponent: () => import('./website/apply-ngo/apply-ngo.component').then(c => c.ApplyNgoComponent)
  },
  {
    path: 'partner-with-us/apply',
    loadComponent: () => import('./website/apply-ngo/apply-ngo.component').then(c => c.ApplyNgoComponent)
  },
  {
    path: 'shop',
    canActivate: [CustomerAuthGuard],
    loadComponent: () => import('./website/shop/shop.component').then(c => c.ShopComponent)
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
    path: 'profile',
    canActivate: [CustomerAuthGuard],
    loadComponent: () => import('./website/customer-profile/customer-profile.component').then(c => c.CustomerProfileComponent)
  },

  {
    path: 'admin/login',
    loadComponent: () => import('./admin/loginpages/signin/signin.component').then(c => c.SigninComponent)
  },
  {
    path: 'admin/forgot-password',
    loadComponent: () => import('./admin/loginpages/forgot-password/forgot-password.component').then(c => c.ForgotPasswordComponent)
  },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES)
  }
];
