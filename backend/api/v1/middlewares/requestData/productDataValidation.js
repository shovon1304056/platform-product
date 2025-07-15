var express = require('express');
var router = express.Router();
const isEmpty = require("is-empty");
const commonObject = require('../../common/common');
const courseCategoryModel = require('../../models/course-category');
const courseModel = require('../../models/course');
const courseLessonModel = require('../../models/course-lesson');
const courseLectureModel = require('../../models/course-lecture');
const courseContentTypeModel = require('../../models/course-content-type');
const userModel = require('../../models/user');
const fileUploaderCommonObject = require("../../common/fileUploader");
const multer = require('multer');
var upload = multer({ dest: 'upload/' });
var fs = require('fs');
let moment = require('moment');
const bcrypt = require("bcrypt");


// var upload = multer({ storage: storage });

router.use(async function (req, res, next) {

    let reqData = {

        "lesson_id": req.body.lesson_id,
        "content_type_id": req.body.content_type_id,
        "is_public": req.body.is_public,
        "title_en": req.body.title_en,
        "title_bn": req.body.title_bn,
        "details_en": req.body.details_en,
        "details_bn": req.body.details_bn

    }

    // validate lesson
    let validateId = await commonObject.checkItsNumber(reqData.lesson_id);
    if (validateId.success == false) {

        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "Lesson Value should be integer.",
            "id": reqData.lesson_id

        });
    } else {
        req.body.lesson_id = validateId.data;
        reqData.lesson_id = validateId.data;

    }

    let existingLessonData = await courseLessonModel.getDataByWhereCondition(
        { id: reqData.lesson_id, status: { "GT": 0 } }
    );

    if (isEmpty(existingLessonData)) {

        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "No lesson data found",

        });
    } else {
        reqData.course_id = existingLessonData[0].course_id
    }


    let validateCourseContentType = await commonObject.checkItsNumber(reqData.content_type_id);
    if (validateCourseContentType.success == false) {

        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "Course Content Type Value should be integer.",
            "id": reqData.content_type_id

        });
    } else {
        req.body.content_type_id = validateCourseContentType.data;
        reqData.content_type_id = validateCourseContentType.data;

    }

    let courseContentType = await courseContentTypeModel.getDataByWhereCondition(
        { id: reqData.content_type_id, status: 1 }
    );

    if (isEmpty(courseContentType)) {

        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "No course content type data found",

        });
    }


    let errorMessage = "";
    let isError = 0;

    // ***************

    // is public validation
    if (["0", "1", 0, 1].indexOf(reqData.is_public) == -1) {
        isError = 1;
        errorMessage += "Unknown is public. ";
    }

    // title validation
    let validateTitleEn = await commonObject.characterLimitCheck(reqData.title_en, "Course Lecture");
    if (validateTitleEn.success == false) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": validateTitleEn.message,

        });
    }

    reqData.title_en = validateTitleEn.data;

    let validateTitleBn = await commonObject.characterLimitCheck(reqData.title_bn, "Course Lecture");

    if (validateTitleBn.success == false) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": validateTitleBn.message,

        });
    }

    reqData.title_bn = validateTitleBn.data;

    let titleObject = {
        "en": reqData.title_en,
        "bn": reqData.title_bn,
    }

    let existingData = await courseLectureModel.getByJSONTitle(titleObject, reqData.lesson_id);

    if (!isEmpty(existingData)) {
        return res.status(409).send({
            "success": false,
            "status": 409,
            "message": existingData[0].status == "1" ? "Any of This Course Lecture Already Exists." : "Any of This Course Lecture Already Exists but Deactivate, You can activate it."
        });
    } else {
        reqData.title = JSON.stringify(titleObject);
    }

    if (courseContentType[0].title.toUpperCase() == 'TEXT FIELD' || courseContentType[0].title.toUpperCase() == 'EXTERNAL LINK') {

        if (isEmpty(reqData.details_en) || isEmpty(reqData.details_bn)) {
            isError = 1;
            errorMessage += " Description should not be empty. ";

        } else {
            let detailsObject = {
                "en": reqData.details_en,
                "bn": reqData.details_bn,
            }
            reqData.details = JSON.stringify(detailsObject);

            reqData.file_name = '';

        }
    } else {
        // course cover image code
        if (req.files && Object.keys(req.files).length > 0) {
            let fileUploadCode = {};

            if (req.files.file_name) {

                let fileTypeObjectName;
                if (courseContentType[0].title.toUpperCase() == 'PDF') {
                    fileTypeObjectName = "courseLessonPDF";
                } else if ((courseContentType[0].title.toUpperCase() == 'TEXT')) {
                    fileTypeObjectName = "courseLessonDOC";
                } else if (courseContentType[0].title.toUpperCase() == 'IMAGE') {
                    fileTypeObjectName = "courseLessonImage";
                } else if (["VIDE0"].indexOf((courseContentType[0].title).toUpperCase()) == -1) {
                    fileTypeObjectName = "courseLessonVideo";
                }

                fileUploadCode = await fileUploaderCommonObject.uploadFile(
                    req,
                    fileTypeObjectName,
                    "file_name"
                );

                if (fileUploadCode.success == false) {
                    return res.status(400).send({
                        success: false,
                        status: 400,
                        message: fileUploadCode.message,
                    });
                }

                reqData.file_name = fileUploadCode.fileName;
                reqData.details = null;
            }

        }
    }

    if (isError == 1) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": errorMessage
        });
    }

    req.data = reqData;

    next();

});

module.exports = router;
