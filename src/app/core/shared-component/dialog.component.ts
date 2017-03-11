import { Component } from '@angular/core';
import { MdDialog, MdDialogRef} from '@angular/material';
@Component({
  selector: ' dgn-dialog',
  template: `
  <div style="width:300px;height:130px">
    <div style="width:300px;height:20px">
      请确认
    </div>
    <div style="width:300px;height:80px;margin-top:20px;">
      请确认是否要进行此操作？
    </div>
    <div style="height: 30px; float:right;">
      <button md-raised-button color="default"     (click)="dialogRef.close('no')">取消</button>
      <button md-raised-button color="primary"     (click)="dialogRef.close('yes')">确认</button>
    </div>
   <div>
  `
})
export class DgnDialog {
  constructor(public dialogRef: MdDialogRef<DgnDialog> ) {

   }
}