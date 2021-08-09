import { NgModule } from '@angular/core';  
import { CommonModule } from '@angular/common';
import {ConfirmDialogComponent} from './confirm-dialog.component';  
import {ConfirmDialogService} from './confirm-dialog.service';  
  
@NgModule({  
    declarations: [  
        ConfirmDialogComponent  
    ], 
    exports: [  
        ConfirmDialogComponent  
    ],  
    providers: [  
       ConfirmDialogService  
    ] ,
    imports:[CommonModule] 
})  
export class ConfirmDialogModule  
{  
}  