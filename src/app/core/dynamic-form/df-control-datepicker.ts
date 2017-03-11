import { ControlBase } from './df-control-base';

export class Datepicker extends ControlBase<string> {
  controlType = 'datepicker';
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}
