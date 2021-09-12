import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{
	path: '',
	loadChildren: () => import('@app/schools/schools.module').then(m => m.SchoolsModule),
},
{ path: '**', redirectTo: '/', pathMatch: 'full' },];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
