import { Divider } from "@mui/material";
import React, { useEffect } from "react";
import DayOfWeek from "./DayOfWeek";
import dayjs, {Dayjs} from "dayjs";
import { useClient } from "../hooks/useClient";
import { DayAndMeal } from "../MealWeek";

interface Props {
  selectedDate: dayjs.Dayjs
  setSelectedDate: (date: dayjs.Dayjs) => void
  weekDaysWithMeals: DayAndMeal[]
}

const Week = ({ selectedDate, setSelectedDate, weekDaysWithMeals }: Props) => {
  const [
    getAllMeals,
    ,
    getAllMealsReponse
    ,
  ] = useClient('grpcGetAllMeals');

  useEffect(() => {
    getAllMeals()
  }, [getAllMeals])

  useEffect(() => {
  }, [getAllMealsReponse])


  return (
    <>
      {weekDaysWithMeals.map((dayAndMeal: DayAndMeal) => {
        const date = dayAndMeal.day
        return (
          <>
            <DayOfWeek
              key={date.locale("nb").format('DD')}
              date={date}
              meal={dayAndMeal.meal}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
            {date.day() !== 0 && <Divider orientation="vertical" flexItem/>}
          </>
        );
      })}
    </>
  );
};

export default Week;
