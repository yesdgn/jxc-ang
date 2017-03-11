import { ControlBase } from './df-control-base';

export class Textbox extends ControlBase<string> {
  controlType = 'textbox';
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}
