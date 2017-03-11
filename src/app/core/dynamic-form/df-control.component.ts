import { Component, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ControlBase } from './df-control-base';
import 'rxjs/add/operator/startWith';

@Component({
  selector: 'df-control',
  templateUrl: 'df-control.component.html',
  styleUrls: ['./df-control.component.css']
})
export class DFormControlComponent {
  @Input() control: ControlBase<any>;
  @Input() form: FormGroup;
  AutocompleteCtrl: FormControl;
  filteredOptions  ;
  get isValid() { return this.form.controls[this.control.key] ? this.form.controls[this.control.key].valid : false; }

 
 

}
