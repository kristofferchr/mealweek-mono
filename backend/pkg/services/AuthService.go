package services

import (
	"context"
	"github.com/jackc/pgx/v5"
	authv12 "github.com/kris456/mealweek-go-backend/gen/proto/auth/v1"
	"github.com/kris456/mealweek-go-backend/pkg/authinternal"
	"github.com/kris456/mealweek-go-backend/pkg/repository"
	"github.com/pkg/errors"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"sync"
)

type AuthService struct {
	authv12.AuthServiceServer
	repository.RepositoryManager

	mu sync.Mutex
}

func (m *AuthService) Login(ctx context.Context, req *authv12.LoginRequest) (*authv12.LoginResponse, error) {
	println("Received request")
	user, err := m.UserRepository.GetUser(context.Background(), req.Email)
	if err != nil && !errors.Is(err, pgx.ErrNoRows) {
		return nil, status.Error(codes.Internal, "Failed to get user")
	}

	if user == nil || user.Password != req.Password {
		return nil, status.Error(codes.PermissionDenied, "User does not exist or password is wrong")
	}

	return &authv12.LoginResponse{Token: authinternal.GenerateJWT(user.Email)}, nil
}

func (m *AuthService) Register(ctx context.Context, req *authv12.RegisterRequest) (*authv12.RegisterResponse, error) {
	if req.Email == "" {
		return nil, status.Error(codes.InvalidArgument, "email is required")
	}

	user, err := m.UserRepository.GetUser(context.Background(), req.Email)
	if err != nil && !errors.Is(err, pgx.ErrNoRows) {
		return nil, status.Error(codes.Internal, "Failed to get user")
	}

	if user != nil {
		return nil, status.Error(codes.InvalidArgument, "User already exists")
	}

	// TODO validate password
	err = m.UserRepository.NewUser(context.Background(), req.Email, req.Password)
	if err != nil {
		return nil, status.Error(codes.Internal, "Failed to register user")
	}

	return &authv12.RegisterResponse{Token: authinternal.GenerateJWT(req.Email)}, nil
}
