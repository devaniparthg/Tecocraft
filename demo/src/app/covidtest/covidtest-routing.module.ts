import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CovidtestComponent } from './covidtest.component';

const routes: Routes = [{ path: '', component: CovidtestComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CovidtestRoutingModule { }
