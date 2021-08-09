import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./covidtest/covidtest.module').then(m => m.CovidtestModule) },
  { path: 'student', loadChildren: () => import('./student/student.module').then(m => m.StudentModule) },
  { path: 'covidtest', loadChildren: () => import('./covidtest/covidtest.module').then(m => m.CovidtestModule) }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
