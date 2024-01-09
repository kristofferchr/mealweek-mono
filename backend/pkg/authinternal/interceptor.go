package authinternal

import (
	"context"
	"database/sql"
	"github.com/golang-jwt/jwt/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"
	"reflect"
	"strings"
)

const bearerTokenPrefix = "Bearer "

var errMissingMetadata = status.Errorf(codes.InvalidArgument, "no incoming metadata in rpc context")

func GetAuthInterceptor(db *pgxpool.Pool, blackListsServices []interface{}) grpc.UnaryServerInterceptor {

	return func(ctx context.Context, req any, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (any, error) {
		for _, blackListedService := range blackListsServices {
			if reflect.TypeOf(blackListedService) == reflect.TypeOf(info.Server) {
				return handler(ctx, req)
			}
		}

		md, ok := metadata.FromIncomingContext(ctx)
		if !ok {
			return nil, errMissingMetadata
		}

		authMetadata := md.Get("Authorization")
		if len(authMetadata) != 1 {
			return nil, status.Error(codes.Unauthenticated, "No authorization metadata provided")
		}

		authHeader := authMetadata[0]

		if !strings.HasPrefix(authHeader, bearerTokenPrefix) {
			return nil, status.Error(codes.Unauthenticated, "Not a Bearer token")
		}

		tokenRaw := strings.TrimPrefix(authHeader, bearerTokenPrefix)
		token, err := ParseJWT(tokenRaw)
		if err != nil {
			return nil, status.Error(codes.Unauthenticated, "Not valid JWT")
		}

		claims := token.Claims.(jwt.MapClaims)
		email, found := claims["sub"]
		if !found {
			return nil, status.Error(codes.Unauthenticated, "Could not find sub in jwt")
		}

		var user User
		if err = db.QueryRow(context.Background(), "SELECT * FROM user_info WHERE email=$1", email.(string)).
			Scan(&user.Id, &user.Email, &user.Password, &user.CreatedDate, &user.ModifiedDate); err != nil {
			return nil, status.Error(codes.PermissionDenied, "Could not find user")
		}

		md.Append("email", user.Email)
		md.Append("userId", user.Id)
		ctx = metadata.NewIncomingContext(ctx, md)

		return handler(ctx, req)
	}

}

type User struct {
	Id           string         `json:"id"`
	Email        string         `json:"email"`
	Password     string         `json:"password"`
	CreatedDate  sql.NullString `json:"created_Date"`
	ModifiedDate sql.NullString `json:"modified_Date"`
}
