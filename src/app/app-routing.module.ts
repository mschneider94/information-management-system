import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExplorerComponent } from './explorer/explorer.component';
import { HttpErrorComponent } from './http-error/http-error.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: HttpErrorComponent },
  { path: '**', component: HttpErrorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
