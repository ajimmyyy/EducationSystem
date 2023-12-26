-- CreateEnum
CREATE TYPE "CoueseAssignedState" AS ENUM ('wait', 'success', 'fail');

-- CreateTable
CREATE TABLE "Classroom" (
    "id" SERIAL NOT NULL,
    "location" VARCHAR(255) NOT NULL,
    "buildingid" INTEGER,

    CONSTRAINT "Classroom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "credit" INTEGER NOT NULL,
    "phase" INTEGER NOT NULL,
    "hours" INTEGER NOT NULL,
    "studentQuota" INTEGER NOT NULL,
    "syllabus" VARCHAR(2048),
    "progress" VARCHAR(2048),
    "grading" VARCHAR(2048),
    "textbook" VARCHAR(2048),
    "note" VARCHAR(2048),
    "note2" VARCHAR(2048),
    "semester" VARCHAR(5) NOT NULL,
    "isEnglishTaught" BOOLEAN NOT NULL DEFAULT false,
    "teacherId" INTEGER,
    "departmentId" INTEGER,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseTable" (
    "id" SERIAL NOT NULL,
    "semester" VARCHAR(255) NOT NULL,
    "studentId" INTEGER NOT NULL,

    CONSTRAINT "CourseTable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255),
    "phone" VARCHAR(20),

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Schedule" (
    "weekday" INTEGER NOT NULL,
    "intervals" TEXT[],
    "courseId" INTEGER NOT NULL,
    "classroomId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("courseId","weekday")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "cellphone" VARCHAR(20),
    "departmentId" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Manager" (
    "id" INTEGER NOT NULL,

    CONSTRAINT "Manager_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" INTEGER NOT NULL,
    "class" VARCHAR(50),

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teacher" (
    "id" INTEGER NOT NULL,
    "office" VARCHAR(50),
    "web" VARCHAR(255),
    "info" TEXT,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectCourse" (
    "studentId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,

    CONSTRAINT "CollectCourse_pkey" PRIMARY KEY ("studentId","courseId")
);

-- CreateTable
CREATE TABLE "ParticipationCourse" (
    "courseId" INTEGER NOT NULL,
    "courseTableId" INTEGER NOT NULL,

    CONSTRAINT "ParticipationCourse_pkey" PRIMARY KEY ("courseTableId","courseId")
);

-- CreateTable
CREATE TABLE "UnassignedCourse" (
    "courseTableId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "requestTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT,
    "state" "CoueseAssignedState" NOT NULL DEFAULT 'wait',

    CONSTRAINT "UnassignedCourse_pkey" PRIMARY KEY ("courseTableId","courseId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Course_code_key" ON "Course"("code");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseTable" ADD CONSTRAINT "CourseTable_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Manager" ADD CONSTRAINT "Manager_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectCourse" ADD CONSTRAINT "CollectCourse_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectCourse" ADD CONSTRAINT "CollectCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipationCourse" ADD CONSTRAINT "ParticipationCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipationCourse" ADD CONSTRAINT "ParticipationCourse_courseTableId_fkey" FOREIGN KEY ("courseTableId") REFERENCES "CourseTable"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnassignedCourse" ADD CONSTRAINT "UnassignedCourse_courseTableId_fkey" FOREIGN KEY ("courseTableId") REFERENCES "CourseTable"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnassignedCourse" ADD CONSTRAINT "UnassignedCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
