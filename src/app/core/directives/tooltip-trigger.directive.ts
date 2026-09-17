import { Directive, Input } from '@angular/core';
import { TriggerRefDirective } from './trigger-ref.directive';

@Directive({
  selector: '[appTooltipTrigger]',
  standalone: true,
  hostDirectives: [
    {
      directive: TriggerRefDirective,
      inputs: ['isOpen'],
      outputs: ['opened', 'closed']
    }
  ]
})
export class TooltipTriggerDirective {
  @Input('tooltipText') tooltipText = '';
  // Small, focused directive with a single responsibility (showing tooltip)
}
