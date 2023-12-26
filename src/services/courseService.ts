import { RawCourse } from "@/types/course";
import courses from "@/data/courses-112-2.json";
import prisma from "@/utils/prisma";
import { Classroom, Teacher } from "@prisma/client";
import * as data from "@/data/courses-112-2.json" assert { type: "json" };

async function injectCoursesData(semester: string, rawCourses: RawCourse[]) {
  // 刪除舊課程資料
  await prisma.schedule.deleteMany({
    where: {
      course: {
        semester,
      },
    },
  });
  await prisma.course.deleteMany({
    where: {
      semester,
    },
  });

  // 新增新資料
  let index = 0;
  let startTime = new Date();
  console.log(`開始注入課程資料: ${rawCourses.length} 筆，時間：${startTime}`);
  for (const rawCourse of rawCourses) {
    index++;
    if (!rawCourse.code || !rawCourse.name) continue;

    const teacher: Teacher | null = await findOrCreateTeacher(
      rawCourse.teacherName
    );
    const classroom: Classroom | null = await findOrCreateClassroom(
      rawCourse.classroom
    );
    console.log(
      `注入課程進度: ${index}/${rawCourses.length} - ${rawCourse.name} ${rawCourse.code}`
    );
    const course = await prisma.course.create({
      data: {
        name: rawCourse.name,
        code: rawCourse.code,
        credit: Number(rawCourse.credit) || 0,
        phase: Number(rawCourse.phase) || 0,
        hours: Number(rawCourse.hours) || 0,
        studentQuota: Number(rawCourse.studentQuota) || 0,
        syllabus: rawCourse.syllabus || "",
        progress: rawCourse.progress || "",
        grading: rawCourse.grading || "",
        textbook: rawCourse.textbook || "",
        note: rawCourse.note || "",
        note2: rawCourse.note2 || "",
        semester,
        isEnglishTaught: rawCourse.isEnglishTaught || false,
        teacher: teacher
          ? {
              connect: {
                id: teacher?.id,
              },
            }
          : undefined,
        schedule: {
          createMany: {
            data: rawCourse.schedule
              .map((intervals, weekday) => ({
                weekday,
                intervals,
                classroomId: classroom?.id,
              }))
              .filter((schedule) => schedule.intervals.length > 0),
          },
        },
      },
    });
  }
  console.log(
    `課程資料注入完成，時間：${new Date()}，耗時：${
      (new Date().getTime() - startTime.getTime()) / 1000
    }s`
  );
}

async function findOrCreateTeacher(name: string) {
  let teacher: Teacher | null = null;
  if (!name) return null;
  teacher = await prisma.teacher.findFirst({
    where: {
      user: {
        name,
      },
    },
  });
  if (!teacher) {
    teacher = await prisma.teacher.create({
      data: {
        user: {
          create: {
            name,
            password: "",
            email: "",
          },
        },
      },
    });
  }
  return teacher;
}

async function findOrCreateClassroom(location: string) {
  let classroom: Classroom | null = null;
  if (!location) return null;
  classroom = await prisma.classroom.findFirst({
    where: {
      location,
    },
  });
  if (!classroom) {
    classroom = await prisma.classroom.create({
      data: {
        location,
      },
    });
  }

  return classroom;
}

export async function main() {
  await injectCoursesData("112-2", Array.from(data as any));
}
