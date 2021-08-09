var CryptoJS = require("crypto-js");
var Common = {};
const _ = require('lodash');
const sqlhelper = require("../helpers/sqlhelper");

Common.EncryptObject=(Object)=> {
    let key = CryptoJS.enc.Utf8.parse(process.env.DATA_SECRET_KEY);
    var IV_KEY = CryptoJS.enc.Utf8.parse(process.env.DATA_SECRET_KEY.substr(0,16));
    var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(JSON.stringify(Object).toString()), key,{
            keySize: 256,
            iv: IV_KEY,
            mode: CryptoJS.mode.CBC
        });
    return encrypted.toString();
}

Common.DecryptObject=(EncryptObject) => {
    try {
        let key = CryptoJS.enc.Utf8.parse(process.env.DATA_SECRET_KEY);
        var IV_KEY = CryptoJS.enc.Utf8.parse(process.env.DATA_SECRET_KEY.substr(0,16));
        var decrypted = CryptoJS.AES.decrypt(EncryptObject, key, {
            keySize: 256,
            iv: IV_KEY,
            mode: CryptoJS.mode.CBC
        });
        return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
    } catch (error) {
        console.log(error);
        return 0;
    }
}

Common.TokenVerification = async (request) => {
    let DEFAULT_TOKEN = process.env.DEFAULT_TOKEN;

    var allowedDefaultTokenService = [
        'UserLogin', 
        'UserRegistration', 
        'UserForgetPassword', 
        'UserResetPassword',
    ];

    var response = {};
    if (request.Token!=undefined && request.Token!=null && request.Token!='') {
        let Token = Common.TokenDecrypt(request.Token);
        console.log("-----");
        console.log(Token);
        var is_allowes = _.indexOf(allowedDefaultTokenService, request.ServiceName);
        if (is_allowes>=0 && DEFAULT_TOKEN==request.Token) {
            response['token'] = request.Token;
            response['status'] = '1';
            response['message'] = 'Authentication success.';
        } else {
            let query = 'SELECT HstID, StudentID, LoginDate FROM HST_Student_Login WHERE HstID=? AND StudentID=?';
            let LogData = await sqlhelper.select(query, [Token, request.UserId], (err, res) => {
                if (err.sqlMessage!=undefined || _.isEmpty(res)) {
                    return [];
                } else {
                    return res;
                }
            });

            if (LogData.length > 0) {
                let CurrentTime = moment().format('YYYYMMDDHHmmss');
                let ExpectedTime = moment(LogData[0]['LoginDate']).add(24, 'hours').format('YYYYMMDDHHmmss');
                if (CurrentTime<=ExpectedTime) {
                    response['status'] = '1';
                    response['token'] = request.Token;
                    response['message'] = 'Authentication success.';
                } else {
                    response['status'] = '2';
                    response['token'] = request.Token;
                    response['message'] = 'Session expired. try to login again.';
                }
            } else {
                response['status'] = '2';
                response['message'] = 'Authentication Fail.1';
            }
        }
    } else {
        response['status'] = '2';
        response['message'] = 'Authentication Fail.2';
    }

    return response;
}

Common.TokenDecrypt = (value) => {
    console.log("-----token-------");
    console.log(value);
    try {
        let key = CryptoJS.enc.Utf8.parse(process.env.DATA_SECRET_KEY);
        var IV_KEY = CryptoJS.enc.Utf8.parse(process.env.DATA_SECRET_KEY.substr(0,16));
        var decrypted = CryptoJS.AES.decrypt(value, key, {
            keySize: 256,
            iv: IV_KEY,
            mode: CryptoJS.mode.CBC
        });
        console.log('--------');
        console.log(decrypted);
        return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.log(error);
        return 0;
    }
};

Common.ResFormat = (status='0', alert_type='0', message='', token='', data={}) => {
    let encryptData = {
        'status': status,
        'alert': alert_type,
        'message': message,
        'token': token,
        'data': data,
    };
    
    return encryptData;
}

Common.EncrptResFormat = (status='0', alert_type='0', message='', token='', data={}) => {
    let encryptData = {
        'status': status,
        'alert': alert_type,
        'message': message,
        'token': token,
        'data': data,
    };
    
    let encryptObj = Common.EncryptObject(encryptData);
    return {QYUEIMSHNSGMDM : encryptObj};
    
}

Common.GetEmailTemplate = async (TemplateName='0') => {
    let template_query = 'SELECT TemplateName, TemplateSubject AS Subject, TemplateBody AS Body, CCEmail FROM Mst_MessageTemplate WHERE TemplateName=? AND Active="1" LIMIT 1';
    let template_data = await sqlhelper.select(template_query, [TemplateName], (err, res) => {
        if (err || _.isEmpty(res)) {
            return {};
        } else {
            return json_response(res[0]);
        }
    });

    return template_data;
};

Common.SendEmailSMTP = async (MailData = {}) => {
    const nodemailer = require('nodemailer');

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        secure: true,
        port: 465, 
        auth: {
            user: process.env.GMAIL_ACCOUNT,
            pass: process.env.GMAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    var mailOptions = {
        from: 'Parth Support <'+process.env.GMAIL_ACCOUNT+'>',
        to: MailData.mail_to,
        subject: MailData.subject,
        // text: '',
        html: MailData.body,
    };

    if (MailData.cc_mail!=undefined && _.size(MailData.cc_mail)>0) {
        mailOptions.cc = MailData.cc_mail.split(',');
    }

    var response = {};
    if (MailData.mail_to.length>0) {
        if (process.env.IsMailSend=='1') {
            response = await new Promise(resolve => {
                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        resolve(error);
                    } else {
                        resolve(info);
                    }
                });
            });
        }
    }
    console.log(response);
    return response;
}


module.exports = Common;