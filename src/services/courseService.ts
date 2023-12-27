import { RawCourse } from "@/types/course";
import prisma from "@/utils/prisma";
import { z } from "zod";

interface SearchCourseParams {
  keyword: string;
  semester: string;
  page: number;
  perPage: number;
}

async function searchCourse({
  keyword,
  semester,
  page,
  perPage,
}: SearchCourseParams) {
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

  return result;
}

export default {
  searchCourse,
};
