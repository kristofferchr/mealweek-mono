package main

import (
	"context"
	"github.com/docker/distribution/registry/listener"
	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/improbable-eng/grpc-web/go/grpcweb"
	"github.com/jackc/pgx/v5/pgxpool"
	authv1 "github.com/kris456/mealweek-go-backend/gen/proto/auth/v1"
	mealsv1 "github.com/kris456/mealweek-go-backend/gen/proto/meals/v1"
	"github.com/kris456/mealweek-go-backend/pkg/authinternal"
	"github.com/kris456/mealweek-go-backend/pkg/repository"
	services2 "github.com/kris456/mealweek-go-backend/pkg/services"
	"github.com/pkg/errors"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
	"log"
	"net/http"
	"os"
)

func main() {
	dbUrl := os.Getenv("DATABASE_URL")
	if dbUrl == "" {
		println("empty dburl")
		dbUrl = "postgres://postgres:postgres@localhost:5432/mealer?sslmode=disable"
	}

	m, err := migrate.New("file://backend/migrations", dbUrl)
	if err != nil {
		panic(err)
	}

	err = m.Up()
	if err != nil {
		if !errors.Is(err, migrate.ErrNoChange) {
			panic(err)
		}
	}

	dbPool, err := pgxpool.New(context.Background(), dbUrl)
	if err != nil {
		panic(err)
	}

	repositoryManager := repository.New(dbPool)

	srvr := grpc.NewServer(
		grpc.UnaryInterceptor(authinternal.GetAuthInterceptor(dbPool, []any{&services2.AuthService{}})),
	)
	reflection.Register(srvr)
	mealsv1.RegisterMealsServiceServer(srvr, &services2.MealsService{
		RepositoryManager: repositoryManager,
	})
	mealsv1.RegisterPlannedMealsserviceServer(srvr, &services2.PlannedMealsService{
		RepositoryManager: repositoryManager,
	})
	authv1.RegisterAuthServiceServer(srvr, &services2.AuthService{
		RepositoryManager: repositoryManager,
	})

	listen, err := listener.NewListener("tcp", ":3334")
	if err != nil {
		log.Fatal(err)
	}
	go func() {
		if err := srvr.Serve(listen); err != nil {
			log.Fatal(err)
		}
	}()
	wrappedServer := grpcweb.WrapServer(srvr)
	http.Handle("/", http.StripPrefix("/", wrappedServer))
	println("Serving on 3333")
	if err := http.ListenAndServe(":3333", nil); err != nil {
		log.Fatal(err)
	}
}
