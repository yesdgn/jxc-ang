import { ControlBase } from './df-control-base';

export class Slider extends ControlBase<string> {
  controlType = 'slider';
  type: string;
  min:number;
  max:number;
  step:number; 
  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
    this.min = options['type'] || 0;
    this.max = options['type'] || 100;
    this.step = options['type'] || 1;
  }
}
