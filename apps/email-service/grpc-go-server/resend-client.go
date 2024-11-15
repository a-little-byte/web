package grpcgoserver

import (
	"context"
	"fmt"
	"grpc-server/grpc-go-server/proto"

	"github.com/resend/resend-go/v2"
)

type EmailServer struct {
	proto.UnimplementedEmailServiceServer
	client *resend.Client
}

func NewEmailServer(client *resend.Client) *EmailServer {
	return &EmailServer{client: client}
}

func (s *EmailServer) SendEmail(ctx context.Context, req *proto.EmailRequest) (*proto.EmailResponse, error) {
	params := &resend.SendEmailRequest{
		From:    "ALittleByte <alittlebyte@limerio.dev>",
		To:      []string{req.GetTo()},
		Subject: req.GetSubject(),
		Html:    req.GetBody(),
	}

	_, err := s.client.Emails.Send(params)
	if err != nil {
		return &proto.EmailResponse{Success: false, Message: fmt.Sprintf("Failed to send email: %v", err)}, nil
	}
	return &proto.EmailResponse{Success: true, Message: "Email sent successfully"}, nil
}
