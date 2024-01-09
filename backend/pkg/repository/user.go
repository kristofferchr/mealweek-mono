package repository

import (
	"context"
	"github.com/jackc/pgx/v5/pgxpool"
)

type UserRepository struct {
	dbPool *pgxpool.Pool
}

func NewUserRepository(dbPool *pgxpool.Pool) UserRepository {
	return UserRepository{dbPool: dbPool}
}

func (ur UserRepository) NewUser(ctx context.Context, email string, password string) error {
	if _, err := ur.dbPool.Exec(ctx, "INSERT INTO public.user_info(email, password) VALUES ($1, $2)", email, password); err != nil {
		return err
	}

	return nil

}

func (ur UserRepository) GetUser(ctx context.Context, email string) (*User, error) {
	var user User
	if err := ur.dbPool.QueryRow(ctx, "SELECT * FROM public.user_info WHERE email=$1", email).Scan(&user.Id, &user.Email, &user.Password, nil, nil); err != nil {
		return nil, err
	}

	return &user, nil
}

type User struct {
	Id           string `json:"id"`
	Email        string `json:"email"`
	Password     string `json:"password"`
	CreatedDate  string `json:"created_Date,omitempty"`
	ModifiedDate string `json:"modified_Date,omitempty"`
}
