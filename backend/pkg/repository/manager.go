package repository

import "github.com/jackc/pgx/v5/pgxpool"

type RepositoryManager struct {
	MealRepository        MealRepository
	UserRepository        UserRepository
	PlannedMealRepository PlannedMealRepository
}

func New(dbPool *pgxpool.Pool) RepositoryManager {
	return RepositoryManager{
		MealRepository:        NewMealRepository(dbPool),
		UserRepository:        NewUserRepository(dbPool),
		PlannedMealRepository: NewPlannedMealRepository(dbPool),
	}
}
