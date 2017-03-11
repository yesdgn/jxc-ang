import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { MaterialModule } from '@angular/material';
import {DataTableModule,SharedModule,TreeModule,TreeNode} from 'primeng/primeng';
import { PageService } from './df-page.service';
import { DFormMService }    from './df-form-m.service'; 

import { DFormControlComponent } from './df-control.component';
import { DfPageComponent } from './df-page.component';
import { DFormMComponent } from './df-form-m.component';
import { DFormListComponent } from './df-form-list.component';
import { DFormTreeTreeComponent } from './df-form-tree-tree.component';
import { DfConfigComponent } from './df-config/df-config.component';

@NgModule({
  imports: [BrowserModule, ReactiveFormsModule ,MaterialModule.forRoot(),DataTableModule,SharedModule,TreeModule],
  declarations: [DFormControlComponent, DfPageComponent, DFormMComponent,DFormListComponent,DFormTreeTreeComponent, DfConfigComponent],
  providers: [PageService,DFormMService] 
})
export class DynamicFormModule {}
