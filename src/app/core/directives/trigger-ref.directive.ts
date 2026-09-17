import { Directive, ElementRef, Input, Output, EventEmitter, HostListener, OnInit } from '@angular/core';

@Directive({
  selector: '[appTriggerRef]',
  standalone: true
})
export class TriggerRefDirective implements OnInit {
  @Input('isOpen') isOpen = false;
  @Output('opened') opened = new EventEmitter<void>();
  @Output('closed') closed = new EventEmitter<void>();

  constructor(public elementRef: ElementRef) {
    console.log('TriggerRefDirective initialized (Should only happen once per element even if composed multiple times).');
  }

  ngOnInit() {
    // Shared behavior setup
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    if (!this.isOpen) {
      this.isOpen = true;
      this.opened.emit();
    }
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    if (this.isOpen) {
      this.isOpen = false;
      this.closed.emit();
    }
  }
}
