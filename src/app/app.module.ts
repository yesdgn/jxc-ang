import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import 'hammerjs';
import { MaterialModule} from '@angular/material';

import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { DgnCoreModule } from './core/core.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    MaterialModule.forRoot(),
    DgnCoreModule, 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
