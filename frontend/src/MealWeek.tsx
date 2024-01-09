import React, {useEffect, useRef, useState} from "react";
import {Button, Container, Grid, TextField} from "@mui/material";
import "./App.css";
import Week from "./Components/Week";
import WeekSelector from "./Components/WeekSelector";
import dayjs, {Dayjs} from "dayjs";

import isoWeek from "dayjs/plugin/isoWeek";
import isLeapYear from "dayjs/plugin/isLeapYear";
import isoWeekInYear from "dayjs/plugin/isoWeeksInYear";
import Meals from "./Components/Meals";
import SaveIcon from '@mui/icons-material/Save';
import {useClient} from "./hooks/useClient";
import {meal} from "../gen/proto/meals/v1/meals";

dayjs.extend(isoWeek);
dayjs.extend(isLeapYear);
dayjs.extend(isoWeekInYear);

export interface DayAndMeal {
    id: bigint | undefined;
    day: Dayjs;
    meal: meal | undefined;
    altered: boolean;
}

const MealWeek = () => {
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [enteredMeal, setEnteredMeal] = useState('');
    const [weekDaysWithMeals, setWeekDaysWithMeals] = useState<DayAndMeal[]>([])
    const [clickedMeal, setClickedMeal] = useState<meal | undefined>(undefined)
    const [shouldRefetchMeals, setShouldRefetchMeals] = useState<boolean>(false)
    const prevSelectedDateRef = useRef<Dayjs>(selectedDate);
    const [selectedWeek, setSelectedWeek] = useState(selectedDate.isoWeek())
    const [hasChangedPlannedMeals, setHasChangedPlannedMeals] = useState(false)

    const [
        addNewMeal,
        ,
        addNewMealResponse,
        resetAddNewMeal,
    ] = useClient('grpcAddNewMeal');

    const [
        getPlannedMeals,
        ,
        getPlannedMealsResponse
        ,
    ] = useClient('grpcGetPlannedMeals');
    const [
        storePlannedMeal,
        ,
        storePlannedMealResponse
        ,
    ] = useClient('grpcNewPlannedMeal');

    useEffect(() => {
        const monday = selectedDate.isoWeekday(1)
        const sunday = selectedDate.isoWeekday(7)

        getPlannedMeals(monday, sunday)
    }, [getPlannedMeals, selectedWeek])

    useEffect(() => {
        setSelectedWeek(selectedDate.isoWeek())
    }, [selectedDate]);

    useEffect(() => {
        if (getPlannedMealsResponse?.data && getPlannedMealsResponse.data.plannedMeals.length > 0) {
            const copyOfWeekDaysWithMeals: DayAndMeal[] = weekDaysWithMeals.map(item => ({...item}))
            getPlannedMealsResponse.data.plannedMeals
                .filter((plannedMeal) =>{
                    const date = new Date(Number(plannedMeal.date?.seconds) * 1000)

                    return dayjs(date).isoWeek() == selectedDate.isoWeek()
                }
                )
                .forEach((plannedMeal) => {
                    const date = new Date(Number(plannedMeal.date?.seconds) * 1000)
                    const isoWeekDay = dayjs(date).isoWeekday()
                    const weekDayWithMeal = copyOfWeekDaysWithMeals[isoWeekDay - 1]
                    weekDayWithMeal.meal = plannedMeal.meal
                    weekDayWithMeal.id = plannedMeal.id
                    copyOfWeekDaysWithMeals[isoWeekDay - 1] = weekDayWithMeal
                })
            setWeekDaysWithMeals(copyOfWeekDaysWithMeals)
        }
    }, [getPlannedMealsResponse])

    const handleNewEnteredMeal = () => {
        addNewMeal(enteredMeal)
        setEnteredMeal("")
    };

    useEffect(() => {
        if (addNewMealResponse) {
            resetAddNewMeal()
            setShouldRefetchMeals(true)
        }
    }, [addNewMealResponse, resetAddNewMeal])

    useEffect(() => {
        if (selectedDate == prevSelectedDateRef.current || selectedDate.isoWeek() != prevSelectedDateRef.current.isoWeek() || selectedDate.year() != prevSelectedDateRef.current.year()) {
            const tempArray: DayAndMeal[] = []

            for (let i = 0; i < 7; i++) {
                const weekDay = selectedDate.isoWeekday(i + 1)
                tempArray[i] = {
                    id: undefined,
                    day: weekDay,
                    meal: undefined,
                    altered: false
                }
            }

            setWeekDaysWithMeals(tempArray)
        }

        prevSelectedDateRef.current = selectedDate
    }, [selectedDate])

    useEffect(() => {
        if (clickedMeal) {
            const tempArray = weekDaysWithMeals.map((item)=> ({...item}))

            const selectedDayWithMeal = tempArray.find((dayWithMeal) => {
                return dayWithMeal.day.isSame(selectedDate)
            })

            if (selectedDayWithMeal) {
                const index = tempArray.indexOf(selectedDayWithMeal)

                selectedDayWithMeal.meal = clickedMeal
                selectedDayWithMeal.altered = true
                tempArray[index] = selectedDayWithMeal
                setWeekDaysWithMeals(tempArray)
            }
            setClickedMeal(undefined)
        }
    }, [clickedMeal, selectedDate, weekDaysWithMeals])

    useEffect(() => {
        const hasAnyPlannedMealsBeenAltered = weekDaysWithMeals.filter((item) => {
            return item.altered
        }).length > 0

        setHasChangedPlannedMeals(hasAnyPlannedMealsBeenAltered)
    }, [weekDaysWithMeals]);

    const storePlannedMeals = () => {
        weekDaysWithMeals.filter((item) => item.altered)
            .forEach((item) => {
                storePlannedMeal(item.meal?.id!!, item.day)
            })
    }

    return (
        <div className="App">
            <Container>
                <Grid container justifyContent="center">
                    <Grid container justifyContent={"center"} xs={12}>
                        <WeekSelector
                            setSelectedDate={setSelectedDate}
                            selectedDate={selectedDate}
                        />
                    </Grid>
                    <Grid
                        container
                        paddingTop={"20px"}
                        textAlign={"center"}
                        justifyContent={"center"}
                        xs={12}
                    >
                        <Week selectedDate={selectedDate} setSelectedDate={setSelectedDate}
                              weekDaysWithMeals={weekDaysWithMeals}/>
                    </Grid>
                    <Meals setClickedMeal={setClickedMeal} reFetchMeals={shouldRefetchMeals} resetFetchMeals={() => {
                        setShouldRefetchMeals(false)
                    }}/>
                    <Grid
                        container
                        marginTop={"50px"}
                        justifyContent={'center'}
                        xs={12}
                    >
                        <Grid item xs={8}>
                            <TextField
                                label={"Forenklet tillegging av måltider"}
                                fullWidth
                                autoFocus
                                onKeyDown={(e) => e.key === "Enter" && handleNewEnteredMeal()}
                                value={enteredMeal}
                                onChange={(e) => setEnteredMeal(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <Button onClick={handleNewEnteredMeal}>Legg til</Button>
                        </Grid>
                    </Grid>
                    <Grid
                        container
                        marginTop={"50px"}
                        justifyContent={'center'}
                        xs={12}
                    >
                        <Grid item xs={8}>
                            <Button variant="contained" size="large" disabled={!hasChangedPlannedMeals} onClick={() => storePlannedMeals()} endIcon={<SaveIcon/>}>Lagre
                                meny</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};
export default MealWeek;



