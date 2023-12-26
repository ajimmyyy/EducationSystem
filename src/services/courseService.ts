import { RawCourse } from "@/types/course";
import * as data from "@/data/courses-112-2.json" assert { type: "json" };
import prisma from "@/utils/prisma";

let isInjecting = false;

async function injectCoursesData(semester: string, rawCourses: RawCourse[]) {
  if (isInjecting) {
    throw new Error("Another injection is in progress");
  }
  isInjecting = true;
  // Delete old course data
  await prisma.schedule.deleteMany({ where: { course: { semester } } });
  await prisma.course.deleteMany({ where: { semester } });

  // Extract unique teacher names and classroom locations
  const uniqueTeachers = [
    ...new Set(rawCourses.map((course) => course.teacherName).filter(Boolean)),
  ];
  const uniqueClassrooms = [
    ...new Set(rawCourses.map((course) => course.classroom).filter(Boolean)),
  ];

  // Find or create teachers and classrooms
  const teachers = await findOrCreateTeachers(uniqueTeachers);
  const classrooms = await findOrCreateClassrooms(uniqueClassrooms);

  // Prepare course data for batch insertion
  const coursesData = rawCourses.map((rawCourse) => {
    const teacher = teachers.find((t) => t.user.name === rawCourse.teacherName);

    return {
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
      isEnglishTaught: rawCourse.isEnglishTaught || false,
      semester,
      teacherId: teacher ? teacher.id : null,
    };
  });

  // Batch insert courses
  console.log("Injecting courses... Time", new Date());
  await prisma.course.createMany({ data: coursesData });
  const courses = await prisma.course.findMany({
    where: { semester },
    select: { id: true, code: true },
  });
  await prisma.schedule.createMany({
    data: rawCourses.flatMap((rawCourse, i) => {
      const course = courses.find((c) => c.code === rawCourse.code);
      const classroom = classrooms.find(
        (c) => c.location === rawCourse.classroom
      );

      if (!course) {
        return [];
      }

      return rawCourse.schedule
        .map((intervals, weekday) => ({
          weekday: Number(weekday),
          intervals,
          courseId: course?.id,
          classroomId: classroom ? classroom.id : null,
        }))
        .filter((schedule) => schedule.intervals.length > 0);
    }),
  });

  console.log("Courses injected. Time", new Date());

  console.log(`Courses injected for semester ${semester}`);
  isInjecting = false;
}

async function findOrCreateTeachers(names: string[]) {
  console.log("Finding or creating teachers...");
  const batchSize = 20;
  const teachers = [];
  console.log(`Total ${names.length} teachers`);
  console.log(`Batch size ${batchSize}`);

  for (let i = 0; i < names.length; i += batchSize) {
    console.log(
      `Batch ${i / batchSize + 1} / ${Math.ceil(names.length / batchSize)}`
    );
    const batch = names.slice(i, i + batchSize);
    const batchTeachers = await Promise.all(
      batch.map((name) => findOrCreateTeacher(name))
    );
    teachers.push(...batchTeachers.filter(Boolean)); // 过滤掉 null 值
  }

  return teachers.filter(Boolean);
}

async function findOrCreateTeacher(name: string) {
  let teacher = await prisma.teacher.findFirst({
    where: { user: { name } },
    include: { user: true },
  });
  if (!teacher) {
    teacher = await prisma.teacher.create({
      data: {
        user: {
          create: {
            name,
            password: "", // Dummy password, adjust as needed
            email: "", // Dummy email, adjust as needed
          },
        },
      },
      include: { user: true },
    });
  }
  return teacher;
}

async function findOrCreateClassrooms(locations: string[]) {
  console.log("Finding or creating classrooms...");
  console.log(`Total ${locations.length} classrooms`);
  const batchSize = 20;
  const classrooms = [];

  for (let i = 0; i < locations.length; i += batchSize) {
    console.log(
      `Batch ${i / batchSize + 1} / ${Math.ceil(locations.length / batchSize)}`
    );
    const batch = locations.slice(i, i + batchSize);
    const batchTeachers = await Promise.all(
      batch.map((name) => findOrCreateClassroom(name))
    );
    classrooms.push(...batchTeachers.filter(Boolean)); // 过滤掉 null 值
  }

  return classrooms.filter(Boolean);
}

async function findOrCreateClassroom(location: string) {
  let classroom = await prisma.classroom.findFirst({ where: { location } });
  if (!classroom) {
    classroom = await prisma.classroom.create({ data: { location } });
  }
  return classroom;
}

export async function main() {
  await injectCoursesData("112-2", Array.from(data as any));
}

// Call main function
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
