import { Directive, Input } from '@angular/core';
import { TriggerRefDirective } from './trigger-ref.directive';

@Directive({
  selector: '[appPopoverTrigger]',
  standalone: true,
  hostDirectives: [
    {
      directive: TriggerRefDirective,
      inputs: ['isOpen'],
      outputs: ['opened', 'closed']
    }
  ]
})
export class PopoverTriggerDirective {
  @Input('popoverPlacement') popoverPlacement = 'top';
  // Small, focused directive with a single responsibility (showing popover)
}
