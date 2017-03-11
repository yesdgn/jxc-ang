import { ControlBase } from './df-control-base';

export class Textarea extends ControlBase<string> {
  controlType = 'textarea';

  constructor(options: {} = {}) {
    super(options);
  }
}
