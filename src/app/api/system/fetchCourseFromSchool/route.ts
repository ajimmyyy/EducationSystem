import type { Page } from "puppeteer";
import puppeteer from "puppeteer";
import { load } from "cheerio";
import { URL } from "url";
import fs from "fs";
import type { RawCourse } from "@/types/course";

async function fetchCourseData(year: string, semester: string) {
  const url = "https://aps.ntut.edu.tw/course/tw/";
  const subjStart = `Subj.jsp?format=-2&year=${year}&sem=${semester}`;
  const browser = await initializeBrowser();
  const page = await browser.newPage();
  await setupPage(page);
  await page.goto(`${url}${subjStart}`, { waitUntil: "networkidle2" });

  const links = await getLinks(page);
  const rawdata = await processLinks(links, page, url, `${year}-${semester}`);
  const data = removeDeplicateCodeCourses(rawdata);

  await browser.close();
  saveDataToFile(data, year, semester);
  return data;
}

async function initializeBrowser() {
  return puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
}

async function setupPage(page: Page) {
  const userAgent =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.85 Safari/537.36";
  await page.setUserAgent(userAgent);
}

async function getLinks(page: Page): Promise<string[]> {
  const content = await page.content();
  const $ = load(content);
  return $("a[href]")
    .slice(6)
    .map((_, link) => $(link).attr("href"))
    .get();
}

async function processLinks(
  links: string[],
  page: Page,
  baseUrl: string,
  semester: string,
): Promise<RawCourse[]> {
  const data: RawCourse[] = [];
  console.log("共有: ", links.length, "個系所");
  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    console.log("系所: ", i + 1, "/", links.length);
    await page.goto(new URL(link, baseUrl).toString(), {
      waitUntil: "networkidle2",
    });
    await new Promise((resolve) => setTimeout(resolve, 300));
    data.push(...(await processSubPage(page, link, baseUrl, semester)));
  }
  return data;
}

async function processSubPage(
  page: Page,
  link: string,
  baseUrl: string,
  semester: string,
): Promise<RawCourse[]> {
  const content = await page.content();
  const $ = load(content);
  const details: RawCourse[] = [];

  await page.goto(new URL(link, baseUrl).toString(), {
    waitUntil: "networkidle2",
  });
  await new Promise((resolve) => setTimeout(resolve, 300));
  const subPageContent = await page.content();
  const subPage$ = load(subPageContent);
  const sublinks = subPage$("a[href]")
    .map((i, link) => $(link).attr("href"))
    .get();
  const subLinkContent = await subPage$("a[href]")
    .map((i, link) => $(link).contents().text())
    .get();

  console.log("共有: ", sublinks.length, "個子系所");

  for (let i = 0; i < sublinks.length; i++) {
    const sublink = sublinks[i];
    console.log("子系所: ", i + 1, "/", sublinks.length);
    console.log(`正在取得 ${subLinkContent[i]} 的課程資料中...`);

    await page.goto(new URL(sublink, baseUrl).toString(), {
      waitUntil: "networkidle2",
    });
    const subSubPageContent = await page.content();
    const subSubPage$ = load(subSubPageContent);
    const trs = subSubPage$("body")
      .find("table")
      .find("tbody")
      .find("tr")
      .slice(2)
      .get();
    trs.pop();

    for (const tr of trs) {
      const tdArray = $(tr)
        .find("td")
        .map((_, td) => $(td).text().trim())
        .get();

      if (
        tdArray[0].trim() === "" ||
        tdArray[0].trim() === "小計" ||
        tdArray[0].trim() === "1: 08:10 - 09:00" ||
        tdArray[0].trim() === "5: 13:10 - 14:00"
      )
        continue;

      const syllabuslink = $(tr)
        .find("td")
        .filter((_, td) => $(td).text().trim().includes("查詢"))
        .map((_, td) => $(td).find("a").attr("href"))
        .get();

      let syllabus = {};
      if (syllabuslink[0]) {
        syllabus = await fetchCourseSyllabus(page, syllabuslink[0], baseUrl);
      }

      details.push({
        code: tdArray[0],
        name: tdArray[1],
        phase: tdArray[2] ? Number(tdArray[2] as string) : 0,
        credit: Number(tdArray[3] as string),
        studentQuota: Number(tdArray[15] as string),
        syllabus: tdArray[18],
        progress: tdArray[18],
        grading: tdArray[18],
        textbook: tdArray[18],
        isEnglishTaught: tdArray[17].includes("英語"),
        teacherName: tdArray[6] ? (tdArray[6] as string).split("\n")[0] : "",
        schedule: [
          tdArray[8]
            .split(" ")
            .filter((x) => x !== "")
            .map((x) => x.trim()),
          tdArray[9]
            .split(" ")
            .filter((x) => x !== "")
            .map((x) => x.trim()),
          tdArray[10]
            .split(" ")
            .filter((x) => x !== "")
            .map((x) => x.trim()),
          tdArray[11]
            .split(" ")
            .filter((x) => x !== "")
            .map((x) => x.trim()),
          tdArray[12]
            .split(" ")
            .filter((x) => x !== "")
            .map((x) => x.trim()),
          tdArray[13]
            .split(" ")
            .filter((x) => x !== "")
            .map((x) => x.trim()),
          tdArray[7]
            .split(" ")
            .filter((x) => x !== "")
            .map((x) => x.trim()),
        ],
        classroom: tdArray[14],
        note: tdArray[19],
        note2: tdArray[19],
        departmentName: subLinkContent[i],
        semester,
        ...syllabus,
      });
    }
  }

  return details;
}

async function fetchCourseSyllabus(page: Page, link: string, baseUrl: string) {
  await page.goto(new URL(link, baseUrl).toString(), {
    waitUntil: "networkidle2",
  });
  const content = await page.content();
  const $ = load(content);
  const secondTable = $("table").eq(1); // eq(1) 用於選取第二個 table
  const courseDetail: {
    syllabus?: string;
    progress?: string;
    grading?: string;
    textbook?: string;
    note?: string;
  } = {};

  secondTable.find("tr").each((_, tr) => {
    const title = $(tr).find("th").text().trim();
    const content = $(tr).find("textarea").text().trim();
    switch (title) {
      case "課程大綱":
        courseDetail["syllabus"] = content;
        break;
      case "課程進度":
        courseDetail["progress"] = content;
        break;
      case "評量方式與標準":
        courseDetail["grading"] = content;
        break;
      case "使用教材、參考書目或其他":
        courseDetail["textbook"] = content;
        break;
      case "備註":
        courseDetail["note"] = content;
        break;
      default:
        break;
    }
  });
  return courseDetail;
}

function removeDeplicateCodeCourses(data: RawCourse[]) {
  const codeSet = new Set();
  const newData = [];
  for (const course of data) {
    if (!codeSet.has(course.code)) {
      codeSet.add(course.code);
      newData.push(course);
    }
  }
  return newData;
}

function saveDataToFile(data: RawCourse[], year: string, semester: string) {
  const jsonFileName = `./src/data/courses-${year}-${semester}.json`;
  fs.writeFileSync(jsonFileName, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const year = searchParams.get("year");
  const semester = searchParams.get("semester");
  if (!year || !semester) {
    return Response.json({ error: "Missing year or semester" });
  }
  const data = await fetchCourseData(year as string, semester as string).catch(
    (e) => {
      console.log(e);
      return [];
    },
  );

  return Response.json(data);
}
