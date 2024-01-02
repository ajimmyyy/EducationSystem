import prisma from "@/utils/prisma";
import { Prisma } from "@prisma/client";

export type FullCourse = Prisma.CourseGetPayload<{
  include: {
    schedule: {
      include: {
        classroom: true;
        intervals: true;
      };
    };
    teacher: {
      include: {
        user: true;
      };
    };
    department: true;
    unassignedCourse: {
      include: {
        courseTable: true;
      };
    };
    participationCourse: {
      include: {
        courseTable: true;
      };
    };
    collectCourse: true;
  };
}>;

export interface SearchCourseParams {
  keyword: string;
  semester: string;
  schedule?: string;
  departments?: string;
  page: number;
  perPage: number;
  userId?: number;
}
export interface SearchCourseResult {
  courses: FullCourse[];
  courseCount: number;
}

async function searchCourse({
  keyword,
  semester,
  schedule,
  departments,
  page,
  perPage,
}: SearchCourseParams): Promise<SearchCourseResult> {
  const keywords = keyword.split(" ");
  const schedules = schedule?.split(",").filter((s) => s.length > 0) ?? []; // 00,01,20 [星期幾][節次]
  const departmentIds =
    departments
      ?.split(",")
      .filter((s) => s.length > 0)
      .map(Number) ?? [];

  const keywordConditions = keywords.map((keyword) => ({
    OR: [
      {
        name: {
          contains: keyword,
          mode: "insensitive",
        },
      },
      {
        teacher: {
          user: {
            name: {
              contains: keyword,
              mode: "insensitive",
            },
          },
        },
      },
      {
        code: {
          contains: keyword,
          mode: "insensitive",
        },
      },
    ],
  }));

  const result = await prisma.course.findMany({
    where: {
      AND: [
        {
          OR: [...(keywordConditions as any)],
        },
        {
          schedule:
            schedules.length > 0
              ? {
                  some: {
                    intervals: {
                      some: {
                        OR: schedules.map((schedule) => ({
                          weekday: Number(schedule[0]),
                          time: schedule[1],
                        })),
                      },
                    },
                  },
                }
              : undefined,
        },
        {
          department:
            departmentIds?.length > 0
              ? {
                  id: {
                    in: departmentIds,
                  },
                }
              : undefined,
        },
        {
          semester: semester,
        },
      ],
    },
    include: {
      schedule: {
        include: {
          classroom: true,
          intervals: true,
        },
      },
      teacher: {
        include: {
          user: true,
        },
      },
      department: true,
      unassignedCourse: {
        include: {
          courseTable: true,
        },
      },
      participationCourse: {
        include: {
          courseTable: true,
        },
      },
      collectCourse: true,
    },
    skip: page * perPage,
    take: perPage,
    orderBy: {
      _relevance: {
        fields: ["name"],
        search: keywords[0],
        sort: "desc",
      },
    },
  });
  const courseCount = await prisma.course.count({
    where: {
      AND: [
        {
          OR: [...(keywordConditions as any)],
        },
        {
          schedule:
            schedules.length > 0
              ? {
                  some: {
                    intervals: {
                      some: {
                        OR: schedules.map((schedule) => ({
                          weekday: Number(schedule[0]),
                          time: schedule[1],
                        })),
                      },
                    },
                  },
                }
              : undefined,
        },
        {
          department:
            departmentIds?.length > 0
              ? {
                  id: {
                    in: departmentIds,
                  },
                }
              : undefined,
        },
        {
          semester: semester,
        },
      ],
    },
  });

  return {
    courses: result,
    courseCount,
  };
}

async function getCourseById(id: number) {
  const course = await prisma.course.findUnique({
    where: {
      id,
    },
    include: {
      schedule: {
        include: {
          classroom: true,
          intervals: true,
        },
      },
      teacher: {
        include: {
          user: true,
        },
      },
      department: true,
      unassignedCourse: {
        include: {
          courseTable: true,
        },
      },
      participationCourse: {
        include: {
          courseTable: true,
        },
      },
      collectCourse: true,
    },
  });

  return {
    course,
  };
}

export default {
  searchCourse,
  getCourseById,
};
