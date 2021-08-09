require('dotenv').config();
const moment = require('moment');
const md5 = require('md5');
const _ = require('lodash');
const sqlhelper = require("../../helpers/sqlhelper");
const Common = require("../../libraries/User.Common");
const fs = require('fs');
const {
    v4: uuidv4
} = require('uuid');


const User = {};

User.UserRegistration = async (request, callback) => {
    var insert_data = {
        'StudentName': request.StudentName,
        'Class': request.Class,
        'Age': request.Age,
        'Hobbies': request.Hobbies,
        'Gender': request.Gender,
        'State': request.State,
        'City': request.City,
        'Pincode': request.Pincode,
        'Location': request.Location,
    };
    if (request.Photo!='') {
        var data = request.Photo.replace(/^data:image\/\w+;base64,/, "");
        var buf = Buffer.from(data, 'base64');
        let ImageLocation = "Images/image_" + uuidv4() + ".png";
        fs.writeFile(ImageLocation, buf, function (err, res) {
            if (err) {
                return console.log(err);
            }
            console.log(res);
            insert_data['Photo'] = ImageLocation;
        });
    } else {
        insert_data['Photo'] = request.oldfile;
    }
    if (request.UserId > 0) {
        let user_data = await sqlhelper.update('Student', insert_data, {
            UserId: request.UserId
        }, (err, res) => {
            if (err) {
                console.log(err);
                callback(json_response(err), null);
                return 0;
            } else {
                res = json_response(res);
                return res.affectedRows
            }
        });

        console.log(user_data);

        if (user_data == 0) {
            return;
        }
    } else {
        let user_data = await sqlhelper.insert('Student', insert_data, (err, res) => {
            if (err) {
                callback(json_response(err), null);
                return 0;
            } else {
                res = json_response(res);
                return res.insertId
            }
        });

        if (user_data == 0) {
            return;
        }
    }

    var response = {
        // 'data' : user_data['UserId'],
        'data': [],
        'message': 'Dear, user your registration process has been succeeded and please check Email ID',
        'status': '1',
        // 'token': Token,
        'token': request.Token,
    };
    return callback(null, json_response(response));
}

User.UserList = async (request, callback) => {
    let where = '';
    let where_array = [];
    let order_by = ' ORDER BY std.UserId DESC';
    if (request.Sorting != '') {
        if(request.Sorting=='Age'){ 
            order_by = ' ORDER BY std.Age ASC';
        } else if(request.Sorting=='Class'){
            order_by = ' ORDER BY std.Class ASC';
        } else if(request.Sorting=='Name'){
            order_by = ' ORDER BY std.StudentName ASC';
        }
    }

    if (request.Search!=''){
        where += ' AND std.StudentName like ? ';
        where_array.push(request.Search);
    }

    request.PageNo = (request.PageNo > 0 ? request.PageNo : '1');
    request.Limit = ((request.Limit > 0 && request.Limit <= 50) ? request.Limit : '20');

    let total_query = 'SELECT COUNT(tb.UserId) AS total FROM (SELECT std.UserId \
        FROM student AS std \
        INNER JOIN mst_State AS sm ON sm.StateID=std.State \
        INNER JOIN mst_City AS ct ON ct.CityID=std.City \
        WHERE  1 ' + where + ') AS tb';
    let total_record = await sqlhelper.select(total_query, where_array, (err, res) => {
        if (err || _.size(res) <= 0) {
            return 0;
        } else {
            return res[0]['total'];
        }
    });

    var response = {
        'status': 0,
        'message': '',
        'data': {}
    };

    if (total_record == 0) {
        response['status'] = 200;
        response['message'] = 'Data is not found';
        let resp = {
            'List': [],
            'PageDetails': {
                'CurrentPage': 1,
                'TotalPage': 0,
                'TotalRecord': 0
            },
        }
        response['data'] = resp;
    } else {
        response['status'] = 200;
        response['message'] = 'Successfully get data';

        let offset = (request.PageNo * request.Limit - request.Limit);
        let list_query = 'SELECT std.UserId,std.StudentName as Name,std.Class,std.Age,std.Hobbies as Hobbie,std.Gender,std.Photo,std.Photo as oldfile,std.Location,std.Pincode,sm.StateName,ct.CityName,std.State as State,std.City as City \
                                FROM student AS std \
                                INNER JOIN mst_State AS sm ON sm.StateID=std.State \
                                INNER JOIN mst_City AS ct ON ct.CityID=std.City \
                          WHERE 1 ' + where + order_by + ' LIMIT ' + offset + ', ' + request.Limit;
        let list_data = await sqlhelper.select(list_query, where_array, (err, res) => {
            if (err || _.size(res) <= 0) {
                console.log(err);
                return 0;
            } else {
                return json_response(res);
            }
        });

        let totalPage = Math.ceil(total_record / request.Limit).toString();

        let resp = {
            'List': list_data,
            'PageDetails': {
                'CurrentPage': request.PageNo,
                'TotalPage': totalPage,
                'TotalRecord': total_record
            },
        }

        response['data'] = resp;
    }

    callback(null, json_response(response));
}

User.GetState = async (request, callback) => {
    var response = {
        'status': 0,
        'message': '',
        'data': {}
    };

    let list_query = 'SELECT StateID as id, StateName as name FROM `mst_state';
    let list_data = await sqlhelper.select(list_query, [], (err, res) => {
        if (err || _.size(res) <= 0) {
            console.log(err);
            return 0;
        } else {
            return json_response(res);
        }
    });

    let resp = {
        'List': list_data
    }

    response['data'] = resp;

    callback(null, json_response(response));
}

User.GetCity = async (request, callback) => {
    var response = {
        'status': 0,
        'message': '',
        'data': {}
    };

    let list_query = 'SELECT CityID as id, CityName as name FROM `mst_city';
    let list_data = await sqlhelper.select(list_query, [request.StateID], (err, res) => {
        if (err || _.size(res) <= 0) {
            console.log(err);
            return 0;
        } else {
            return json_response(res);
        }
    });

    let resp = {
        'List': list_data
    }

    response['data'] = resp;

    callback(null, json_response(response));
}


User.UserDelete = async (request, callback) => {
    var response = {
        'status': 1,
        'message': 'deleted Successfully.',
        'data': {}
    };

    let delete_query = 'DELETE FROM student WHERE UserId=?';
    let delete_data = await sqlhelper.select(delete_query, [request.UserId], (err, res) => {
        if (err) {
            callback(null, json_response(err));
            return 0;
        } else {
            return res['affectedRows'];
        }
    });

    response['data'] = {};

    callback(null, json_response(response));
}


json_response = (data) => {
    return JSON.parse(JSON.stringify(data));
}
module.exports = User;