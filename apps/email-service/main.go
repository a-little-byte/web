package main

import (
	grpcgoserver "grpc-server/grpc-go-server"
	"grpc-server/grpc-go-server/proto"
	"log"
	"net"
	"os"

	"github.com/joho/godotenv"
	"github.com/resend/resend-go/v2"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

func main() {

	if err := godotenv.Load(); err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	apiKey := os.Getenv("RESEND_API_KEY")
	if apiKey == "" {
		log.Fatalf("RESEND_API_KEY environment variable is not set.")
	}
	port := os.Getenv("PORT")
	if port == "" {
		log.Fatalf("PORT environment variable is not set.")
	}

	resend_client := resend.NewClient(apiKey)
	email_server := grpcgoserver.NewEmailServer(resend_client)

	lis, err := net.Listen("tcp", port)
	if err != nil {
		log.Fatalf("Failed to listen on port %s: %v", port, err)
	}

	grpcServer := grpc.NewServer()
	proto.RegisterEmailServiceServer(grpcServer, email_server)
	reflection.Register(grpcServer)

	log.Printf("gRPC Email Service server is running on port %s...", port)
	if err := grpcServer.Serve(lis); err != nil {
		log.Fatalf("Failed to serve: %v", err)
	}
}
