import prisma from "@/utils/prisma";

interface CreateClassroomType {
    location: string
    buildingid?: number
}

interface DeleteClassroomType {
    classroomid: number
}

export class ManageClassroomCase {
    async CreateClassroom(room: CreateClassroomType) {
        const classroom = await prisma.classroom.create({
            data: room
        });
        
        return classroom;
    }

    async DeleteClassroom(classroomData: DeleteClassroomType) {
        const classroom = await prisma.classroom.delete({
            where: {
                classroomid: classroomData.classroomid
            }
        });

        return classroom;
    }

    async IsClassroomExist(room: CreateClassroomType): Promise<boolean> {
        const classroom = await prisma.classroom.findFirst({
            where: {
                location: room.location,
                buildingid: room.buildingid
            }
        });

        if(classroom !== null) {
            return true;
        }
        return false;
    }
}

export const manageClassroomCase = new ManageClassroomCase();