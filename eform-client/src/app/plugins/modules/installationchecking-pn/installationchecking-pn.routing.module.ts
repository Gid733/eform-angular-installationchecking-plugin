import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {InstallationCheckingPnLayoutComponent} from './layouts';
import {AdminGuard, AuthGuard, PermissionGuard} from '../../../common/guards';
import {InstallationCheckingSettingsComponent, InstallationsPageComponent, RemovalPageComponent} from './components';
import {InstallationCheckingPnClaims} from './const';

export const routes: Routes = [
  {
    path: '',
    component: InstallationCheckingPnLayoutComponent,
    canActivate: [PermissionGuard],
    data: {requiredPermission: InstallationCheckingPnClaims.accessInstallationCheckingPlugin},
    children: [
      {
        path: 'installation',
        canActivate: [AuthGuard],
        component: InstallationsPageComponent
      },
      {
        path: 'removal',
        canActivate: [AuthGuard],
        component: RemovalPageComponent
      },
      {
        path: 'settings',
        canActivate: [AdminGuard],
        component: InstallationCheckingSettingsComponent
      },
      {
        path: 'case',
        loadChildren: () => import('./components/installation-case/installation-case.module')
          .then(m => m.InstallationCaseModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstallationCheckingPnRoutingModule {
}
