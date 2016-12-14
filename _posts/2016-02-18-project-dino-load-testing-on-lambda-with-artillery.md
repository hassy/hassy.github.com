---
layout: post
title: Project Dino - serverless load testing with Lambda and Artillery.io
---

# Project Dino: Large-scale Load Testing With AWS Lambda

<a class="github-button" href="https://github.com/hassy/artillery-dino" data-style="medium" data-count-href="/hassy/artillery-dino/stargazers" data-count-api="/repos/hassy/artillery-dino#stargazers_count" data-count-aria-label="# stargazers on GitHub" aria-label="Star hassy/artillery-dino on GitHub">Star</a>
<script async defer id="github-bjs" src="https://buttons.github.io/buttons.js"></script>

<pre style="font-family: menlo, courier, monospace; font-size: 0.9em">

                          _._
                        _/:|:
                       /||||||.
                       ||||||||.
                      /|||||||||:
   _ _               /|||||||||||
 _| |_|___ ___      .|||||||||||||
| . | |   | . |     | ||||||||||||:
|___|_|_|_|___|   _/| |||||||||||||:_=---.._
                  | | |||||:'''':||  '~-._  '-.
                _/| | ||'         '-._   _:    ;
                | | | '               '~~     _;
                | '                _.=._    _-~
             _.~                  {     '-_'
     _.--=.-~       _.._          {_       }
 _.-~   @-,        {    '-._     _. '~==+  |
('          }       \_      \_.=~       |  |
`======='  /_         ~-_    )         <_oo_>
`-----~~/ /'===...===' +   /
         <_oo_>         /  //
                       /  //
                      <_oo_>

</pre>

Say hello to Dino.

```
$ npm install artillery-dino
$ dino setup -r $role_arn # see below
$ dino -n 500 -c 10 -l 20 -t http://indestructible.io/
```

## Project Dino In 100 Words

Dino lets you run large scale load tests from AWS Lambda. It's an experimental project based on [Artillery](https://artillery.io).

Large scale? Up to 100 lambdas can be spun up, each sending 500-1000 RPS for 50k-100k RPS in total.

Experimental? Dino has a very limited feature-set right now - think distributed `ab`/`wrk` (or [Bees With Machine Guns](https://github.com/newsapps/beeswithmachineguns)) rather than an advanced load-generator like [Artillery](https://artillery.io) or JMeter. The goal is to run full Artillery on Lambda (at which point Dino will be merged into the Artillery CLI).

## How Does It Work?

Dino in a nutshell:

1. Dino CLI creates the Lambda function when you run “dino setup”, along with an SQS queue for the running lambdas to communicate with the CLI.
2. The lambda function is a thin wrapper on top of [`artillery-core`](https://github.com/shoreditch-ops/artillery-core) - hacked up and transpiled to ES5 with Babel in order to run on Lambda.
3. Dino CLI invokes this function a number of times when you run a test with something like “dino -n 500 -c 10 -l 20”.
4. The lambda function accepts a “scenario spec” and a test id, then feeds the scenario to `artillery-core` which actually runs it. As stats come back from `artillery-core`, the lambda pushes them as messages onto an SQS queue via SNS.
5. The CLI listens for those messages, reads them, and displays test stats for you in real time.

Here's a dinogram to illustrate:

![how it works - a dinogram](/images/blog/dinogram.png)

## Demo!

<script type="text/javascript" src="https://asciinema.org/a/36616.js" id="asciicast-36616" async></script>

## Setting Up

Dino runs on AWS Lambda, so you need to have an AWS account. (AWS Lambda comes with a rather generous free tier which would let you run quite a few large tests for free.) To get Dino set up, you'll need to set up an IAM User and an IAM Role.

1. Log into the [AWS Console](https://console.aws.amazon.com/)
2. Navigate to IAM -> Users -> Create New Users
  - Name the new user something like `dino_cli`
  - Copy the **Access Key ID** and **Secret Access Key** into `~/.aws/credentials`:
    ```
    [dino]
    aws_access_key_id=YOUR_KEY_ID_HERE
    aws_secret_access_key=YOUR_ACCESS_KEY_HERE
    ```
  - In the list of users click on `dino_cli` and go to the Permissions tab and attach these policies:
    1. `AmazonSQSFullAccess`
    2. `AmazonLambdaFullAccess`
    3. `AmazonSNSFullAccess`

    These will allow the Dino CLI to set up SNS/SQS for executing lambdas to communicate with the CLI as tests are running, and to create the lambda itself.
3. Finally, navigate to Roles -> Create New Role
  1. Name the new role something like `lambda_dino`
  2. Select 'AWS Lambda' under 'AWS Service Roles'
  3. Select `AmazonSNSFullAccess` in the list of policies
  4. Copy **Role ARN** somewhere

Once the IAM User is set up and your have the role ARN, run:

```
$ dino setup -r $ROLE_ARN
```

And once that completes, you're ready to run some tests.

## Run Some Tests


To see all options run `dino run --help`:

```
$ dino run --help

Usage: bin/dino run [options] <target>

Options:
  --help  Show help                                                    [boolean]
  -t      target - target URL                                [string] [required]
  -n      requests - number of requests to send              [number] [required]
  -c      connections - number of connections to open                   [number]
  -l      lambdas - number of lambdas to run (between 1 and 100)
                                                             [number] [required]
  -k      insecure - turn off TLS verification                         [boolean]
```

Run a test:

```
$ dino -n 1000 -c 10 -l 20 http://indestructible.io/
```

You can run as many as `100` lambdas concurrently - if you need more, you'll need to contact AWS.

## IMPORTANT: Disclaimers

Dino basically lets you run a layer-7 DDoS attack. If you point it at any target
that does not belong to you, you'd be behaving unethically and breaking the law.
**Misuse of Dino could result in prosecution and liability for any downtime
caused.**

Even if you only use Dino to test your own apps, get in touch with AWS if
you're going to run many large-scale tests to let them know. Otherwise your
AWS account could get locked.

You have been warned. You are on your own - the authors of Dino / Artillery
hold no responsibility for the result of any of your actions.

## More

- Source code: [https://github.com/hassy/artillery-dino](https://github.com/hassy/artillery-dino)
<a class="github-button" href="https://github.com/hassy/artillery-dino" data-style="medium" data-count-href="/hassy/artillery-dino/stargazers" data-count-api="/repos/hassy/artillery-dino#stargazers_count" data-count-aria-label="# stargazers on GitHub" aria-label="Star hassy/artillery-dino on GitHub">Star</a>
- Questions / suggestions / comments:
  - tweet me [@hveldstra](https://twitter.com/hveldstra)
  - drop me a line on [h@veldstra.org](h@veldstra.org)
  - or [create an Issue](https://github.com/hassy/artillery-dino) on Github
- Updates: follow me on Twitter: [@hveldstra](https://twitter.com/hveldstra), follow Artillery on Twitter: [@ShoreditchOps](https://twitter.com/ShoreditchOps)
