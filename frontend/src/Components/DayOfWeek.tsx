import {Box, Button, Grid, Typography} from "@mui/material";
import React from "react";
import "./DayOfWeek.css";
import dayjs from "dayjs";
import {meal} from "../../gen/proto/meals/v1/meals";

interface Props {
  date: dayjs.Dayjs;
  selectedDate: dayjs.Dayjs;
  setSelectedDate: (date: dayjs.Dayjs) => void;
  meal: meal | undefined;
}

const DayOfWeek = ({ date, selectedDate, setSelectedDate,meal }: Props) => {
  const dateFormatted = date.format("dddd");
  const dayCapitalized = dateFormatted.charAt(0).toUpperCase() + dateFormatted.slice(1);
  return (
    <Grid item xs>
      <Button
        className={`dayOfWeekButton ${
          selectedDate.day() === date.day() ? "selected-day" : ""
        }`}
        fullWidth={true}
        onClick={() => {
          setSelectedDate(date);
        }}
      >
        <Typography variant={"body2"}>
          <Box fontStyle={'italic'}> {date.format("DD.MM")} </Box>
          <Box mb={'5px'} fontWeight={'bold'}> {dayCapitalized} </Box>
          {
            meal?.name ? (
              <Box color={'darkred'}>{meal.name}</Box>
            ) : (
              <Box color={'lightslategray'}>{'ingen'}</Box>
            )
          }
        </Typography>
      </Button>
    </Grid>
  );
};

export default DayOfWeek;
