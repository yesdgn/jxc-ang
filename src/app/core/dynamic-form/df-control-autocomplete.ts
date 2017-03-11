import { ControlBase } from './df-control-base';

export class Autocomplete extends ControlBase<string> {
  controlType = 'autocomplete';
  options: {key: string, value: string}[] = [];

  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
  }
}
