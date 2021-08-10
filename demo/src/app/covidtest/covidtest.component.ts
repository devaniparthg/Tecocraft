import { Component, OnInit, ViewChild } from '@angular/core';
import {alertsService} from '../_helper';
import { ApiService  } from '../_helper/api-service';
import { first } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { QuestionList,SingleQuestion,AnswerList } from '../_models/common';
import { DataTableDirective } from 'angular-datatables';
declare var $: any;
import * as _ from "lodash";

class DataTablesResponse {
  declare ata: any[];
  declare draw: number;
  declare recordsFiltered: number;
  declare recordsTotal: number;
  declare Data: any[];
}

@Component({
  selector: 'app-covidtest',
  templateUrl: './covidtest.component.html',
  styleUrls: ['./covidtest.component.scss']
})
export class CovidtestComponent implements OnInit {

  QueList:QuestionList[]=[];
  AnswerList:AnswerList[]=[];
  SingleQuestion:SingleQuestion = new SingleQuestion();
  UserID:number=0;
  AnswerID:any[]=[];
  IsExamEnd:boolean=false;

  ClientName:string='';
  MobileNo:string='';

  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective, { static: false })
  datatableElement?: DataTableDirective;

  constructor(private alert:alertsService,
    private ApiService:ApiService) { }

  ngOnInit(): void {
    this.covidQueList();
  }

  userRegistration(SignUpData:NgForm){
    let userData=SignUpData.value;
    this.ApiService.CallApiService('CovidTestEntry',userData).pipe(first()).subscribe(resp => { 
      let response = resp;
      this.UserID=response.data.ID;
      this.alert.showAlerts(response.message,'success');
      // SignUpData.resetForm();
    });
  }

  covidQueList(){
    this.ApiService.CallApiService('CovidQueList',{}).pipe(first()).subscribe(resp => { 
      let response = resp;
      console.log(response.data.List);
      this.QueList=response.data.List;
      if(this.QueList.length>0){
        let SingleQuestion:any=this.QueList[0];
        SingleQuestion['QuetionNo']=1;
        SingleQuestion['Total']=this.QueList.length;
        SingleQuestion['OptionArray']=SingleQuestion.Option.split(',');
        this.SingleQuestion=SingleQuestion;
      }
    });
  }

  nextQuetion(Question:NgForm){
    let userData:any=Question.value;

    if(this.SingleQuestion.OptionType==3){
      let Answer=[];
      for (let index = 0; index < this.SingleQuestion.OptionArray.length; index++) {
        const element = userData['date-'+index];
        Answer.push(element);
      }
      userData['Answer']=Answer.join();
    }
    userData['TestID']=this.UserID;
    this.ApiService.CallApiService('CovidAnsEntry',userData).pipe(first()).subscribe(resp => { 
      let response = resp;
      this.AnswerID.push(response.data.ID);
      this.alert.showAlerts(response.message,'success');
      Question.resetForm();
      userData['AnswerID']=response.data.ID;
      this.AnswerList.push(userData);
      let SingleQuestionTemp:any=this.QueList[userData.QuetionNo];
      let checkTemp:any=this.QueList[userData.QuetionNo-1];
      if((checkTemp.IsNested==1 && checkTemp.NestedAns==userData.Answer) || checkTemp.IsNested==0){
        SingleQuestionTemp['QuetionNo']=(userData.QuetionNo+1);
        SingleQuestionTemp['Total']=this.QueList.length;
        if(SingleQuestionTemp['OptionType']!=3){
          SingleQuestionTemp['OptionArray']=SingleQuestionTemp.Option.split(',');
        }else{
          SingleQuestionTemp['OptionArray']=[...Array(userData['Answer']).keys()];
        }
        this.SingleQuestion=SingleQuestionTemp;
      }else{
        this.IsExamEnd=true;
        this.LoadData();
      }
    });
  }

  Submit(Question:NgForm){
    let userData:any=Question.value;
    userData['TestID']=this.UserID;
    this.ApiService.CallApiService('CovidAnsEntry',userData).pipe(first()).subscribe(resp => { 
      let response = resp;
      this.AnswerID.push(response.data.ID);
      this.alert.showAlerts(response.message,'success');
      Question.resetForm();
      userData['AnswerID']=response.data.ID;
      this.AnswerList.push(userData);
      this.IsExamEnd=true;
      this.LoadData();
      
    });
  }

  LoadData(){
    let tabledata=this.AnswerList;

    this.dtOptions = {
      destroy: true,
      pagingType: 'simple_numbers',
      pageLength: 15,
      serverSide: true,
      processing: true,
      lengthMenu: [15,20,30],
      dom: "<'row'<'col-sm-12'tr>>" +
        "<'row tbl-footer-row align-items-center'<'col-sm-12 col-md-4 pl-2'i><'col-sm-12 col-md-4 text-center'l><'col-sm-12 col-md-4 pr-2'p>>",
      scrollX: true,
      language: {
        paginate: {
          next: '<i class="fa fa-angle-right" title="Next"></i>',
          previous: '<i class="fa fa-angle-left" title="Privious"></i>',
          first: '<i class="fa fa-angle-double-left" title="First"></i>',
          last: '<i class="fa fa-angle-double-right" title="Last"></i>'
        },
      },
      ordering: false,
      searching: false,
      
      ajax: (dataTablesParameters: any, callback) => {

        
        // this.ApiService.CallApiService('GetTokenList',this.FilterData).pipe(first()).subscribe(
        // resp => {
          // this.TokenList = resp.data;
          callback({
            recordsTotal: tabledata.length,
            recordsFiltered: tabledata.length,
            data: []
          });
          
            
        // },
        // error => {
        //   let errors = 'Something is wrong pls try again';
        //   this.alert.showAlerts(error.error.ZMessage.ErrorMessage , 'error');
        // });
      },
    };

   
  }

  Datatable(){
    this.datatableElement?.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }



}
