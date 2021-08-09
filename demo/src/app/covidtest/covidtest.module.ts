import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CovidtestRoutingModule } from './covidtest-routing.module';
import { CovidtestComponent } from './covidtest.component';

import { FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';



@NgModule({
  declarations: [
    CovidtestComponent
  ],
  imports: [
    CommonModule,
    CovidtestRoutingModule,
    FormsModule,
    DataTablesModule
  ]
})
export class CovidtestModule { }
