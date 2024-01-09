package repository

import (
	"context"
	"github.com/jackc/pgx/v5/pgxpool"
	"time"
)

type PlannedMealRepository struct {
	dbPool *pgxpool.Pool
}

func NewPlannedMealRepository(dbPool *pgxpool.Pool) PlannedMealRepository {
	return PlannedMealRepository{
		dbPool: dbPool,
	}
}

type PlannedMeal struct {
	Id   int       `json:"id"`
	Date time.Time `json:"date"`
	Meal Meal      `json:"meal"`
}

func (pmr *PlannedMealRepository) GetPlannedMeals(ctx context.Context, userId string, fromDate time.Time, toDate time.Time) ([]PlannedMeal, error) {

	sql := `SELECT pm.id, pm.date, m.id, m.name, m.created_date, m.created_by, m.modified_date, m.modified_by FROM public.planned_meal pm
                                  INNER JOIN public.meal m on m.id = pm.meal_id
                                  WHERE pm.user_id = $1 AND pm.date >= $2 AND pm.date <= $3`
	rows, err := pmr.dbPool.Query(ctx, sql, userId, fromDate.Format(time.DateOnly), toDate.Format(time.DateOnly))
	if err != nil {
		println(err.Error())
		return nil, err
	}

	var plannedMeals []PlannedMeal
	for rows.Next() {
		var plannedMeal PlannedMeal
		var meal Meal
		if err := rows.Scan(
			&plannedMeal.Id,
			&plannedMeal.Date,
			&meal.Id,
			&meal.Name,
			&meal.CreatedDate,
			&meal.CreatedBy,
			&meal.ModifiedDate,
			&meal.ModifiedBy,
		); err != nil {
			panic(err)
		}

		plannedMeal.Meal = meal
		plannedMeals = append(plannedMeals, plannedMeal)
	}

	return plannedMeals, err
}

func (pmr *PlannedMealRepository) NewPlannedMeal(ctx context.Context, userId string, date time.Time, mealId string) error {
	sql := "INSERT INTO public.planned_meal(meal_id, user_id, date) VALUES($1,$2,$3)"
	if _, err := pmr.dbPool.Exec(ctx, sql, mealId, userId, date.Format(time.DateOnly)); err != nil {
		println(err)
		return err
	}
	return nil
}
