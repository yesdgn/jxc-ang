import { ControlBase } from './df-control-base';

export class Checkbox extends ControlBase<string> {
  controlType = 'checkbox';

  constructor(options: {} = {}) {
    super(options);
  }
}
