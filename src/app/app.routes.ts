import { IsAdminGuard } from '@auth/guards/isAdmin.guard';
import { Routes } from '@angular/router';
import { NotAuthenticatedGuard } from '@auth/guards/not-authenticated.guard';

export const routes: Routes = [

  {
    path:'auth',
    loadChildren: ()=> import('./auth/auth.route'),
    canMatch:[
     await NotAuthenticatedGuard

    ]
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin-dashboard/admin-dashborad.routes'),
  },
  {
    path:'',
    loadChildren: () => import('./store-front/store-front.routes')
  }

];
