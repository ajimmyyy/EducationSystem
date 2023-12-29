import apiFetcher from "@/utils/api-fetcher";

export default async function getTeacherCourse(setData: Function) {
    const res = await apiFetcher('/api/GetTeacherCourseTable?teacherID=' + 4 + "&&semester" + "112-2", { method: 'GET' });

    const result = res?.courseTable?.reduce((acc: { [x: string]: any; }, item: { course: any[]; }) => {
        item.course.forEach(course => {
            course.schedule.forEach((schedule: { intervals: any[]; weekday: any; }) => {
                schedule.intervals.forEach(interval => {
                    let key = `${schedule.weekday}-${interval.time}`;
                    acc[key] = course.name;
                });
            });
        });
        return acc;
    }, {}) || {};

    console.log(result);
    // for (let course of data.course) {
    //     console.log(course);
    //     courseTable[course.name as string] = course.name;
    // }
    // setData(data);
}