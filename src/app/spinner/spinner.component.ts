import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { LoaderService } from '../core/services/loader.service';
import { NgOptimizedImage } from '@angular/common';

@Component({
    selector: 'app-spinner',
    templateUrl: './spinner.component.html',
    styleUrls: ['./spinner.component.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [NgOptimizedImage]
})
export class SpinnerComponent implements OnInit {
  constructor(public loader: LoaderService) { }

  ngOnInit(): void {
  }
}
