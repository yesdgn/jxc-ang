import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { ProfileComponent } from './profile/profile.component';
import { DfPageComponent } from './dynamic-form/df-page.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
const coreRoutes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'reg',
        component: LoginComponent
    },
    {
        path: 'main',
        component: MainComponent
    },
    {
        path: 'changepassword/:dataid',
        component: ChangePasswordComponent
    },
    {
        path: 'changepassword',
        component: ChangePasswordComponent
    },
    {
        path: 'page/:pageid/:dataid',
        component: DfPageComponent
    },
    {
        path: 'page/:pageid',
        component: DfPageComponent
    },
    {
        path: 'profile',
        component: ProfileComponent
    },
];

export const coreRouting: ModuleWithProviders = RouterModule.forChild(coreRoutes);