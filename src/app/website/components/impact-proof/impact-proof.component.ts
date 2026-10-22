import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JwtService } from 'src/app/core/services/jwt.service';

@Component({
  selector: 'app-impact-proof',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './impact-proof.component.html',
  styleUrl: './impact-proof.component.scss'
})
export class ImpactProofComponent {
  private jwtService = inject(JwtService);
  isLoggedIn = this.jwtService.getCustomerIsLoggedIn();
}

