const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

console.log("warning: Prisma Clients is running");
export default prisma
