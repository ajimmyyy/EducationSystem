import prisma from "@/utils/prisma";
import { Prisma } from "@prisma/client";

export interface SearchCourseParams {
  keyword: string;
  semester: string;
  page: number;
  perPage: number;
}
export interface SearchCourseResult {
  courses: Prisma.CourseGetPayload<{
    include: {
      schedule: {
        include: {
          classroom: true;
        };
      };
      teacher: {
        include: {
          user: true;
        };
      };
      department: true;
    };
  }>[];
  courseCount: number;
}

const searchCache = new Map<string, SearchCourseResult>();

async function searchCourse({
  keyword,
  semester,
  page,
  perPage,
}: SearchCourseParams): Promise<SearchCourseResult> {
  const cacheKey = `${keyword}-${semester}-${page}-${perPage}`;
  if (searchCache.has(cacheKey)) {
    return searchCache.get(cacheKey)!;
  }
  const keywords = keyword.split(/\s+/); // 使用正則表達式分割關鍵字

  const searchConditions = keywords.map((kw) => ({
    OR: [
      {
        name: {
          contains: kw,
          mode: "insensitive",
        },
      },
      {
        syllabus: {
          contains: kw,
          mode: "insensitive",
        },
      },
    ],
  }));

  const result = await prisma.course.findMany({
    where: {
      AND: [
        ...(searchConditions as any),
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
    },
    skip: page * perPage,
    take: perPage,
    orderBy: {
      _relevance: {
        fields: ["name"],
        search: keyword,
        sort: "desc",
      },
    },
  });

  const courseCount = await prisma.course.count({
    where: {
      AND: [
        ...(searchConditions as any),
        {
          semester: semester,
        },
      ],
    },
  });

  searchCache.set(cacheKey, {
    courses: result,
    courseCount,
  });

  return {
    courses: result,
    courseCount,
  };
}

export default {
  searchCourse,
};
