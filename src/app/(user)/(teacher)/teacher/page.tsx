"use client";
import TeacherTable from "@/components/teacher/teacher-table";
import useUser from "@/hooks/useUser";

export default function Home() {
    const { data: user } = useUser();
    if (!user) {
        return <>沒登入老師帳號</>;
    }
    return (
        <TeacherTable teacherID={user.id} />
    );
}