package main

import (
	"os"

	"github.com/aws/aws-cdk-go/awscdk/v2"
	"github.com/aws/aws-cdk-go/awscdk/v2/awsapigateway"
	"github.com/aws/aws-cdk-go/awscdk/v2/awsdynamodb"
	"github.com/aws/aws-cdk-go/awscdk/v2/awswafv2"
	awslambdago "github.com/aws/aws-cdk-go/awscdklambdagoalpha/v2"
	"github.com/aws/constructs-go/constructs/v10"
	"github.com/aws/jsii-runtime-go"
)

type LarkyLinksStackProps struct {
	awscdk.StackProps
	StageName *string
}

// TODO: Modify retention period for CLoudWatch Logs
// TODO: Add logs to API Gateway and Lambda
func NewLarkyLinksStack(scope constructs.Construct, id string, props *LarkyLinksStackProps) awscdk.Stack {
	var sprops awscdk.StackProps
	if props != nil {
		sprops = props.StackProps
	}
	stack := awscdk.NewStack(scope, &id, &sprops)

	// DDB Table
	table := awsdynamodb.NewTable(stack, jsii.String("LarkyLinksData"), &awsdynamodb.TableProps{
		PartitionKey: &awsdynamodb.Attribute{
			Name: jsii.String("id"),
			Type: awsdynamodb.AttributeType_STRING,
		},
	})

	// URL Manager Lambda
	urlManagerLambda := awslambdago.NewGoFunction(stack, jsii.String("URLManager"), &awslambdago.GoFunctionProps{
		Entry: jsii.String("lambda/url-manager"),
		Environment: &map[string]*string{
			"TABLE_NAME": table.TableName(),
		},
	})

	table.GrantReadWriteData(urlManagerLambda)

	// Authorizer
	authorizerLambda := awslambdago.NewGoFunction(stack, jsii.String("AuthorizerFunction"), &awslambdago.GoFunctionProps{
		Entry: jsii.String("lambda/authorizer"),
	})

	// API Gateway
	api := awsapigateway.NewRestApi(stack, jsii.String("LarkyLinksApi"), &awsapigateway.RestApiProps{
		RestApiName: jsii.String("LarkyLinksService"),
		Description: jsii.String("This service manages Larky Links."),
		DeployOptions: &awsapigateway.StageOptions{
			StageName: props.StageName,
		},
	})

	authorizer := awsapigateway.NewTokenAuthorizer(
		stack, jsii.String("Authorizer-"+*props.StageName),
		&awsapigateway.TokenAuthorizerProps{Handler: authorizerLambda},
	)

	apiResource := api.Root().AddResource(jsii.String("api"), nil)
	linksResource := apiResource.AddResource(jsii.String("links"), nil)
	linksResource.AddMethod(jsii.String("GET"), awsapigateway.NewLambdaIntegration(
		urlManagerLambda,
		&awsapigateway.LambdaIntegrationOptions{}),
		&awsapigateway.MethodOptions{Authorizer: authorizer})

	// WAF
	webAcl := awswafv2.NewCfnWebACL(stack, jsii.String("LarkyLinksWebACL"), &awswafv2.CfnWebACLProps{
		DefaultAction: &awswafv2.CfnWebACL_DefaultActionProperty{
			Allow: &awswafv2.CfnWebACL_AllowActionProperty{},
		},
		Scope: jsii.String("REGIONAL"),
		VisibilityConfig: &awswafv2.CfnWebACL_VisibilityConfigProperty{
			CloudWatchMetricsEnabled: jsii.Bool(true),
			MetricName:               jsii.String("LarkyLinksWebAclMetric"),
			SampledRequestsEnabled:   jsii.Bool(true),
		},
		Rules: &[]*awswafv2.CfnWebACL_RuleProperty{
			{
				Name:     jsii.String("RateLimitRule"),
				Priority: jsii.Number(1),
				Action: &awswafv2.CfnWebACL_RuleActionProperty{
					Block: &awswafv2.CfnWebACL_BlockActionProperty{},
				},
				Statement: &awswafv2.CfnWebACL_StatementProperty{
					RateBasedStatement: &awswafv2.CfnWebACL_RateBasedStatementProperty{
						AggregateKeyType: jsii.String("IP"),
						Limit:            jsii.Number(100),
					},
				},
				VisibilityConfig: &awswafv2.CfnWebACL_VisibilityConfigProperty{
					CloudWatchMetricsEnabled: jsii.Bool(true),
					MetricName:               jsii.String("RateLimitRuleMetric"),
					SampledRequestsEnabled:   jsii.Bool(true),
				},
			},
		},
	})
	api.Node().AddDependency(webAcl)
	awswafv2.NewCfnWebACLAssociation(stack, jsii.String("WafAssociation"), &awswafv2.CfnWebACLAssociationProps{
		ResourceArn: api.DeploymentStage().StageArn(),
		WebAclArn:   webAcl.AttrArn(),
	})

	return stack
}

type Stage struct {
	Name *string             `json:"name" yaml:"name"`
	Env  *awscdk.Environment `json:"env" yaml:"env"`
}

func main() {
	defer jsii.Close()

	app := awscdk.NewApp(nil)

	devEnv := Stage{
		Name: jsii.String("DEV"),
		Env: &awscdk.Environment{
			Account: jsii.String(os.Getenv("CDK_DEFAULT_ACCOUNT")),
			Region:  jsii.String(os.Getenv("CDK_DEFAULT_REGION")),
		},
	}
	devStage := awscdk.NewStage(app, devEnv.Name, &awscdk.StageProps{Env: devEnv.Env})
	NewLarkyLinksStack(devStage, "LarkyLinksStack", &LarkyLinksStackProps{
		StackProps: awscdk.StackProps{Env: devEnv.Env},
		StageName:  devEnv.Name,
	})

	betaEnv := Stage{
		Name: jsii.String("BETA"),
		Env: &awscdk.Environment{
			Account: jsii.String(os.Getenv("CDK_DEFAULT_ACCOUNT")),
			Region:  jsii.String(os.Getenv("CDK_DEFAULT_REGION")),
		},
	}
	betaStage := awscdk.NewStage(app, betaEnv.Name, &awscdk.StageProps{Env: betaEnv.Env})
	NewLarkyLinksStack(betaStage, "LarkyLinksStack", &LarkyLinksStackProps{
		StackProps: awscdk.StackProps{Env: betaEnv.Env},
		StageName:  betaEnv.Name,
	})

	app.Synth(nil)
}
