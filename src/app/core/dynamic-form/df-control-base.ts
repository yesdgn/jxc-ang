export class ControlBase<T>{
  value: T;
  key: string;
  label: string;
  required: boolean;
  order: number;
  controlType: string;
  className: string;
  readonly: boolean;
  constructor(options: {
      value?: T,
      key?: string,
      label?: string,
      required?: boolean,
      order?: number,
      controlType?: string,
      className?:string,
      readonly?:boolean
    } = {}) {
    this.value = options.value;
    this.key = options.key || '';
    this.label = options.label || '未定义';
    this.required = !!options.required;
    this.order = options.order === undefined ? 1 : options.order;
    this.controlType = options.controlType || '';
    this.className = options.className;
    this.readonly=!!options.readonly;
  }
}
