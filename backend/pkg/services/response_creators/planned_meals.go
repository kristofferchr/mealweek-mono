package response_creators

import (
	mealsv1 "github.com/kris456/mealweek-go-backend/gen/proto/meals/v1"
	"github.com/kris456/mealweek-go-backend/pkg/repository"
	"google.golang.org/protobuf/types/known/timestamppb"
)

func PlannedMeals(plannedMeals []repository.PlannedMeal) []*mealsv1.PlannedMeal {
	var pbPlannedMeals []*mealsv1.PlannedMeal
	for _, plannedMeal := range plannedMeals {
		pbPlannedMeals = append(pbPlannedMeals, PlannedMeal(plannedMeal))
	}

	return pbPlannedMeals
}

func PlannedMeal(plannedMeal repository.PlannedMeal) *mealsv1.PlannedMeal {
	return &mealsv1.PlannedMeal{
		Id:   int64(plannedMeal.Id),
		Date: timestamppb.New(plannedMeal.Date),
		Meal: Meal(plannedMeal.Meal),
	}
}
