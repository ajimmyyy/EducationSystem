import {
  Stepper,
  Step,
  Button,
  Dialog,
  DialogHeader,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Checkbox,
} from "@material-tailwind/react";
import apiFetcher from "@/utils/api-fetcher";
import { useState } from "react";
import React from "react";

// interface HeadProps {
//   value: string;
//   type: string;
// }

interface AddInfoButtonProps {
  inputInfos: {};
  setNeedUpdate: React.Dispatch<React.SetStateAction<boolean>>;
}

interface IntervalData {
  weekday: number;
  classroomId: number;
  intervals: string[];
}

const schedule = [
  { label: "Sun", value: 0 },
  { label: "Mon", value: 1 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
  { label: "Thur", value: 4 },
  { label: "Fri", value: 5 },
  { label: "Sat", value: 6 },
];

const interval = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "A",
  "B",
  "C",
  "D",
];

function AddCourseStep({ inputInfos, setNeedUpdate }: AddInfoButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEnglish, setIsEnglish] = useState(false);
  const [selectedIntervals, setSelectedIntervals] = useState<IntervalData[]>(
    [],
  );
  const [classroomId, setClassroomId] = useState<number>(0);

  const [activeStep, setActiveStep] = React.useState(0);
  const [isLastStep, setIsLastStep] = React.useState(false);
  const [isFirstStep, setIsFirstStep] = React.useState(false);
  const [activeTab, setActiveTab] = useState<number>(0);

  const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);
  const handleNext = () => {
    if (isLastStep) {
      handleAddData();
    } else {
      setActiveStep((cur) => cur + 1);
    }
  };

  const handleDialogOpen = () => {
    setDialogOpen(!dialogOpen);
  };

  const handleClassroomIdChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setClassroomId(parseInt(event.target.value, 10));
  };

  const handleCheckboxChange = (weekday: number, selectedInterval: string) => {
    const existingEntryIndex = selectedIntervals.findIndex(
      (entry) => entry.weekday === weekday,
    );

    if (existingEntryIndex !== -1) {
      const existingIntervals = selectedIntervals[existingEntryIndex].intervals;

      const updatedIntervals = existingIntervals.includes(selectedInterval)
        ? existingIntervals.filter((interval) => interval !== selectedInterval)
        : [...existingIntervals, selectedInterval];

      const updatedEntry = {
        ...selectedIntervals[existingEntryIndex],
        intervals: updatedIntervals,
        classroomId: classroomId,
      };

      const updatedIntervalsArray = [...selectedIntervals];
      updatedIntervalsArray[existingEntryIndex] = updatedEntry;
      setSelectedIntervals(updatedIntervalsArray);
    } else {
      setSelectedIntervals((prevIntervals) => [
        ...prevIntervals,
        { weekday, classroomId: classroomId, intervals: [selectedInterval] },
      ]);
    }
  };

  function AddCourseLanguage() {
    return (
      <div>
        <DialogHeader placeholder>可選</DialogHeader>
        <Checkbox
          crossOrigin
          checked={isEnglish}
          onChange={() => {
            setIsEnglish(!isEnglish);
          }}
          label="Is Enghish Taught?"
        />
      </div>
    );
  }

  function AddCourseTime() {
    return (
      <div>
        <Tabs value={activeTab}>
          <TabsHeader placeholder className="mt-2">
            {schedule.map(({ label, value }) => (
              <Tab
                placeholder
                key={value}
                value={value}
                onClick={() => {
                  setActiveTab(value);
                  setClassroomId(0);
                }}
              >
                {label}
              </Tab>
            ))}
          </TabsHeader>
          <TabsBody placeholder>
            {schedule.map(({ value: weekday }) => (
              <TabPanel key={weekday} value={weekday}>
                <div>
                  Classroom ID:
                  <input
                    type="number"
                    value={classroomId}
                    onChange={handleClassroomIdChange}
                    min="0"
                    style={{ textAlign: "right" }}
                  />
                </div>

                {interval.map((time) => (
                  <Checkbox
                    key={time}
                    crossOrigin
                    label={time}
                    checked={
                      selectedIntervals
                        .find((entry) => entry.weekday === weekday)
                        ?.intervals.includes(time) ?? false
                    }
                    onChange={() => handleCheckboxChange(weekday, time)}
                  />
                ))}
              </TabPanel>
            ))}
            <div>
              {schedule.map(({ value: weekday }) => (
                <div key={weekday}>
                  {schedule.find((entry) => entry.value === weekday)?.label}:{" "}
                  {selectedIntervals
                    .find((entry) => entry.weekday === weekday)
                    ?.intervals.join(", ")}
                  {" / "}
                  {
                    selectedIntervals.find((entry) => entry.weekday === weekday)
                      ?.classroomId
                  }
                </div>
              ))}
            </div>
          </TabsBody>
        </Tabs>
      </div>
    );
  }

  const handleAddData = () => {
    const fetch = async () => {
      const filteredInputInfos = Object.fromEntries(
        // eslint-disable-next-line no-unused-vars
        Object.entries(inputInfos).filter(([key, value]) => value !== ""),
      );
      const filteredIntervals = selectedIntervals.filter(
        (entry) => entry.intervals.length > 0,
      );

      console.log(filteredInputInfos);
      console.log(isEnglish);
      console.log(filteredIntervals);

      const response = await apiFetcher("/api/ManageCourse", {
        method: "POST",
        body: {
          ...filteredInputInfos,
          isEnglishTaught: isEnglish,
          schedules: filteredIntervals,
        },
      });
      setNeedUpdate(true);

      console.log(response);
    };
    fetch();
    setDialogOpen(false);
  };

  const renderTableBasedOnOption = () => {
    switch (activeStep) {
      case 0:
        return <AddCourseLanguage />;
      case 1:
        return <AddCourseTime />;
      default:
        return;
    }
  };

  return (
    <>
      <Button
        placeholder
        variant="gradient"
        color="green"
        onClick={handleDialogOpen}
      >
        <span>Confirm</span>
      </Button>
      <Dialog placeholder open={dialogOpen} handler={handleDialogOpen}>
        <div className="w-full px-8 py-4">
          <Stepper
            placeholder
            activeStep={activeStep}
            isLastStep={(value) => setIsLastStep(value)}
            isFirstStep={(value) => setIsFirstStep(value)}
          >
            <Step placeholder onClick={() => setActiveStep(0)}>
              1
            </Step>
            <Step placeholder onClick={() => setActiveStep(1)}>
              2
            </Step>
          </Stepper>
          {renderTableBasedOnOption()}
          <div className="mt-16 flex justify-between">
            <Button placeholder onClick={handlePrev} disabled={isFirstStep}>
              Prev
            </Button>
            <Button placeholder onClick={handleNext}>
              Next
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}

export default AddCourseStep;
