import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ChangeDetectionStrategy,
  input,
  output,
  OnDestroy
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { JwtService } from 'src/app/core/services/jwt.service';
import { ApiService } from 'src/app/core/services/api.service';
import { NotificationService } from 'src/app/core/services/notificationnew.service';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { UpperCasePipe, SlicePipe, DatePipe, NgOptimizedImage } from '@angular/common';
import { TooltipTriggerDirective } from '../../core/directives/tooltip-trigger.directive';
import { PopoverTriggerDirective } from '../../core/directives/popover-trigger.directive';

export interface Notification {
  id: string;
  data: {
    booking_id: string;
    member_name: string;
    asset_name: string;
    message: string;
    type: string;
  };
  read_at: string | null;
  created_at: string;
}

@Component({
  selector: 'app-sidenav-header',
  templateUrl: './sidenav-header.component.html',
  styleUrl: './sidenav-header.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatIconButton, MatIcon, RouterLink, UpperCasePipe, SlicePipe, DatePipe, NgOptimizedImage, TooltipTriggerDirective, PopoverTriggerDirective]
})
export class SidenavHeaderComponent implements OnInit, OnDestroy {
  readonly isMobile = input<boolean>(false);
  readonly toggleCollapsed = output<void>();
  searchQuery: string = '';

  notifications: Notification[] = [];
  private pollInterval: any;

  fetchNotifications() {
    // this.apiService.get('admin/notifications').subscribe({
    //   next: (res: any) => {
    //     if (res.status === 200) {
    //       this.notifications = res.data;
    //     }
    //   },
    //   error: (err: any) => console.error('Failed to fetch notifications'),
    // });

    // Mock Notifications Data
    this.notifications = [
      {
        id: 'uuid-1',
        data: {
          booking_id: 'BK-10025',
          member_name: 'Bhupesh Singh',
          asset_name: 'Medical Bed',
          message: 'Requested a new asset booking',
          type: 'booking',
        },
        read_at: null,
        created_at: new Date(new Date().getTime() - 1000 * 60 * 5).toISOString(), // 5 mins ago
      },
      {
        id: 'uuid-2',
        data: {
          booking_id: 'BK-10026',
          member_name: 'Amit Sharma',
          asset_name: 'Oxygen Concentrator',
          message: 'Emergency request for oxygen',
          type: 'booking',
        },
        read_at: null,
        created_at: new Date(new Date().getTime() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      },
      {
        id: 'uuid-3',
        data: {
          booking_id: 'BK-10027',
          member_name: 'Priya Verma',
          asset_name: 'Wheelchair',
          message: 'Asset return requested',
          type: 'return',
        },
        read_at: null,
        created_at: new Date(new Date().getTime() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      },
    ];
  }

  markAsRead(uuid: string, event: Event) {
    event.stopPropagation();
    // this.apiService.post(`admin/notifications/${uuid}/read`, {}).subscribe({
    //   next: (res: any) => {
    //     if (res.status === 200) {
    //       this.notifications = this.notifications.filter((n) => n.id !== uuid);
    //       this.isMenuOpen = false;
    //     }
    //   },
    //   error: (err: any) => console.error('Failed to mark notification as read'),
    // });

    // Mock Action
    this.notifications = this.notifications.filter((n) => n.id !== uuid);
    if (this.notifications.length === 0) this.isMenuOpen = false;
    this.notificationService.show('Notification marked as read (Mock)', 'success', 2000);
  }

  clearNotifications() {
    // this.apiService.post('admin/notifications/read-all', {}).subscribe({
    //   next: (res: any) => {
    //     if (res.status === 200) {
    //       this.notifications = [];
    //       this.isMenuOpen = false;
    //     }
    //   },
    //   error: (err: any) => console.error('Failed to clear notifications'),
    // });

    // Mock Action
    this.notifications = [];
    this.isMenuOpen = false;
    this.notificationService.show('All notifications cleared (Mock)', 'success', 2000);
  }

  constructor(
    private elementRef: ElementRef,
    private router: Router,
    private jwtService: JwtService,
    private apiService: ApiService,
    private notificationService: NotificationService,
  ) { }

  clearSearch(): void {
    this.searchQuery = '';
  }

  onInputChange(): void {
    // Add any additional logic if needed
  }

  isMenuOpen: boolean = false;
  isProfileOpen: boolean = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      this.isProfileOpen = false; // Close profile if menu is opened
    }
  }

  profile() {
    this.isProfileOpen = !this.isProfileOpen;
    if (this.isProfileOpen) {
      this.isMenuOpen = false; // Close menu if profile is opened
    }
  }

  closeMenu() {
    this.isMenuOpen = false;
    this.isProfileOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onClick(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeMenu();
    }
  }
  userId: any;
  adminName: string = '';
  ngOnInit() {
    this.userId = this.jwtService.getpanelUserId();
    this.adminName = this.jwtService.getadminame() as string;

    this.fetchNotifications();

    // this.pollInterval = setInterval(() => {
    //   this.fetchNotifications();
    // }, 300000);
  }

  ngOnDestroy() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
    }
  }

  // logout() {
  //   this.jwtService.clearStorage();
  //   this.router.navigate(["/sign_in"]);
  // }
  errorMessage: any;
  showErrorMessage: boolean = false;
  submitted!: boolean;
  openSecondsuccess: boolean = false;
  successName: any = '';

  logout() {
    this.apiService.post('admin/auth/logout', {}).subscribe({
      next: (response: any) => {
        if (response.status === 200 || response.status === 204) {
          this.jwtService.clearStorage();
          this.router.navigate(['/sign_in']);
          this.notificationService.show(response.message, 'success', 3000);
        } else {
          this.errorMessage = response.message || 'Logout failed';
        }
      },
      error: (err: any) => {
        // Even on error, it's safer to clear storage and logout
        this.jwtService.clearStorage();
        this.router.navigate(['/sign_in']);
        this.notificationService.show(err.message, 'error', 2000);
      },
    });
  }
}
