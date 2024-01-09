FROM golang:alpine as builder

WORKDIR /workspace

COPY go.mod go.mod
COPY go.sum go.sum
RUN go mod download


# Copy the go source
COPY main.go main.go
COPY migrations/ backend/migrations/
COPY pkg/ pkg/
COPY gen/ gen/

# Build
RUN CGO_ENABLED=0 GOOS=linux go build -o /docker-gs-ping

EXPOSE 3333

CMD ["/docker-gs-ping"]
