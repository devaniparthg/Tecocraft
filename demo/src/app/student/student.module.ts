import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentRoutingModule } from './student-routing.module';
import { StudentComponent } from './student.component';

import { DataTablesModule } from 'angular-datatables';
import { ConfirmDialogModule } from '../_helper/confirm-dialog/confirm-dialog.module';

import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    StudentComponent
  ],
  imports: [
    CommonModule,
    StudentRoutingModule,
    DataTablesModule,
    ConfirmDialogModule,
    NgSelectModule,
    FormsModule,
  ]
})
export class StudentModule { }
