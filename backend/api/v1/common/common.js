var fs = require("fs");
const isEmpty = require("is-empty");
const moment = require("moment");
const momentTZ = require('moment-timezone');
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userModel = require("../models/user");
const superAdminModel = require("../models/super-admin");

const jwksClient = require('jwks-rsa');
const { json } = require("express");

let hashingUsingCrypto = async (text = "") => {
    const key = Buffer.from(
        "xNRxA48aNYd33PXaODSutRNFyCu4cAe/InKT/Rx+bw0=",
        "base64"
    );

    if (typeof (text) !== "string") text = text.toString();


    const iv = Buffer.from("81dFxOpX7BPG1UpZQPcS6w==", "base64");
    const algorithm = "aes-256-cbc";

    // Creating Cipheriv with its parameter
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);

    // Updating text
    let encrypted = cipher.update(text);

    // Using concatenation
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString("hex");
};

let decodingUsingCrypto = async (text = "") => {
    const key = Buffer.from(
        "xNRxA48aNYd33PXaODSutRNFyCu4cAe/InKT/Rx+bw0=",
        "base64"
    );
    const iv = Buffer.from("81dFxOpX7BPG1UpZQPcS6w==", "base64");
    const algorithm = "aes-256-cbc";

    let encryptedText = Buffer.from(text, "hex");
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);

    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
};

let characterLimitCheck = async (value = "", modelField = "", willAllowExtraSpace = false) => {

    let originalValue = value;
    // remove extra space

    if (!willAllowExtraSpace) {
        value = value.replace(/\s+/g, " ");
    }

    if (typeof (value) === "string") value = value.trim();
    // console.log(value.length);

    // unknown space special character remove
    value = value.replace("ㅤ", " ");

    if (isEmpty(value) || value == null || value == undefined) {
        return {
            success: false,
            message: `${modelField} is empty. `,
            data: value,
        };
    }

    let data = [{
        modelField: "Password",
        maxLength: 20,
        minLength: 6,
        isAllowStartWithNumeric: true,
        isAllowStartWithSpecialCharacter: true,
        willItUpperCase: false,
        isAllowSpace: false,
        isMustUserSpecialCharacter: false,
        isMustUserUpperCharacter: false,
        isMustUserLowerCharacter: false,
        isMustUserNumberCharacter: false,
        minimumNumberCharacter: 0,
    },
    {
        modelField: "Name",
        maxLength: 45,
        minLength: 2,
        isAllowStartWithNumeric: true,
        isAllowStartWithSpecialCharacter: true,
        willItUpperCase: false,
        isAllowSpace: true,
        isMustUserSpecialCharacter: false,
        isMustUserUpperCharacter: false,
        isMustUserLowerCharacter: false,
        isMustUserNumberCharacter: false,
        minimumNumberCharacter: 0
    },



    {
        modelField: "Product Category",
        maxLength: 50,
        minLength: 2,
        isAllowStartWithNumeric: false,
        isAllowStartWithSpecialCharacter: false,
        willItUpperCase: false,
        isAllowSpace: true,
        isMustUserSpecialCharacter: false,
        isMustUserUpperCharacter: false,
        isMustUserLowerCharacter: false,
        isMustUserNumberCharacter: false,
        minimumNumberCharacter: 0
    },

    {
        modelField: "Product",
        maxLength: 60,
        minLength: 2,
        isAllowStartWithNumeric: false,
        isAllowStartWithSpecialCharacter: false,
        willItUpperCase: false,
        isAllowSpace: true,
        isMustUserSpecialCharacter: false,
        isMustUserUpperCharacter: false,
        isMustUserLowerCharacter: false,
        isMustUserNumberCharacter: false,
        minimumNumberCharacter: 0
    },

    ];

    let index = await data.find(
        (element) => element.modelField.toUpperCase() == modelField.toUpperCase()
    );

    if (index === undefined) {
        return {
            success: false,
            message: `${modelField} is unknown model field. `,
            data: value,
        };
    } else {
        data = index;
    }

    if (data.isAllowSpace === false) {
        if (originalValue.indexOf(" ") > -1) {
            return {
                success: false,
                message: `Space is not allowed in ${data.modelField}. `,
                data: originalValue,
            };
        }
    }

    if (
        value.length < data.minLength ||
        (value.length > data.maxLength && data.maxLength != -1)
    ) {
        return {
            success: false,
            message: data.maxLength == -1 ? `${data.modelField} Length should be at least ${data.minLength} ` : `${data.modelField} Length should be between ${data.minLength} to ${data.maxLength}. `,
            data: originalValue,
        };
    }

    if (data.isAllowStartWithSpecialCharacter == false) {
        if (
            (value.charCodeAt(0) >= 32 && value.charCodeAt(0) <= 47) ||
            (value.charCodeAt(0) >= 58 && value.charCodeAt(0) <= 64) ||
            (value.charCodeAt(0) >= 91 && value.charCodeAt(0) <= 96) ||
            (value.charCodeAt(0) >= 123 && value.charCodeAt(0) <= 126)
        )
            return {
                success: false,
                message: `${data.modelField} never start with special character. `,
                data: originalValue,
            };
    }

    if (data.isAllowStartWithNumeric == false) {
        if (value.charCodeAt(0) >= 48 && value.charCodeAt(0) <= 57) {
            return {
                success: false,
                message: `${data.modelField} never start with number. `,
                data: originalValue,
            };
        }
    }

    if (data.willItUpperCase == true) {
        let tempData = "";

        for (let j = 0; j < value.length; j++) {
            if (
                (value.charCodeAt(j) >= 65 && value.charCodeAt(j) <= 90) ||
                (value.charCodeAt(j) >= 97 && value.charCodeAt(j) <= 122)
            )
                tempData += value[j].toUpperCase();
            else tempData += value[j];
        }

        value = tempData;
    }


    // minimum character type check
    let totalUpperCharacter = 0,
        totalLowerCharacter = 0,
        totalNumberCharacter = 0,
        totalSpecialCharacter = 0;

    for (let i = 0; i < value.length; i++) {
        if (value[i] >= "A" && value[i] <= "Z") totalUpperCharacter++;
        else if (value[i] >= "a" && value[i] <= "z") totalLowerCharacter++;
        else if (value[i] >= "0" && value[i] <= "9") totalNumberCharacter++;
        else totalSpecialCharacter++;
    }


    if (data.isMustUserSpecialCharacter === true && totalSpecialCharacter == 0) {
        return {
            success: false,
            message: `${data.modelField} must have special character. `,
            data: originalValue,
        };
    }


    if (data.isMustUserUpperCharacter === true && totalUpperCharacter == 0) {
        return {
            success: false,
            message: `${data.modelField} must have upper character. `,
            data: originalValue,
        };
    }


    if (data.isMustUserLowerCharacter === true && totalLowerCharacter == 0) {
        return {
            success: false,
            message: `${data.modelField} must have lower character. `,
            data: originalValue,
        };
    }


    if (data.isMustUserNumberCharacter === true && totalNumberCharacter < data.minimumNumberCharacter) {
        return {
            success: false,
            message: `${data.modelField} must have use ${data.minimumNumberCharacter} number character. `,
            data: originalValue,
        };
    }


    return {
        success: true,
        message: "",
        data: value,
    };
};



// Asia/Dhaka
let getGMT = async (dateTime = undefined) => { // now gmt is set for dhaka , check server.js
    let currentGMT = "";
    if (dateTime === undefined) {
        // dateTime = new Date();
        let currentTZ = momentTZ().tz("Asia/Dhaka").format();
        currentGMT = moment(currentTZ, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
    }
    else {
        currentGMT = moment(dateTime, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
    }
    return currentGMT;
};




let addFiveMinuteToGMT = async (dateTime = undefined) => {
    let fiveMinuteToGMT = "";

    if (dateTime === undefined) {
        let currentTZ = momentTZ().tz("Asia/Dhaka").format();
        fiveMinuteToGMT = moment(currentTZ, "YYYY-MM-DD HH:mm:ss").add(5, 'minutes').format("YYYY-MM-DD HH:mm:ss");
    } else {
        fiveMinuteToGMT = moment(dateTime, "YYYY-MM-DD HH:mm:ss").add(5, 'minutes').format("YYYY-MM-DD HH:mm:ss");
    }

    return fiveMinuteToGMT;
};

let addSixtyMinuteToGMT = async (dateTime = undefined) => {
    let fiveMinuteToGMT = "";

    if (dateTime === undefined) {
        let currentTZ = momentTZ().tz("Asia/Dhaka").format();
        fiveMinuteToGMT = moment(currentTZ, "YYYY-MM-DD HH:mm:ss").add(60, 'minutes').format("YYYY-MM-DD HH:mm:ss");
    } else {
        fiveMinuteToGMT = moment(dateTime, "YYYY-MM-DD HH:mm:ss").add(60, 'minutes').format("YYYY-MM-DD HH:mm:ss");
    }

    return fiveMinuteToGMT;
};



let getCustomDateTime = async (
    date = "20/12/2012",
    extraDay = 0,
    extraMonth = 0,
    extraYear = 0,
    extraMinutes = 0
) => {
    try {

        let customDate = new Date(date);
        customDate.setMinutes(customDate.getMinutes() + extraMinutes);
        customDate.setDate(customDate.getDate() + extraDay);
        customDate.setMonth(customDate.getMonth() + extraMonth);
        customDate.setFullYear(customDate.getFullYear() + extraYear);

        date = customDate.getFullYear() +
            "-" +
            ("00" + (customDate.getMonth() + 1)).slice(-2) +
            "-" +
            ("00" + customDate.getDate()).slice(-2) +
            (" " + customDate.getHours()) +
            (":" + customDate.getMinutes()) +
            (":" + customDate.getSeconds());

        return date;
    } catch (error) {
        // console.log("sssssssssss")
        return await getTodayDate();
    }
};


let getTodayDate = async () => {
    let date = new Date(
        new Date().toLocaleString("en-US", {
            timeZone: "Asia/Dhaka",
        })
    );

    let toDayDate =
        date.getFullYear() +
        "-" +
        ("00" + (date.getMonth() + 1)).slice(-2) +
        "-" +
        ("00" + date.getDate()).slice(-2);

    return toDayDate;
};

let getCustomDate = async (
    date = "20/12/2012",
    extraDay = 0,
    extraMonth = 0,
    extraYear = 0
) => {
    try {
        let customDate = new Date(date);
        customDate.setDate(customDate.getDate() + extraDay);
        customDate.setMonth(customDate.getMonth() + extraMonth);
        customDate.setFullYear(customDate.getFullYear() + extraYear);

        date =
            customDate.getFullYear() +
            "-" +
            ("00" + (customDate.getMonth() + 1)).slice(-2) +
            "-" +
            ("00" + customDate.getDate()).slice(-2);
        return date;
    } catch (error) {
        return await getTodayDate();
    }
};




let checkItsNumber = async (value) => {
    let result = {
        success: false,
        data: value,
    };

    try {
        if (typeof value === "string") {
            result.data = parseFloat(value);
            // value = result.data;
        }

        if (!isNaN(value) || (value !== "" && value !== null && value !== undefined)) {

            if ((typeof value === "number" && value >= 0) || (typeof value === "string" && (value == parseInt(value) || value == parseFloat(value)))) {
                result.success = true;
            }
        }
    } catch (error) { }

    //console.log(result);
    return result;
};



let duplicateCheckInArray = async (arrayData = []) => {
    let duplicate = arrayData.some((element, index) => {
        return arrayData.indexOf(element) !== index;
    });

    if (duplicate) {
        return {
            result: true,
            message: "Duplicate value found.",
        };
    } else
        return {
            result: false,
            message: "Duplicate value not found.",
        };
};



// email validation
let isValidEmail = async (email) => {
    var pattern = /\S+@\S+\.\S+/; // old one
    //var pattern = /\S+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/; // new one

    return pattern.test(email);
};


let randomStringGenerate = async (length = 10) => {
    return new Promise((resolve, reject) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        let randomString = '';
        const charactersLength = characters.length;

        for (let i = 0; i < length; i++) {
            randomString += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return resolve(randomString);
    });
};


module.exports = {
    
    characterLimitCheck,
    getTodayDate,
    getCustomDate,
    getCustomDateTime,
    checkItsNumber,
    getGMT,
    addFiveMinuteToGMT,
    isValidEmail,
    duplicateCheckInArray,
    addSixtyMinuteToGMT,
    hashingUsingCrypto,
    decodingUsingCrypto,
    randomStringGenerate
};