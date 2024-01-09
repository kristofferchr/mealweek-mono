package services

import (
	"context"
	mealsv12 "github.com/kris456/mealweek-go-backend/gen/proto/meals/v1"
	"github.com/kris456/mealweek-go-backend/pkg/repository"
	"github.com/kris456/mealweek-go-backend/pkg/services/response_creators"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"
	"strconv"
	"sync"
)

type PlannedMealsService struct {
	mealsv12.UnimplementedPlannedMealsserviceServer
	repository.RepositoryManager

	mu sync.Mutex
}

func (m *PlannedMealsService) GetPlannedMeals(ctx context.Context, req *mealsv12.GetPlannedMealsRequest) (*mealsv12.GetPlannedMealsResponse, error) {
	md, exists := metadata.FromIncomingContext(ctx)
	if !exists {
		return nil, status.Error(codes.Aborted, "Could not fetch metadata")
	}
	userId := md.Get("userId")[0]

	to := req.To.AsTime()
	from := req.From.AsTime()

	plannedMeals, err := m.PlannedMealRepository.GetPlannedMeals(context.Background(), userId, from, to)
	println(len(plannedMeals))
	if err != nil {
		return nil, status.Error(codes.Internal, "Could not get planned meals")
	}

	return &mealsv12.GetPlannedMealsResponse{
		PlannedMeals: response_creators.PlannedMeals(plannedMeals),
	}, nil

}

func (m *PlannedMealsService) CreatePlannedMeal(ctx context.Context, req *mealsv12.CreatePlannedMealRequest) (*mealsv12.CreatePlannedMealResponse, error) {
	md, exists := metadata.FromIncomingContext(ctx)
	if !exists {
		return nil, status.Error(codes.Aborted, "Could not find metadata")
	}

	userId := md.Get("userId")[0]
	println(req.Date.AsTime().String())
	err := m.PlannedMealRepository.NewPlannedMeal(ctx, userId, req.Date.AsTime(), strconv.FormatInt(req.MealId, 10))
	if err != nil {
		return nil, status.Error(codes.Internal, "Could not create new planned meal")
	}

	return &mealsv12.CreatePlannedMealResponse{}, nil
}
