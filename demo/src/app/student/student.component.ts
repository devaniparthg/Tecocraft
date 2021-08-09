import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { ConfirmDialogService } from '../_helper/confirm-dialog/confirm-dialog.service';
import {alertsService} from '../_helper';
import { ApiService  } from '../_helper/api-service';
import { first } from 'rxjs/operators';
import { StudentList,FiltersStudentList,UserInfo } from '../_models/common';
import { environment } from '../../environments/environment';
import { NgForm } from '@angular/forms';
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
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss',
               './../../assets/css/style.scss']
})
export class StudentComponent implements OnInit {
  IMAGEURL=environment.ImageURL;
  dtOptions: DataTables.Settings = {};
  StudentList:StudentList=new StudentList();
  UserInfo= new UserInfo;
  public FilterData: FiltersStudentList = new FiltersStudentList();

  @ViewChild(DataTableDirective, { static: false })
  datatableElement?: DataTableDirective;

  //extra static

  Gender1 = [
    { id: 'Male', name: 'Male' },
    { id: 'Female', name: 'Female' },
  ];

  Class1 = [
    { id: '1st', name: '1st' },
    { id: '2nd', name: '2nd' },
    { id: '3rd', name: '3rd' },
    { id: '4th', name: '4th' },
  ];

  Hobbies = [
    { name: 'Coding', value: 'Coding',isChecked:false },
    { name: 'Designing', value: 'Designing',isChecked:false }
  ];

  Sorting = [
    { id: 'Name', name: 'Name' },
    { id: 'Age', name: 'Age' },
    { id: 'Class', name: 'Class' },
    { id: 'UserId', name: 'Student ID' },
  ];

  CityList = [];

  StateList = [];

  hobbies={
    'Coding':false,
    'Reading':false,
  }
  //----------------

  constructor( 
    private confirmDialogService: ConfirmDialogService,
    private alert:alertsService,
    private ApiService:ApiService
    ) { 
    }

  ngOnInit(): void {
    this.LoadData();
    this.GetState();
  }

  test()
  {
    this.alert.showAlerts("please write Firstname","warning");
    this.confirmDialogService.confirmThis("Are you sure to delete?", () =>  { 
      console.log('tst');
    }, function () {

    });
  }

  LoadData(){
    this.dtOptions = {
      destroy: true,
      pagingType: 'simple_numbers',
      pageLength: 5,
      serverSide: true,
      processing: true,
      lengthMenu: [5,10,20,30],
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
          this.FilterData.Limit= dataTablesParameters.length;
          this.FilterData.PageNo= (dataTablesParameters.start + dataTablesParameters.length) / dataTablesParameters.length;
        
        this.ApiService.CallApiService('UserList',this.FilterData).pipe(first()).subscribe(
        resp => {
          this.StudentList = resp.data;
          callback({
            recordsTotal: resp.data['PageDetails']['TotalRecord'],
            recordsFiltered: resp.data['PageDetails']['TotalRecord'],
            data: []
          });
          if(this.StudentList.List.length==0){
            $(".dataTables_empty").css("display", "block");
          }else{
            $(".dataTables_empty").css("display", "none");
          }
            
        },
        error => {
          let errors = 'Something is wrong pls try again';
          this.alert.showAlerts(error.error.ZMessage.ErrorMessage , 'error');
        });
      },
    };
  }

  userRegistration(SignUpData:NgForm) {
    
    let userData=SignUpData.value;
    console.log(this.base64Data!=undefined?'test1':'test2');
    let hobbies=[];
    for (let index = 0; index < this.Hobbies.length; index++) {
      const element =this.Hobbies[index]['name']; 
      if(userData[element]==true){
        hobbies.push(element);
      }
    }

    let Hobies=hobbies.join();

    let ReqData={
      "UserId": userData.UserId,
      "StudentName": userData.Name,
      "Class": userData.Class,
      "Age": userData.Age,
      "Hobbies": Hobies,
      "Gender": userData.Gender,
      "State": userData.State,
      "City": userData.City,
      "Pincode": userData.Pincode,
      "Location": userData.Location,
      "Photo":this.base64Data!=undefined?this.base64Data:'',
      "oldfile":userData.oldfile,
    }
    this.ApiService.CallApiService('UserRegistration', ReqData).pipe(first()).subscribe(
      resp => {
        if (resp.status=='1') {
            this.alert.showAlerts(resp.message, 'success'); 
            SignUpData.resetForm();
            $('#adddata').modal('hide');
            this.Datatable();
        }
      }, 
      error => {
        this.alert.showAlerts(error.statusText, 'error');
    });
  }

  async edit(index:number){
    this.UserInfo= new UserInfo;
    let Hobbies=this.StudentList.List[index]['Hobbie'];
    console.log(Hobbies);
    let arrayHob=Hobbies.split(',');


    let tempData=this.StudentList.List[index];


    if(tempData.StateID!=0){
      let city={ 'id':tempData.StateID,'name':tempData.StateName};
      let getCity=await this.GetCity(city)
    }
    await _.merge(this.UserInfo, _.pick(tempData, _.keys(this.UserInfo)));

    for (let index = 0; index < this.Hobbies.length; index++) {
      const element =this.Hobbies[index]['name']; 
      if(arrayHob.includes(element)){
        this.Hobbies[index]['isChecked']=true;
        this.UserInfo.Hobbies[index]=true;
      }else{
        this.Hobbies[index]['isChecked']=false;
        this.UserInfo.Hobbies[index]=false;
      }
      
    }
    console.log(this.Hobbies);
    console.log(arrayHob);
      
    $('#adddata').modal('show');
    console.log(this.UserInfo);
  }

  delete(UserId:number){
    this.confirmDialogService.confirmThis("Are you sure to delete?", () =>  { 
      this.ApiService.CallApiService('UserDelete', {'UserId':UserId}).pipe(first()).subscribe(
        resp => {
          if (resp.status=='1') {
              this.alert.showAlerts(resp.message, 'success'); 
              this.Datatable();
          }
        }, 
        error => {
          this.alert.showAlerts(error.statusText, 'error');
      });

    }, function () {

    });
  }

  newStudent(){
    this.UserInfo= new UserInfo;
  }

  fileToUpload: any;
  imageUrl: any;
  base64Data:any;
  fileContent: any;
  IsUloaded:boolean=false;
  handleFileInput(fileEvent: any) {
  
    this.fileToUpload = (fileEvent.target as HTMLInputElement).files;

    //Show image preview
    let reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
      this.base64Data=event.target.result;
      this.IsUloaded=true;
    }
    reader.readAsDataURL(this.fileToUpload[0]);
  }

  GetState(){
    this.StateList=[];
    this.ApiService.CallApiService('GetState',{}).pipe(first()).subscribe(resp => { 
      this.StateList = resp.data['List'];
    });
  }

  async GetCity(req:any){
    console.log(req.id);
    if(req){
      await this.ApiService.CallApiService('GetCity',{'StateID':req.id}).pipe(first()).subscribe(resp => {
        this.CityList=resp.data['List'];
      });

      return 1
    }else{
      return 0
    }
  }

  Datatable(){
    this.datatableElement?.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  Export(){
    // this.AllServiceService.CallService(SN.GenerateStudentExcel,request)
    // .pipe(first()).
    // subscribe(data => { 
    //   if(data.ZMessage['status'] == '1')
    //   {
          this.ApiService.ExcelExport(this.StudentList.List,'Student List');
          // this.alert.showAlerts(data.ZMessage['ErrorMessage'],"success");
      // }
      // else{
      //   this.alert.showAlerts(data.ZMessage['ErrorMessage'],"error");
      // }
    // });
  }

  userFilter(Filter:NgForm){
    this.FilterData.PageNo=1;
    // $('#filterdata').modal('hide');
    this.Datatable();
    console.log(Filter.value);

  }
  

}
