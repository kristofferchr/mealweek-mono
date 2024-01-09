
.PHONY: build
build:
	docker build . -t gcr.io/kris456/mealweek-go:latest

.PHONY: run
run:
	docker run -d  -p 3333:3333  --network mealweek-go-backend_default  --name mealer gcr.io/kris456/mealweek-go:latest

.PHONY: destroy
destroy:
	docker stop mealer
	docker rm mealer


.PHONY: clean
clean:
	go clean

.PHONY: test
test:
	go test ./...

.PHONY: test_coverage
test_coverage:
	 go test ./... -coverprofile=coverage.out

.PHONY: dep
dep:
	 go mod download

.PHONY: vet
vet:
	 go vet

.PHONY: lint
lint:
	 golangci-lint run --enable-all

