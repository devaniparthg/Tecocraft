export class Response {
    status: string = '0';
    alert: string = '';
    message: string = '';
    token: string = '';
    data: any = {};
}

export class FiltersStudentList{
    Sorting:string='';
    PageNo:number=1;
    Limit:number=15;
    Search:string='';
}

export class StudentList{
    PageDetails:PageDetails= new PageDetails();
    List:List[]=[];
}

export class PageDetails{
    TotalRecord: number = 0;
    Totalpage: string = '0';
    CurrentPage: number = 0;
}


export class List{
    UserId:number=0;
    Name:string='';
    Class:string='';
    Age:string='';
    Hobbie:string='';
    Gender:string='';
    Photo:string='';
    Location:string='';
    Pincode:string='';
    StateName:string='';
    CityName:string='';
    StateID:number=0;
    CityID:number=0;
    oldfile:string='';
}

export class UserInfo {
    UserId: string = '0';
    Name: string = '';
    Location: string = '';
    Hobbies:  any[] = new Array;
    Hobbie:  string = '';
    Gender: string = '';
    Class: string = '';
    Age: number=0;
    City: string='';
    State: string='';
    Pincode: string='';
    oldfile: string='';
}