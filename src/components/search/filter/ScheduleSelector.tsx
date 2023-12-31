"use client";

import {
  Button,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Dialog,
} from "@/components/material-tailwind";
import { useEffect, useState } from "react";
import { useUpdateSearchParams } from "@/hooks/useUpdateSearchParams";
import { useSearchParams } from "next/navigation";
import { useQueryParams } from "@/hooks/useQueryParams";

export default function ScheduleSelector() {
  const [open, setOpen] = useState(false);
  const queryParams = useQueryParams();

  const handleOpen = () => setOpen(!open);

  return (
    <>
      <Button
        onClick={handleOpen}
        size="sm"
        variant="gradient"
        placeholder={undefined}
      >
        課程時段篩選{" "}
        {queryParams.schedule
          .split(",")
          .filter((schedule) => schedule.length > 0).length > 0
          ? `已選：${
              queryParams.schedule
                .split(",")
                .filter((schedule) => schedule.length > 0).length
            }`
          : null}
      </Button>
      <Dialog open={open} handler={handleOpen} placeholder={undefined}>
        <DialogHeader placeholder={undefined}>
          <h4 className="text-xl font-bold">課程時段篩選</h4>
        </DialogHeader>
        <DialogBody placeholder={undefined}>
          <TimeSelectTable />
        </DialogBody>
        <DialogFooter placeholder={undefined}>
          <Button
            variant="gradient"
            color="green"
            onClick={handleOpen}
            placeholder={undefined}
          >
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

type Cell = {
  interval: number;
  day: number;
};

const intervalMap = [
  { viewText: "1", paramText: "1" },
  { viewText: "2", paramText: "2" },
  { viewText: "3", paramText: "3" },
  { viewText: "4", paramText: "4" },
  { viewText: "5", paramText: "5" },
  { viewText: "6", paramText: "6" },
  { viewText: "7", paramText: "7" },
  { viewText: "8", paramText: "8" },
  { viewText: "9", paramText: "9" },
  { viewText: "A", paramText: "A" },
  { viewText: "B", paramText: "B" },
  { viewText: "C", paramText: "C" },
  { viewText: "D", paramText: "D" },
  { viewText: "E", paramText: "E" },
];

const cell2tValue = ({ interval, day }: Cell): string =>
  `${day}${intervalMap[interval].paramText}`;

function TimeSelectTable() {
  const [hovered, setHovered] = useState<Cell | null>(null);
  const [clicked, setClicked] = useState<Cell | null>(null);
  const updateSearchParams = useUpdateSearchParams();
  const searchParams = useSearchParams();
  const [tValue, setTValue] = useState([""]);

  const selected = new Set<string>(tValue);
  const isAdd = clicked && !selected.has(cell2tValue(clicked));

  useEffect(() => {
    const schedule = searchParams.get("schedule");
    if (schedule) setTValue(schedule.split(","));
    else setTValue([""]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toBeSelect = ({ interval, day }: Cell) => {
    if (!clicked || !hovered) return false;
    if (
      ((clicked.interval <= interval && interval <= hovered.interval) ||
        (clicked.interval >= interval && interval >= hovered.interval)) &&
      ((clicked.day <= day && day <= hovered.day) ||
        (clicked.day >= day && day >= hovered.day))
    )
      return true;
    return false;
  };

  const select = (start: Cell | null, end: Cell | null) => {
    if (!start || !end) return;
    setClicked(null);
    const [minDate, maxDate] = [
      Math.min(start.interval, end.interval),
      Math.max(start.interval, end.interval),
    ];
    const [minTime, maxTime] = [
      Math.min(start.day, end.day),
      Math.max(start.day, end.day),
    ];
    for (let interval = minDate; interval <= maxDate; interval++) {
      for (let day = minTime; day <= maxTime; day++) {
        const param = cell2tValue({ interval, day });
        if (isAdd) selected.add(param);
        else selected.delete(param);
      }
    }
    const nextTValue = Array.from(selected).sort();
    setTValue(nextTValue);
    updateSearchParams({
      schedule: nextTValue.join(","),
    });
  };

  const getBackgroundColor = ({ interval, day }: Cell) => {
    if (!isAdd && toBeSelect({ interval, day })) return "#d32f2f29";
    if (isAdd && toBeSelect({ interval, day })) return "#0d40c329";
    if (selected.has(cell2tValue({ interval, day }))) return "#0d40c314";
    return "transparent";
  };

  // if is mobile, return null
  if (navigator.maxTouchPoints > 0) return null;

  return (
    <div className="flex-grow overflow-visible">
      <table className="h-full w-full border-separate border-spacing-0 cursor-cell select-none">
        <thead>
          <tr>
            {"一二三四五六日".split("").map((day, i) => (
              <th
                key={i}
                className="h-10 w-10 pb-[0.2rem] text-[0.875rem] font-normal"
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 14 }).map((_, i) => (
            <tr key={i}>
              {Array.from({ length: 7 }).map((_, j) => (
                <td
                  key={j}
                  className="h-10 w-10 touch-none border-[1px] p-0 text-center text-sm font-semibold text-[#66666630]"
                  style={{
                    backgroundColor: getBackgroundColor({
                      interval: i,
                      day: j,
                    }),
                  }}
                  data-day={j}
                  data-interval={i}
                  onMouseEnter={() => setHovered({ interval: i, day: j })}
                  onMouseDown={() => setClicked({ interval: i, day: j })}
                  onMouseUp={() => select(clicked, hovered)}
                  onTouchStart={() => setClicked({ interval: i, day: j })}
                  onTouchEnd={() => {
                    select(clicked, hovered);
                    setHovered(null);
                  }}
                  onTouchMove={(e) => {
                    const target = document.elementFromPoint(
                      e.touches[0].clientX,
                      e.touches[0].clientY,
                    );
                    if (target instanceof HTMLTableCellElement) {
                      setHovered({
                        interval: Number(target.dataset.interval),
                        day: Number(target.dataset.day),
                      });
                    }
                  }}
                >
                  {intervalMap[i].viewText}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
