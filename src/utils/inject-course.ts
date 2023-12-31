import { RawCourse } from "@/types/course";
import prisma from "@/utils/prisma";

let isInjecting = false;

export async function injectCoursesData(
  semester: string,
  rawCourses: RawCourse[],
) {
  if (isInjecting) {
    throw new Error("Another injection is in progress");
  }
  isInjecting = true;
  console.log(`Injecting courses for semester ${semester}`);
  // Delete old course data
  await prisma.interval.deleteMany({
    where: {
      schedule: {
        course: { semester },
      },
    },
  });
  await prisma.schedule.deleteMany({ where: { course: { semester } } });

  await prisma.course.deleteMany({ where: { semester } });

  // Extract unique teacher names and classroom locations
  const uniqueTeachers = [
    ...new Set(rawCourses.map((course) => course.teacherName).filter(Boolean)),
  ];
  const uniqueClassrooms = [
    ...new Set(rawCourses.map((course) => course.classroom).filter(Boolean)),
  ];
  const uniqueDepartments = [
    ...new Set(
      rawCourses.map((course) => course.departmentName).filter(Boolean),
    ),
  ];

  // Find or create teachers and classrooms
  const teachers = await findOrCreateTeachers(uniqueTeachers);
  const classrooms = await findOrCreateClassrooms(uniqueClassrooms);
  const departments = await funOrCreateDepartmends(uniqueDepartments);

  // Prepare course data for batch insertion
  const coursesData = rawCourses.map((rawCourse) => {
    const teacher = teachers.find((t) => t.user.name === rawCourse.teacherName);
    const department = departments.find(
      (d) => d.name === rawCourse.departmentName,
    );

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
      departmentId: department ? department.id : null,
    };
  });

  // Batch insert courses
  console.log("Injecting courses... Time", new Date());
  await prisma.course.createMany({ data: coursesData });
  const courses = await prisma.course.findMany({
    where: { semester },
    select: { id: true, code: true },
  });

  // Batch insert schedules
  await prisma.schedule.createMany({
    data: rawCourses.flatMap((rawCourse) => {
      const course = courses.find((c) => c.code === rawCourse.code);
      const classroom = classrooms.find(
        (c) => c.location === rawCourse.classroom,
      );

      if (!course) {
        return [];
      }

      return rawCourse.schedule
        .map((intervals, weekday) => ({
          weekday: Number(weekday),
          courseId: course?.id,
          classroomId: classroom ? classroom.id : null,
        }))
        .filter((courseData) => {
          const intervals = rawCourse.schedule[courseData.weekday];
          return intervals && intervals.length > 0;
        }); // 过滤掉没有课的时间
    }),
  });

  // Batch insert intervals
  await prisma.interval.createMany({
    data: rawCourses.flatMap((rawCourse) => {
      const course = courses.find((c) => c.code === rawCourse.code);
      if (!course) {
        return [];
      }

      return rawCourse.schedule.flatMap((intervals, weekday) =>
        intervals
          .filter((time) => time.length > 0)
          .map((time) => ({
            time: time,
            courseId: course.id,
            weekday: weekday,
          })),
      );
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
      `Batch ${i / batchSize + 1} / ${Math.ceil(names.length / batchSize)}`,
    );
    const batch = names.slice(i, i + batchSize);
    const batchTeachers = await Promise.all(
      batch.map((name) => findOrCreateTeacher(name)),
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
      `Batch ${i / batchSize + 1} / ${Math.ceil(locations.length / batchSize)}`,
    );
    const batch = locations.slice(i, i + batchSize);
    const batchTeachers = await Promise.all(
      batch.map((name) => findOrCreateClassroom(name)),
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

async function funOrCreateDepartmends(departmentNames: string[]) {
  console.log("Finding or creating departments...");
  console.log(`Total ${departmentNames.length} departments`);
  const batchSize = 20;
  const departments = [];

  for (let i = 0; i < departmentNames.length; i += batchSize) {
    console.log(
      `Batch ${i / batchSize + 1} / ${Math.ceil(
        departmentNames.length / batchSize,
      )}`,
    );
    const batch = departmentNames.slice(i, i + batchSize);
    const batchTeachers = await Promise.all(
      batch.map((name) => findOrCreateDepartment(name)),
    );
    departments.push(...batchTeachers.filter(Boolean)); // 过滤掉 null 值
  }

  return departments.filter(Boolean);
}

async function findOrCreateDepartment(name: string) {
  let department = await prisma.department.findFirst({ where: { name } });
  if (!department) {
    department = await prisma.department.create({ data: { name } });
  }
  return department;
}
