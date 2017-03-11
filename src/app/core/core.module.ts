import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule,MdDialog } from '@angular/material';


import { coreRouting } from './core.routing';
import { MainComponent } from './main/main.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './login/login.component';
import { DgnDialog } from './shared-component/dialog.component';
import { HttpService } from './http.service';
import { CommonService } from './common.service';
import { MissionService } from './mission.service';
import { DynamicFormModule } from './dynamic-form/df.module';
import { FavoriteComponent } from './shared-component/favorite/favorite.component';
import { MainmenuComponent } from './shared-component/mainmenu/mainmenu.component';
import { DgnTreeDirective } from './shared-component/dgn-tree.directive';
import { ChangePasswordComponent } from './change-password/change-password.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    coreRouting,
    MaterialModule.forRoot(),
    DynamicFormModule
  ],
  declarations: [
    LoginComponent,
    MainComponent,
    ProfileComponent,
    FavoriteComponent, MainmenuComponent, DgnTreeDirective, ChangePasswordComponent,DgnDialog],
  exports: [FavoriteComponent, MainmenuComponent],
  providers: [HttpService, CommonService, MissionService,MdDialog],
  entryComponents: [DgnDialog]
})
export class DgnCoreModule {
  constructor( @Optional() @SkipSelf() parentModule: DgnCoreModule) {
    if (parentModule) {
      throw new Error(
        'DgnCoreModule is already loaded. Import it in the AppModule only');
    }
  }

}
