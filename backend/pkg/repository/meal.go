package repository

import (
	"context"
	"fmt"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/pkg/errors"
	"os"
)

type MealRepository struct {
	dbPool *pgxpool.Pool
}

func NewMealRepository(dbPool *pgxpool.Pool) MealRepository {
	return MealRepository{
		dbPool: dbPool,
	}
}

func (mr *MealRepository) GetMeals(ctx context.Context, userId string) ([]Meal, error) {
	ros, err := mr.dbPool.Query(ctx, "SELECT * FROM public.meal WHERE created_by=$1", userId)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Failed sql: %v\n", err)
		return nil, err
	}
	defer ros.Close()

	var meals []Meal
	for ros.Next() {
		var meal Meal
		if err := ros.Scan(&meal.Id, &meal.Name, &meal.CreatedDate, &meal.CreatedBy, &meal.ModifiedDate, &meal.ModifiedBy); err != nil {
			panic(err)
		}

		meals = append(meals, meal)
	}

	if err != nil {
		return nil, err
	}

	return meals, nil
}

func (mr *MealRepository) DeleteMeal(ctx context.Context, name string, userId string) error {
	res, err := mr.dbPool.Exec(ctx, "DELETE FROM public.meal WHERE name=$1 AND created_by=$2;", name, userId)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Failed sql: %v\n", err)
		return err
	}

	rowsAffected := res.RowsAffected()

	if rowsAffected != 1 {
		return errors.New("Expected to delete meal, but did not")
	}

	return nil
}
func (mr *MealRepository) NewMeal(ctx context.Context, name string, userId string) error {
	println(fmt.Sprintf("Creating new meal %s", name))
	res, err := mr.dbPool.Exec(ctx, "INSERT INTO public.meal (name, created_by) VALUES($1,$2);", name, userId)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Failed sql: %v\n", err)
		return err
	}

	rowsAffected := res.RowsAffected()

	// TODO: what about duplicates
	if rowsAffected != 1 {
		return errors.New("Expected to insert new meal, but did not")
	}

	return nil
}

type Meal struct {
	Id           int     `json:"id"`
	Name         string  `json:"name"`
	CreatedBy    string  `json:"created_by"`
	CreatedDate  *string `json:"created_date,omitempty"`
	ModifiedBy   *string `json:"modified_by,omitempty"`
	ModifiedDate *string `json:"modified_date,omitempty"`
}
