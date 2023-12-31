import prisma from "@/utils/prisma";

async function getDepartments() {
  const departments = await prisma.department.findMany({
    orderBy: {
      id: "asc",
    },
  });

  return { departments };
}

export default {
  getDepartments,
};
