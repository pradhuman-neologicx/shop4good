import {
  Component,
  Input,
  ChangeDetectionStrategy,
  input
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
    selector: 'app-header-section',
    templateUrl: './header-section.component.html',
    styleUrl: './header-section.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [NgOptimizedImage],
})
export class HeaderSectionComponent {
  @Input() eyebrow: string = 'Cradle Reproductive Health';
  @Input() icon: string = 'fa-solid fa-calendar-check';
  @Input() title: string = 'Page Title';
  @Input() accentTitle?: string;
  @Input() subtitle?: string;
  @Input() imageSrc: string = 'assets/header-bg.png';
}
