import apiFetcher from "@/utils/api-fetcher";

export interface CourseTable {
    [key: string]: {name: string};
}

export default async function getTeacherCourse(setData: Function) {
    const res = await apiFetcher('/api/GetTeacherCourseTable?teacherID=' + 4 + "&&semester" + "112-2", { method: 'GET' });

    const result: CourseTable = res?.courseTable?.reduce((acc: { [x: string]: any; }, item: { course: any[]; }) => {
        item.course.forEach(course => {
            course.schedule.forEach((schedule: { intervals: any[]; weekday: any; }) => {
                schedule.intervals.forEach(interval => {
                    let key = `${schedule.weekday}-${interval.time}`;
                    acc[key] = {
                        name: course.name
                    };
                });
            });
        });
        return acc;
    }, {}) || {};

    console.log(result);
    setData(result);
}