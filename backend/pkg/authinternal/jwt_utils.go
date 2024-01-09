package authinternal

import (
	"fmt"
	"github.com/golang-jwt/jwt/v5"
	"time"
)

var hmacSecret = []byte("my-secret-key")

func GenerateJWT(email string) string {
	claims := jwt.MapClaims{
		"iss": "mealer",
		"iat": time.Now().Unix(),
		"exp": time.Now().Add(time.Hour * 24).Unix(),
		"sub": email,
	}
	jwtUnsigned := jwt.NewWithClaims(jwt.SigningMethodHS512, claims)
	jwtSigned, err := jwtUnsigned.SignedString(hmacSecret)
	if err != nil {
		panic(err)
	}
	return jwtSigned
}

func ParseJWT(rawToken string) (*jwt.Token, error) {
	token, err := jwt.Parse(rawToken, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		return hmacSecret, nil
	})
	if err != nil {
		return nil, err
	}

	return token, err
}
