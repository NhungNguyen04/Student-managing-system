import { where } from "sequelize";
import db, { Sequelize, sequelize } from "../models/index";
import bcrypt from "bcryptjs";
const { Op } = require("sequelize");

const assignTeacherIntoClasses = async (teacherId, classId, subjectId) => {
  try {
    let assignment = await db.assignments.findOne({
      where: {
        classId: classId,
        subjectId: subjectId,
      },
    });

    if (assignment === null) {
      assignment = await db.assignments.create({
        teacherId: teacherId,
        classId: classId,
        subjectId: subjectId
      });
    } else {
      await db.assignments.update(
        {
          teacherId: teacherId,
        },
        {
          where: {
            id: assignment.id,
          },
        }
      );
    }

    return {
      EM: "success",
      EC: 0,
      DT: "",
    };
  } catch (e) {
    console.log(e);
    return {
      EM: "something wrong with service",
      EC: 1,
      DT: "",
    };
  }
};

const getAllAssignmentsInYear = async (year) => {
  try {
    let classes = await db.classes.findAll({
      attributes: ["gradeId"],
      required: true,
      include: [
        {
          model: db.grades,
          required: true,
          where: {
            year: year,
          },
        },
      ],
    });
    if (classes.length == 0) {
      return {
        EM: "there is no class to assign in this year",
        EC: 1,
        DT: "",
      };
    }

    let data = await db.assignments.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: db.classes,
          required: true,
          attributes: ["classname", "total"],
          include: [
            {
              model: db.grades,
              required: true,
              attributes: ["gradeName"],
              where: {
                year: year,
              },
            },
          ],
        },
        {
          model: db.teachers,
          attributes: ["teacherName"],
        },
        {
          model: db.subjects,
          attributes: ["subjectname"],
        },
      ],
    });
    return {
      EM: "success",
      EC: 0,
      DT: data,
    };
  } catch (e) {
    console.log(e);
    return {
      EM: "something wrong with service",
      EC: 1,
      DT: "",
    };
  }
};

const deleteTeacherInAssignment = async (subjectId, classId) => {
  try {
    let data = await db.assignments.update(
      {
        teacherId: null,
      },
      {
        where: {
          classId: classId,
          subjectId: subjectId,
        },
      }
    );
    return {
      EM: "success",
      EC: 1,
      DT: "",
    };
  } catch (e) {
    console.log(e);
    return {
      EM: "assignment not found",
      EC: 1,
      DT: "",
    };
  }
};

module.exports = {
  assignTeacherIntoClasses,
  getAllAssignmentsInYear,
  deleteTeacherInAssignment,
};
