---
layout: post
title: Meet Chaos Llama
---

# Meet Chaos Llama

Chaos Llama, a new open-source project from Shoreditch Ops has been released and is available on [http://llamajs.com](http://llamajs.com).

<a class="github-button" href="https://github.com/hassy/llama-cli" data-style="medium" data-count-href="/hassy/llama-cli/stargazers" data-count-api="/repos/hassy/llama-cli#stargazers_count" data-count-aria-label="# stargazers on GitHub" aria-label="Star hassy/llama-cli on GitHub">Star</a>
<script async defer id="github-bjs" src="https://buttons.github.io/buttons.js"></script>

<pre style="font-family: courier, monospace; font-size: 0.9em; font-weight: bold;">
                 V
                /'>>>
               /*/  _____ _____ _____ _____ _____
              / /  |     |  |  |  _  |     |   __|
             /*/   |   --|     |     |  |  |__   |
            / /    |_____|__|__|__|__|_____|_____|
    -------/*/      __    __    _____ _____ _____
 --/  *  * */      |  |  |  |  |  _  |     |  _  |
  /* * *  */       |  |__|  |__|     | | | |     |
  -  --- -/        |_____|_____|__|__|_|_|_|__|__|
   H    H
   H    H
   --   --
</pre>

## What is Chaos Llama?

Chaos Llama is a small utility for testing the relisience of AWS architectures to random failures.

Once deployed, Chaos Llama will pick and terminate instances at random at some configurable interval. The idea is to constantly test your system's ability to keep running despite partial failure of some components making the system more resilient to outages overall.

If this sounds familiar, that's because Chaos Llama is inspired by [Netflix's notorious Chaos Monkey](http://techblog.netflix.com/2012/07/chaos-monkey-released-into-wild.html). The main difference between Chaos Monkey and Chaos Llama is simplicity. Whereas Chaos Monkey requires an EC2 instance to be created, configured and maintained to run, Chaos Llama takes advantage of [AWS Lambda](http://docs.aws.amazon.com/lambda/latest/dg/welcome.html) and can be installed and deployed in a matter of minutes. The flipside of that is that Chaos Llama has a smaller feature set and only runs on AWS.

## How Chaos Llama Works

There are two parts to Chaos Llama: the CLI that lets you deploy and configure Llama,
and the [AWS Lambda function](http://docs.aws.amazon.com/lambda/latest/dg/welcome.html) which picks and terminates an instance when it's run.

1. The CLI
  The [llama-cli](llama-cli) package is a Node.js CLI application (using the awesome [yargs](https://github.com/)) library) that uses the AWS Node.js SDK to create and update the lambda function and to create an invokation schedule for it with [Cloud Watch Events](https://aws.amazon.com/blogs/aws/new-cloudwatch-events-track-and-respond-to-changes-to-your-aws-resources/).
2. The lambda function
  The [lambda function](https://github.com/hassy/llama-cli/blob/master/lambda/index.js) that contains the logic for selecting and terminating EC2 instances.

## Getting Started With Chaos Llama

Install the CLI with:

```
npm install -g llama-cli
```

(If you don't have Node.js/npm installed, grab an installer for your platform from [nodejs.org](https://nodejs.org/en/).)

To deploy Llama, you'll need an IAM User (for the CLI to run as) and an IAM
Role (for the lambda).

Sset up an IAM user (if you don't have one already):

1. Log into the [AWS Console](https://console.aws.amazon.com/)
2. Navigate to IAM -> Users -> Create New Users
  - Name the new user something like `chaos_llama`
  - Copy the **Access Key ID** and **Secret Access Key** into `~/.aws/credentials`:
    ```
    [llama]
    aws_access_key_id=YOUR_KEY_ID_HERE
    aws_secret_access_key=YOUR_ACCESS_KEY_HERE
    ```
  - In the list of users click on `llama_cli` and go to the Permissions tab and attach these policies:
    1. `AmazonLambdaFullAccess`

    These will allow the Llama CLI to create the lambda.

Then, create a Role for Llama's lambda function:

1. Finally, navigate to Roles -> Create New Role
  1. Name the new role something like `chaos_llama`
  2. Select 'EC2' under 'AWS Service Roles'
  3. Select `AmazonEC2FullAccess` in the list of policies
  4. Take note of the **Role ARN** somewhere

Once the IAM User is set up and your have the role ARN, run:

```
llama deploy -r $LAMBDA_ROLE_ARN
```

This will deploy Chaos Llama to your AWS environment, but it **won't actually
do anything** by default.

To configure termination rules, run `deploy` with a [Llamafile](https://github.com/hassy/llama-cli/blob/master/Llamafile.json):

```
llama deploy -c Llamafile.json
```

### Llama Configuration

A Llamafile is a JSON file that configures your Chaos Llama:

```javascript
{
  "interval": "60",
  "enableForASGs": [
  ],
  "disableForASGs": [
  ]
}
```

The options are:
- `interval` (in minutes) - how frequently Chaos Llama should run. The minimum
value is `5`, and the default value is `60`.
- `enableForASGs` - opt-in the ASGs that instances may be selected from for termination. An empty list (`[]`) would effectively disable the llama.
- `disableForASGs` - opt-out ASGs from being selected; instances in any
other ASG are eligible for termination.

If both `enableForASGs` and `disableForASGs` are specified, then only
`enableForASGs` rules are applied.

## Further Plans

- Adopting [ZeroMQ's C4 contribution model](http://rfc.zeromq.org/spec:22).
- Integrating with Slack and other team chat tools
- Support for email notifications via AWS SES
- Janitor and Conformity Llamas

Would you like to contribute? The [Issues](https://github.com/hassy/llama-cli/issues) is a good place to start for some ideas. Feel free to email me on [h@veldstra.org](mailto:h@veldstra.org) if you have any questions.

## More

- Source code: [https://github.com/hassy/llama-cli](https://github.com/hassy/llama-cli)
- Questions / suggestions / comments:
  - tweet me [@hveldstra](https://twitter.com/hveldstra)
  - drop me a line on [h@veldstra.org](h@veldstra.org)
  - or [create an Issue](https://github.com/hassy/llama-cli) on Github
- Updates: follow me on Twitter: [@hveldstra](https://twitter.com/hveldstra)

## P.S. Only 90s kids will understand

Nobody whips this llama's ass.

<iframe width="420" height="315" src="https://www.youtube.com/embed/HaF-nRS_CWM" frameborder="0" allowfullscreen></iframe>


