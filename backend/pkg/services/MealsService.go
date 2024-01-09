package services

import (
	"context"
	mealsv12 "github.com/kris456/mealweek-go-backend/gen/proto/meals/v1"
	"github.com/kris456/mealweek-go-backend/pkg/repository"
	"github.com/kris456/mealweek-go-backend/pkg/services/response_creators"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"
	"sync"
)

type MealsService struct {
	mealsv12.MealsServiceServer
	repository.RepositoryManager

	mu sync.Mutex
}

func (m *MealsService) GetMeals(ctx context.Context, req *mealsv12.GetMealsRequest) (*mealsv12.GetMealsResponse, error) {
	md, exists := metadata.FromIncomingContext(ctx)
	if !exists {
		return nil, status.Error(codes.Aborted, "Could not fetch metadata")
	}
	userId := md.Get("userId")[0]
	meals, err := m.MealRepository.GetMeals(context.Background(), userId)
	if err != nil {
		return nil, status.Error(codes.Aborted, "Could not get meals")
	}

	return &mealsv12.GetMealsResponse{Meals: response_creators.Meals(meals)}, nil

}

func (m *MealsService) DeleteMeal(ctx context.Context, req *mealsv12.DeleteMealRequest) (*mealsv12.DeleteMealResponse, error) {
	md, exists := metadata.FromIncomingContext(ctx)
	if !exists {
		return nil, status.Error(codes.Aborted, "Could not find metadata")
	}

	userId := md.Get("userId")[0]

	// TODO: validate name is not empty
	// TODO: Should return newly created meal with id
	err := m.MealRepository.DeleteMeal(context.Background(), req.Name, userId)
	if err != nil {
		return nil, status.Error(codes.Aborted, "Could not delete meal")
	}

	return &mealsv12.DeleteMealResponse{}, nil
}
func (m *MealsService) CreateMeal(ctx context.Context, req *mealsv12.CreateMealRequest) (*mealsv12.CreateMealResponse, error) {
	md, exists := metadata.FromIncomingContext(ctx)
	if !exists {
		return nil, status.Error(codes.Aborted, "Could not find metadata")
	}

	userId := md.Get("userId")[0]

	// TODO: validate name is not empty
	// TODO: Should return newly created meal with id
	err := m.MealRepository.NewMeal(context.Background(), req.Name, userId)
	if err != nil {
		return nil, status.Error(codes.Aborted, "Could not get meals")
	}

	return &mealsv12.CreateMealResponse{
		Meal: &mealsv12.Meal{
			Id:        0,
			Name:      "test",
			CreatedBy: "",
		},
	}, nil
}
