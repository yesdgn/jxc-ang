import { ControlBase } from './df-control-base';

export class SlideToggle extends ControlBase<string> {
  controlType = 'slide-toggle';

  constructor(options: {} = {}) {
    super(options);
  }
}
