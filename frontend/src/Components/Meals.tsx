import { Chip, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useClient } from "../hooks/useClient";
import {meal} from "../../gen/proto/meals/v1/meals";


interface Props {
  setClickedMeal: (meal: meal)=> void;
  reFetchMeals: boolean;
  resetFetchMeals: () => void
}

const Meals = ({setClickedMeal, reFetchMeals, resetFetchMeals}: Props) => {
  const [meals, setMeals] = useState<meal[]>([])
  const [
    getAllMeals,
    ,
    getAllMealsReponse
    ,
  ] = useClient('grpcGetAllMeals');

  useEffect(() => {
    getAllMeals()
  },[getAllMeals])

  useEffect(() => {
    if(reFetchMeals) {
      getAllMeals()
      resetFetchMeals()
    }
  },[getAllMeals, reFetchMeals, resetFetchMeals])

  useEffect(() => {
    const fetchedMeals = getAllMealsReponse?.data
    if(fetchedMeals) {
      setMeals(fetchedMeals.meals)
    }
  }, [getAllMealsReponse])

return (
    <Grid
      style={{ marginTop: "20px" }}
      justifyContent={"flex-start"}
      direction={"row"}
      container
      spacing={3}
      xs={12}
    >
      {meals.map((meal)=>
        (
          <Grid item xs={'auto'}>
            <Chip
              label={meal.name} onClick={() => {
              setClickedMeal(meal)
            }}/>
          </Grid>
        ))}
    </Grid>
)
};

export default Meals;
