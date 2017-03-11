import { ControlBase } from './df-control-base';

export class ButtonToggle extends ControlBase<string> {
  controlType = 'button-toggle';
  options: {key: string, value: string}[] = [];

  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
  }
}
