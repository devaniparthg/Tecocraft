require('dotenv').config();
const moment = require('moment');
const async = require('async');
const _ = require('lodash');
const Common = require("../../libraries/User.Common");
const User = require("./User.Model");


exports.UserLogin = (req, res) => {
    res.status(200).send(Common.ResFormat('0', process.env.Toaster, 'Successfully connected with API.', '', {})); 
};

exports.UserRegistration = (req, res) => {
    User.UserRegistration(req.body, (error, data) => {
        if (error!=null && error.sqlMessage!=undefined) {
            console.log(error);
            res.status(200).send(Common.ResFormat('0', process.env.Toaster, 'Sorry, something went wrong; please check your internet connection or try again later.', '', {}));
        } else {
            res.status(200).send(Common.ResFormat(data.status, process.env.Toaster, data.message, data.token, data.data));
        }
    });
};

exports.UserList = (req, res) => {
    User.UserList(req.body, (error, data) => {
        if (error!=null && error.sqlMessage!=undefined) {
            console.log(error);
            res.status(200).send(Common.ResFormat('0', process.env.Toaster, 'Sorry, something went wrong; please check your internet connection or try again later.', '', {}));
        } else {
            res.status(200).send(Common.ResFormat(data.status, process.env.Toaster, data.message, data.token, data.data));
        }
    });
};

exports.GetState = (req, res) => {
    User.GetState(req.body, (error, data) => {
        if (error!=null && error.sqlMessage!=undefined) {
            console.log(error);
            res.status(200).send(Common.ResFormat('0', process.env.Toaster, 'Sorry, something went wrong; please check your internet connection or try again later.', '', {}));
        } else {
            res.status(200).send(Common.ResFormat(data.status, process.env.Toaster, data.message, data.token, data.data));
        }
    });
};

exports.GetCity = (req, res) => {
    User.GetCity(req.body, (error, data) => {
        if (error!=null && error.sqlMessage!=undefined) {
            console.log(error);
            res.status(200).send(Common.ResFormat('0', process.env.Toaster, 'Sorry, something went wrong; please check your internet connection or try again later.', '', {}));
        } else {
            res.status(200).send(Common.ResFormat(data.status, process.env.Toaster, data.message, data.token, data.data));
        }
    });
};

exports.UserDelete = (req, res) => {
    User.UserDelete(req.body, (error, data) => {
        if (error!=null && error.sqlMessage!=undefined) {
            console.log(error);
            res.status(200).send(Common.ResFormat('0', process.env.Toaster, 'Sorry, something went wrong; please check your internet connection or try again later.', '', {}));
        } else {
            res.status(200).send(Common.ResFormat(data.status, process.env.Toaster, data.message, data.token, data.data));
        }
    });
};

exports.CovidQueList = (req, res) => {
    User.CovidQueList(req.body, (error, data) => {
        if (error!=null && error.sqlMessage!=undefined) {
            console.log(error);
            res.status(200).send(Common.ResFormat('0', process.env.Toaster, 'Sorry, something went wrong; please check your internet connection or try again later.', '', {}));
        } else {
            res.status(200).send(Common.ResFormat(data.status, process.env.Toaster, data.message, data.token, data.data));
        }
    });
};

exports.CovidTestEntry = (req, res) => {
    User.CovidTestEntry(req.body, (error, data) => {
        if (error!=null && error.sqlMessage!=undefined) {
            console.log(error);
            res.status(200).send(Common.ResFormat('0', process.env.Toaster, 'Sorry, something went wrong; please check your internet connection or try again later.', '', {}));
        } else {
            res.status(200).send(Common.ResFormat(data.status, process.env.Toaster, data.message, data.token, data.data));
        }
    });
};

exports.CovidAnsEntry = (req, res) => {
    User.CovidAnsEntry(req.body, (error, data) => {
        if (error!=null && error.sqlMessage!=undefined) {
            console.log(error);
            res.status(200).send(Common.ResFormat('0', process.env.Toaster, 'Sorry, something went wrong; please check your internet connection or try again later.', '', {}));
        } else {
            res.status(200).send(Common.ResFormat(data.status, process.env.Toaster, data.message, data.token, data.data));
        }
    });
};