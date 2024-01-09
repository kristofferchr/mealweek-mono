package response_creators

import (
	mealsv1 "github.com/kris456/mealweek-go-backend/gen/proto/meals/v1"
	"github.com/kris456/mealweek-go-backend/pkg/repository"
)

func Meals(meals []repository.Meal) []*mealsv1.Meal {
	var pbMeals []*mealsv1.Meal
	for _, meal := range meals {
		pbMeals = append(pbMeals, Meal(meal))
	}

	return pbMeals
}

func Meal(meal repository.Meal) *mealsv1.Meal {
	return &mealsv1.Meal{
		Id:        int64(meal.Id),
		Name:      meal.Name,
		CreatedBy: meal.CreatedBy,
	}
}
