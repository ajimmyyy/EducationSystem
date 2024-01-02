import { ChatOption } from "@/app/api/llm/route";
import {
  Card,
  CardBody,
  Collapse,
  IconButton,
  Input,
} from "@/components/material-tailwind";
import { FullCourse } from "@/services/courseService";
import apiFetcher from "@/utils/api-fetcher";
import { useState } from "react";
import { MdModeComment } from "react-icons/md";
import { PiStarFourFill } from "react-icons/pi";

const systemPromptRoot = `
你是台灣台北科技大學的選課小幫手，任何人可以向你敘述任何他們想修的課程，你擁有以下兩個操作：
搜尋關鍵字以及聊天
如果你想要搜尋關鍵字好協助使用者找到他們想修的課程，請直接說出 『搜尋關鍵字：XXX』
程序便會將關鍵字 XXX （包含課號、課名、教師名稱）搜尋完畢的結果傳送給你，你可以將結果傳送給使用者
另外搜尋系統很笨，並不像 google 搜尋
如果使用者想查找資工相關的課程，你必須要說出『搜尋關鍵字：資料庫 線性代數 程式 ...』
等等直接與課名相關的關鍵字
如果你想要與使用者聊天，則直接對話幾可，不需要其他操作，另外對答可以使用 html 格式進行回應，請限制在 100 字以內
`;

const systemPromptWithCourseCanResearch = (courses: FullCourse[]) => `
你是台灣台北科技大學的選課小幫手，任何人可以向你敘述任何他們想修的課程，在剛剛的對話中，你已經搜尋到了使用者想要的課程
以下是課程列表，你可以分析後，將數筆課程傳送給使用者，建議限制在 5 筆以內
任何課程的推薦都只能從以下的課程列表中選擇，禁止出現列表外的課程
以下是課程列表：
${courses
  .map(
    (course) => `
課程名稱：${course.name}
課程連結：/course/${course.id}
課程教師：${course.teacher?.user.name}
課程大綱：${course.syllabus?.slice(0, 100)}...
`,
  )
  .join("\n")}

再次強調，任何課程的推薦都只能從以上的課程列表中選擇，禁止出現列表外的課程
如果想要搜尋其他課程，請再次說出 『搜尋關鍵字：XXX』
如果想要與使用者聊天，則直接對話幾可，不需要其他操作
另外對答可以使用 html 格式進行回應，請限制在 100 字以內，如果要給予課程列表，建議附上連結(<a href="課程連結">課程名稱</a>)

以下是該使用者的對話紀錄：
`;

const systemPromptWithCourse = (courses: FullCourse[]) => `
你是台灣台北科技大學的選課小幫手，任何人可以向你敘述任何他們想修的課程，在剛剛的對話中，你已經搜尋到了使用者想要的課程
以下是課程列表，你可以分析後，將數筆課程傳送給使用者，建議限制在 5 筆以內
任何課程的推薦都只能從以下的課程列表中選擇，禁止出現列表外的課程
以下是課程列表：
${courses
  .map(
    (course) => `
課程名稱：${course.name}
課程連結：/course/${course.id}
課程教師：${course.teacher?.user.name}
課程大綱：${course.syllabus?.slice(0, 100)}...
`,
  )
  .join("\n")}
再次強調，任何課程的推薦都只能從以上的課程列表中選擇，禁止出現列表外的課程
另外對答可以使用 html 格式進行回應，請限制在 100 字以內，如果要給予課程列表，建議附上連結(<a href="課程連結">課程名稱</a>)

以下是該使用者的對話紀錄：
`;

const fetchLLMChat = async (chatOption: ChatOption) => {
  const data = await apiFetcher(`/api/llm`, {
    method: "POST",
    body: {
      context: chatOption.context,
      model: chatOption.model,
      message: chatOption.message,
    },
  });
  const { success } = data;

  if (!success) return null;

  return data;
};

async function chat(userInput: string, time = 0) {
  console.log("chat", userInput, time);
  const data = await fetchLLMChat({
    context: systemPromptRoot,
    model: "gpt-4-1106-preview",
    message: userInput,
  });
  console.log("chat1", data);

  if (!data) return "嗚嗚，我不知道該如何回應";

  const { response } = data;

  if (response.includes("搜尋關鍵字")) {
    const keyword = response.split("搜尋關鍵字：")[1];
    console.log("keyword", keyword);
    const courses = await apiFetcher(`/api/course/search`, {
      method: "POST",
      body: {
        keyword,
        semester: "112-2",
        schedule: "",
        departments: "",
        page: 0,
        perPage: 4,
      },
    });
    console.log("courses", courses);

    console.log(
      "systemPromptWithCourse",
      systemPromptWithCourse(courses.courses),
    );

    const newResponse = await fetchLLMChat({
      context:
        time !== 3
          ? systemPromptWithCourseCanResearch(courses.courses)
          : systemPromptWithCourse(courses.courses),
      model: "gpt-4-1106-preview",
      message: userInput,
    });
    console.log("newResponse", newResponse);
    if (!newResponse) return "嗚嗚，我不知道該如何回應";

    if (newResponse.response.includes("搜尋關鍵字")) {
      if (time > 3) return "嗚嗚，我不知道該如何回應";
      return chat(userInput, time + 1);
    }

    return newResponse.response;
  }

  return response;
}

function LLMAvatar({ size }: { size: "md" | "lg" }) {
  return (
    <div className=" relative flex">
      <span className={size === "lg" ? "text-3xl" : "text-xl"}>
        <PiStarFourFill />
      </span>
      <span className={size === "lg" ? "text-sm" : "text-xs"}>
        <PiStarFourFill />
      </span>
    </div>
  );
}

export default function LlmAssistant() {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen((cur) => !cur);

  const [userInput, setUserInput] = useState("");
  const [isInputing, setIsInputing] = useState(false);

  const [chatHistory, setChatHistory] = useState<
    {
      message: string;
      name: string;
    }[]
  >([
    {
      message: `Hello,
我是你的選課小幫手，你可以向我敘述任何你想修的課程，我會盡可能的幫你找到你想修的課程。

你也可以與我聊天，談談你的選課經驗。`,
      name: "課程助手",
    },
  ]);

  const handleSend = async () => {
    setChatHistory((cur) => [
      ...cur,
      {
        message: userInput,
        name: "你",
      },
    ]);
    setIsInputing(true);
    setUserInput("");
    const response = await chat(userInput);
    setChatHistory((cur) => [
      ...cur,
      {
        message: response,
        name: "課程助手",
      },
    ]);
    setIsInputing(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      <div className=" relative w-72">
        <Collapse open={open}>
          <Card
            placeholder={undefined}
            className="m-4 mx-auto h-[500px] w-full border"
          >
            <CardBody placeholder={undefined} className=" relative p-4">
              <div className=" sticky top-0 flex items-center gap-2">
                <LLMAvatar size="lg" />
                <h4 className="text-xl font-semibold">北科課程好幫手</h4>
              </div>
              <div className=" chat-container flex h-[404px] flex-col gap-2 overflow-y-auto">
                {chatHistory.map((chat, index) => (
                  <div
                    className={
                      "flex flex-col gap-1" +
                      (chat.name === "課程助手" ? " items-start" : " items-end")
                    }
                    key={index}
                  >
                    {chat.name === "課程助手" ? (
                      <p className=" flex items-center gap-1 text-xs text-gray-600">
                        <PiStarFourFill />
                        課程助手
                      </p>
                    ) : (
                      <p className=" flex items-center gap-1 text-xs text-gray-600">
                        你
                      </p>
                    )}
                    <div
                      className=" w-fit whitespace-pre-line rounded-lg bg-gray-100 p-2 text-sm"
                      dangerouslySetInnerHTML={{ __html: chat.message }}
                    ></div>
                  </div>
                ))}
                {isInputing && (
                  <div className=" flex animate-pulse flex-col items-start gap-1 ">
                    <p className=" flex items-center gap-1 text-xs text-gray-600">
                      課程助手
                    </p>
                    <div className=" w-fit whitespace-pre-line rounded-lg bg-gray-100 p-2 text-sm">
                      正在輸入中...
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <div className=" flex-grow">
                  <Input
                    label="在這裡輸入提示"
                    crossOrigin={undefined}
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                  />
                </div>
                <button
                  className=" rounded-lg bg-blue-500 px-2 py-2 text-sm text-white"
                  onClick={handleSend}
                >
                  送出
                </button>
              </div>
            </CardBody>
          </Card>
        </Collapse>
      </div>
      <IconButton
        onClick={toggleOpen}
        placeholder={undefined}
        className="rounded-full"
      >
        <MdModeComment />
      </IconButton>
    </div>
  );
}
