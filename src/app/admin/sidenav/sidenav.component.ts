import { Component, OnInit, ChangeDetectionStrategy, input, output } from '@angular/core';
import { Router, RouterLinkActive, RouterLink } from '@angular/router';
import { JwtService } from 'src/app/core/services/jwt.service';
import { LoginService } from 'src/app/core/services/login.service';
import { NotificationService } from 'src/app/core/services/notificationnew.service';
import { MatNavList, MatListItem, MatListItemIcon, MatListItemTitle } from '@angular/material/list';
import { MatExpansionPanel, MatExpansionPanelHeader } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';

interface MenuItem {
  index: number;
  icon: string;
  label: string;
  route: string;
  subItems?: MenuItem[];
}

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrl: './sidenav.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatNavList, MatExpansionPanel, MatExpansionPanelHeader, MatIcon, MatListItem, RouterLinkActive, RouterLink, MatListItemIcon, MatListItemTitle]
})
export class SidenavComponent implements OnInit {
  menuItems: MenuItem[] = [];
  readonly collapsed = input<boolean>(false);
  readonly isMobile = input<boolean>(false);
  readonly closeSidenav = output<void>();

  constructor(
    private jwtService: JwtService,
    private router: Router,
    private loginService: LoginService,
    private notificationService: NotificationService,
  ) {}

  roles: any;
  ngOnInit(): void {
    this.roles = this.jwtService.getadmiRole();
    console.log('Roles:', this.roles);
    this.menuItems = [];

    if (this.roles == 'Super Admin') {
      this.menuItems = [
        {
          index: 1,
          icon: 'dashboard',
          label: 'Dashboard',
          route: '/admin/dashboard',
        },
        {
          index: 2,
          icon: 'people',
          label: 'Users',
          route: '/admin/users',
        },
        {
          index: 3,
          icon: 'volunteer_activism',
          label: 'Causes & Charities',
          route: '/admin/charities',
        },
        {
          index: 4,
          icon: 'storefront',
          label: 'Marketplaces',
          route: '/admin/marketplaces',
        },
        {
          index: 5,
          icon: 'receipt_long',
          label: 'Donations & TXNs',
          route: '/admin/donations',
        },
        {
          index: 6,
          icon: 'rule',
          label: 'Reconciliation',
          route: '/admin/reconciliation',
        },
      ];
    }
  }

  isExpanded: boolean = false;
  expandedSubmenu: string | null = null;

  isSubmenuExpanded(route: string): boolean {
    return this.expandedSubmenu === route;
  }

  toggleSubmenu(route: string): void {
    if (this.expandedSubmenu === route) {
      this.expandedSubmenu = null;
    } else {
      this.expandedSubmenu = route;
    }
  }

  closeSubmenu(): void {
    this.expandedSubmenu = null;
  }

  logout() {
    this.loginService.Adminlogout().subscribe({
      next: (response: any) => {
        this.jwtService.clearStorage();
        this.router.navigate(['/sign_in']);
        this.notificationService.show(response.message, 'success', 3000);
      },
      error: (err: any) => {
        this.jwtService.clearStorage();
        this.router.navigate(['/sign_in']);
        this.notificationService.show(err.message, 'error', 3000);
      },
    });
  }
}
