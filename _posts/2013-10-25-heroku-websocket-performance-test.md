---
layout: post
title: Heroku WebSocket Performance
---

Just over two weeks ago, Heroku announced (the long-awaited) [experimental support](https://blog.heroku.com/archives/2013/10/8/websockets-public-beta) for WebSockets. Just like you would expect from Heroku, getting set up is painless and there's good documentation and good sample code to help you.

I was curious to see what kind of performance one could expect, so I did a quick performance test to find out. (I used [Heavy Artillery](http://artillery.io) to generate the load)

## Results

1. You can maintain around 6,000 open connections on a single dyno
2. Creating more than 160 connections/sec will cause H11 errors ([backlog too deep](https://devcenter.heroku.com/articles/error-codes#h11-backlog-too-deep))

Here is the code for the server:

<script src="https://gist.github.com/hassy/7163730.js"></script>

As you can see, it does nothing apart from accepting connections.

The client sessions were very simple: connect and do nothing until disconnected by the server.

Draw your own conclusions whether the numbers above are good or not.

## Test Runs

I ran 7 tests in total.

The first one created 1000 connections/second for 30 seconds - that obviously didn't go well.
The other 5 were me doing a binary search to find the number of connections/second one could make without seeing H11 errors pop up. I got bored between 160 (okay) and 175 (H11's start popping up).


## Comments?

If you think I may have messed something up or should've done something differently, please share your thoughts on <a href="https://news.ycombinator.com/item?id=6628109">Hacker News</a> or tweet at me - <a href="https://twitter.com/hhv1">@hhv1</a>. You can also send me an email at <a href="mailto:h@veldstra.org">h@veldstra.org</a>

I will be updating this post with more numbers as I run more benchmarks. Scaling WebSocket-based apps is a subject dear to my heart.