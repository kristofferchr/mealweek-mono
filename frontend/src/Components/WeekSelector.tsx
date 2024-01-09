import { Button, Grid } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import React, { useState } from "react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import isLeapYear from "dayjs/plugin/isLeapYear";
import isoWeekInYear from "dayjs/plugin/isoWeeksInYear";

dayjs.extend(isoWeek);
dayjs.extend(isLeapYear);
dayjs.extend(isoWeekInYear);

interface Props {
  setSelectedDate: (date: dayjs.Dayjs) => void
  selectedDate: dayjs.Dayjs
}
const WeekSelector = ({
  setSelectedDate,
  selectedDate
}: Props) => {
  const decrementWeekNumber = () => {
    const newDate = selectedDate.subtract(1, 'week')
    setSelectedDate(newDate)
  };

  const incrementWeekNumber = () => {
    const newDate = selectedDate.add(1, 'week')
    setSelectedDate(newDate)
  };

  return (
    <>
      <Grid item textAlign={"center"} xs={12}>
        <h2>År {selectedDate.year()}</h2>
      </Grid>
      <Grid item textAlign={"right"} xs={3}>
        <Button
          variant={"text"}
          className={"arrow"}
          startIcon={<ArrowBackIosIcon />}
          onClick={decrementWeekNumber}
        >
          Forrige uke
        </Button>
      </Grid>
      <Grid item xs={3}>
        <h2 style={{ textAlign: "center" }}>Ukeplan for uke {selectedDate.isoWeek()}</h2>
      </Grid>
      <Grid textAlign={"left"} item xs={3}>
        <Button
          variant={"text"}
          className={"arrow"}
          endIcon={<ArrowForwardIosIcon />}
          onClick={incrementWeekNumber}
        >
          Neste uke
        </Button>
      </Grid>
    </>
  );
};
export default WeekSelector;
