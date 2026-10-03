import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef, DestroyRef, inject } from '@angular/core';
import { LoaderService } from '../core/services/loader.service';
import { NgOptimizedImage } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-spinner',
    templateUrl: './spinner.component.html',
    styleUrls: ['./spinner.component.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [NgOptimizedImage]
})
export class SpinnerComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  
  constructor(public loader: LoaderService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.loader.loading$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.cdr.detectChanges();
    });
  }
}
