import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { map } from 'rxjs/operators';
import { environment } from "../../environments/environment";
import { Response } from '../_models/common';
import { Router } from '@angular/router';
// import { Workbook } from 'exceljs';
declare const ExcelJS: any;
import * as fs from 'file-saver';
import * as _ from "lodash";


@Injectable({providedIn:"root"})

export class ApiService {
    private Response = new Response;

    constructor(
        private http:HttpClient,
        // private Alert:Alert,
        private router: Router
    ) { }

    CallApiService(ServiceName:string='', ReqData:any={}) {
        console.log('dfgsdrtg');

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                // Authorization: ReqData.Token,
            }),
        };

        return this.http.post(environment.ApiUrl+ServiceName, ReqData, httpOptions).pipe(map(
            res => {
                this.Response = JSON.parse(JSON.stringify(res));
                if (this.Response['status'] == '2') {
                } else if (this.Response['status'] == '1') {
                    if (this.Response['alert']=='1') {
                    }
                } else {
                    if (this.Response['alert']=='1') {
                    }
                }
                return this.Response;
            }
        ));
    }

    ExcelExport(JsonData:any, title = 'Excel'){
        let workbook = new ExcelJS.Workbook();
        let Field:any[] = [];
        let worksheet = workbook.addWorksheet(title+" Data");
        worksheet.properties.outlineLevelCol = 2;
        _.each(JsonData[0], (scData, Index) => { 
          Field.push(_.startCase(Index));
        });
        let header=Field;
        console.log('header');
        let headerRow = worksheet.addRow(header);
        for (let x1 of JsonData)
        {
          console.log(x1);
          let x2=Object.keys(x1);
          let temp=[]
          for(let y of x2)
          {
            temp.push(x1[y])
            
          }
          var maxLength = 0;
          worksheet.addRow(temp)
          var row = worksheet.getRow(1);
          row.eachCell( function(cell:any, colNumber:any){
                  const dobCol = worksheet.getColumn(colNumber);
                  dobCol.width = 25;
                  row.getCell(colNumber).font = { name: 'Arial',
                  family: 2,
                  bold: true,
                  size: 11,};
          });
          // worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber){
            // row.eachCell({ includeEmpty: true },function(cell, colNumber){
              // console.log(cell);
          //     const dobCol = worksheet.getColumn(colNumber);
          //     var columnLength = cell.value ? cell.value.toString().length : 8;
          //     if (columnLength > maxLength ) {
          //         maxLength = columnLength;
          //     }
          //     // console.log(maxLength)
          //     dobCol.width = 25;
          //     // console.log('width ------->'+dobCol.width);
          //     cell.border = {
          //       top: {style:'thin'},
          //       left: {style:'thin'},
          //       bottom: {style:'thin'},
          //       right: {style:'thin'}
          //     };
          //     cell.alignment = {
          //       vertical: 'middle', horizontal: 'center',wrapText: true
          //     };
          //     if (rowNumber == 1) {
          //           cell.font = {
          //             name: 'Arial',
          //             // color: { argb: 'FF00FF00' },
          //             family: 2,
          //             bold: true,
          //             size: 11,
          //           };
          //           cell.fill  = {
          //             type: 'pattern',
          //             pattern:'solid',
          //             fgColor:{argb:'00a3ed80'},
          //           //  bgColor:{argb:'FF0000FF'}
          //           };
          //     }else{
          //       // console.log('Cell ' + colNumber + ' = ' + cell.value);
          //       // const dobCol = worksheet.getColumn(colNumber);
          //       // dobCol.width = 15;
          //       if(cell.value==null || cell.value==undefined || cell.value=='undefined' || cell.value=='null' || cell.value==''){
          //         cell.value = '-';
          //       }
          //       cell.fill  = {
          //         type: 'pattern',
          //         pattern:'solid',
          //         fgColor:{argb:'00cee0c5'},
          //         bgColor:{argb:'FF0000FF'}
          //       };
          //     }
          //  });
          // });
        }
        //set downloadable file name
        let fname=title
        //add data and file name and download
        try {
          workbook.xlsx.writeBuffer().then((data:any) => {
            let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            fs.saveAs(blob, fname+'-'+new Date().valueOf()+'.xlsx');
            // fs.saveAs(blob, fname);
          });
        } catch (error) {
         console.log(error); 
        }
      }
}

