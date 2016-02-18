---
layout: post
title: Project Dino - Massive Scale Load Testing With Artillery And AWS Lambda
---

<pre style="font-family: courier; font-size: 12pt;">

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

# Project Dino: Massive Scale Load Testing With Artillery And AWS Lambda

```
$ npm install artillery-dino
$ dino setup
$ dino -n 500 -c 10 -l 20 -t http://myapp.com/
```

## Project Dino In 100 Words

Dino lets you run massive scale load tests from AWS Lambda.

Dino is an experimental project.

Dino is based on [Artillery](https://artillery.io), and the goal is to eventually get the whole of Artillery running on Lambda.

Massive scale? Up to 100 lambdas can be spun up, each sending up to 500 RPS for 50,000 RPS in total.

Experimental? Dino has a very limited feature-set right now (think on par with `ab`) rather than a sophisticated load-generator like Artillery or JMeter. The goal is to run full Artillery on Lambda (at which point Dino will be merged into the Artillery CLI).

Artillery? Artillery is an advanced load-testing tool. It’s written in Node.js and is open-source. Check it out: [https://artillery.io](https://artillery.io)
