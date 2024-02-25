package main

import (
	"fmt"
	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

func Handler(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	tableName := os.Getenv("TABLE_NAME")
	fmt.Println("TABLE_NAME:", tableName)

	return events.APIGatewayProxyResponse{
		StatusCode: 202,
		Body:       "OK",
	}, nil
}

func main() {
	lambda.Start(Handler)
}
