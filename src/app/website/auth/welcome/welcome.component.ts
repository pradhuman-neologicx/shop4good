import { Component, Output, EventEmitter } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [RouterLink],
  styleUrl: './welcome.component.scss',
  templateUrl: './welcome.component.html',
})
export class WelcomeComponent {
  @Output() closed = new EventEmitter<void>();

  constructor(private router: Router) {}

  close() {
    this.closed.emit();
  }

  onBackdropClick(event: MouseEvent) {
    this.close();
  }

  goToLogin() {
    this.close();
    this.router.navigate(['/auth/login']);
  }

  goToRegister() {
    this.close();
    this.router.navigate(['/auth/register']);
  }
}
