---
layout: post
title: Load testing. In production.
permalink: /production-load-testing/
---

# Load testing. In production.

## In production?!

Let's go straight to the central idea of this write up: load testing in production is possible. Not only is it possible, it is also very doable and very valuable. I would nearly go as far as to say that production load testing is the best way to squeeze the most value out of running load tests altogether. <!-- Load testing in dev or staging environments is more likely than not to be a waste of time. -->

## Load testing in production can sound weird

In my experience, there are three kinds of people when it comes to production load testing:

1. Small minority of "yep, great idea. been there, done that, got the t-shirt!" To you folks I raise my glass. I wouldn't be surprised if you also didn't have any qualms about deploying to `prod` on Friday afternoons. We're few but proud. I'd love to talk about load testing in production with you.
2. Another small minority of "hell no, no way, that's stupid. reckless. risky. dangerous." This group can be further divided into two groups again: those who cannot test in `prod` for legal or compliance reasons (those do exist), and hardcore skeptics. The skeptics may have logical reasons, but more often than not the reason for skepticism is worry. That's OK. There's nothing wrong with worrying about fragility of a system. However, I would argue that the productive way out is to improve the system where some extra traffic in `prod` does not constitute grave danger, rather than skepticism.
3. By far the absolute majority is people with a mixed reaction. A reaction along the lines of: "yeah, that sounds interesting, valuable, and even somewhat exciting. But also rather dangerous and risky. We'd like to give it a go, but how do we do it safely?" High five to you folks! This article is for you.

## Mindset: Production load testing is another excellent tool in the box

### Complexity is the beast we're fighting

Engineers with experience of working on complex systems are likely to have an intuitive understanding of the value production load testing can bring. **Running production systems at scale is hard.** It's not getting easier either. The two main factors that make running systems at scale a challenge are:

1. Architectural complexity (which is usually there for a reason - a production system probably does a lot of stuff). That architectural complexity can manifest itself in many ways: microservice-based architectures, mixtures of modern and legacy stacks & components, or code & configuration to support operational capabilities such as auto-scaling and auto-healing or blue-green deployments.
2. Rate of change. CI/CD is table stakes today, we deploy to `prod` many times a day, and so do teams that our services depend on. We're not just deploying code either -- configuration changes and infrastructure changes go out all the time too, and change equals risk.

Given a certain level of complexity in a system, its performance and its behavior become an **emergent property**. Component-level guarantees **don't translate** into system-level guarantees, as interactions between those components and properties of the environment they're running in give rise to whole new behaviors and failure modes. The only way to get some guarantees about the performance of a complex system is to **test that very system**.

### Do you test in production?

Which is of course why various ways of testing in production are being embraced by more and more teams. It’s impossible to predict how a system may behave when a dependency fails, so we run [chaos tests](https://principlesofchaos.org) to experiment and see what happens. We need to be able to peek into our systems as they're running production workloads, so we [instrument for observability](https://www.honeycomb.io). That's why we do canary releases and rolling updates. We've come up with many ways to reduce the risks inherent in complexity and to help us when something goes wrong. **Load testing in production is another one of those.**

### Production load testing = confidence

It’s really as simple as that. Increasing confidence is the reason we do any kind of testing of course: from unit tests, to integration tests, functional tests, acceptance tests, security tests etc etc. On a spectrum of 0 confidence that things will work, to 100% confidence (which of course is the unattainable ideal) we want to move as far to the right as possible.

<!--
TODO: graph
-->

And the confidence that you will get from load testing in production cannot be given by any other kind of testing. It’s amazing. There’s a real shift in attitude once you've run your first production load test, provided that you don’t cause an outage of course. It feels good, you just know that stuff works. Stuff that’s very hard to test otherwise. Not just APIs and services, but stuff like CDN configuration, autoscaling at different layers of your system, auto healing, circuit breakers, backoff and retry logic, monitoring, logging — everything that adds to a beautiful symphony of a working production system. A successful production load test is clear proof that things are running as they should be, under extra stress.

### Production load testing as a fitness function

Production load testing is a great tool for identifying all sorts of unknown unknowns in your system. It’s a great fitness function - in evolutionary architecture terms, for proactively and very visibly enforcing certain performance related properties of your system.

It’s a great guard rail for helping you build safety margins around your SLOs -- just because your system could handle its usual daily traffic peak yesterday, it won't necessarily still be able to do it today. And again, if you’re expecting a high-traffic event, the only way to be able to say that “yes, we can handle it” with a high degree of confidence is to test it. You don’t want real users to do it for you, and you don’t want to “hope” that things will be OK.

The ability to load test in production is a signal, a very good signal, of a high overall quality bar.

<!--
## Many teams already run production load tests

but most teams don't... not yet. If your team did it, you'd be in good company([Zalando](https://engineering.zalando.com/posts/2019/04/end-to-end-load-testing-zalandos-production-website.html), [Box](https://blog.box.com/load-testing-in-production), Conde Nast, NYT, Uber, JustEat.

Does your team run load tests in production? Please let me know on Twitter and I'll add you to the list.
-->

## It *is* risky, but those risks can be managed

Yes indeed, the idea can feel dangerous, and running load tests on `prod` does introduce extra risk, but it *can* be done safely and in a measured and managed manner. Risk can be managed -- that's a huge chunk of what we do as engineers.

Production load testing **is not rocket science, and it's not magic**. No arcane knowledge is required to run production load tests. All that's needed is a perspective shift and some communication across teams and departments to get everyone on board. The rest is straightforward engineering that you're probably already doing.

## Types of production load tests

There are three ways to add load in production (which can be mixed and matched as needed):

1. Traffic replay and amplification
2. Adding synthetic traffic
3. Dark traffic

(These same approaches is how you’d also test an isolated component or a subset of a system in a staging environment for example. They're not unique to prod.)

### Traffic replay

Traffic replay & amplification is, as the name suggests, capturing some production traffic and replaying it, perhaps with an amplification factor, back onto production. This works well for systems which respond to or process isolated single requests with no dependencies between them. For websites, a classic example would be a news website without much personalisation, or a classifieds website. For an API, a good example might be an analytics event ingestion API which receives JSON payloads describing some discrete events.

There is one obvious caveat here - you don’t want to create a runaway loop which infinitely feeds itself and blows everything up. The way you avoid that is by being able to distinguish real traffic from replayed traffic at the capture point, and having some intelligence in the traffic replay layer to make sure it does not exceed a certain threshold of extra traffic above real traffic.

### Synthetic traffic

For systems which expose a transactional interface, i.e. where later requests can depend on earlier requests - you will probably not be replaying traffic. This can as simple as an API with an authentication step, where the first request may request a token which is then included with every subsequent request, or something more complex like a headless CMS system or an e-commerce system, where a client searches for keywords, browses results returned based on those searches, adds products to basket, and eventually goes through a checkout process. Essentially anything with a session of some sort.

For these systems, what you would do is write definitions of common user journeys and scenarios, parameterised and randomised to send realistic requests to the system, and run them against production.

### Dark traffic

Dark traffic is an interesting technique, which can work really well for certain types of new components in an existing production system. The idea here is that a new service or endpoint is deployed to production alongside everything else, with real traffic going to it, but without it being exposed to users or being on any kind of a critical path for existing functionality. An example would be a new event logging endpoint which is hit on every page load on your website, but which is completely decoupled from everything otherwise, so that if it goes down - users don’t even notice. You’re effectively load testing with real traffic in this way.

## Tooling for production load testing

To run load tests, we (unsurprisingly) need a way to generate load. There’s lots of tooling out there, you may already be using something. What you go with specifically will depend on what you’re already familiar with, what’s already available, and many other factors. Some tools will make things easier than others, but ultimately it’s a choice that needs to be made by every team depending on their context. My recommendation for a [load testing](https://artillery.io) tool would of course be obvious.

Let's outline a list of requirements that you can use for evaluating load testing tools for production load testing.

### Can you emulate production workloads?

First, can you actually run production like workloads? For a transcational API the tooling would need to support creating scenarios with dependent steps, it needs to support parameterization to make realistic requests, it should support ways to weigh different scenarios, and to generate variable load with ramp up phases for example.

### How easy is it to run a distributed load test?

Production load tests will usually need to generate a lot of traffic, more than a handful of machines can create. How easy is it to run distributed tests, e.g. a load test from 100 nodes for example?

(Ability to generate a large amount of traffic isn't the only reason to want to distribute load generation. For example, using a large number of nodes can help spread traffic more evenly, as some load balancers will use source IPs for load balancing.)

### How about geographical distribution?

Third, you need to be able to generate traffic from different geographical locations. These days it usually means at least a couple of regions, `us-east` and `us-west` for example, or `eu-west` and `eu-central`. If your users are spread across United States, Europe, and Asia-Pacific, well then you need to be able to generate traffic from all of those regions. With as little hassle as possible.

### Real-time reporting

You will also need real-time reporting from your load tests. You need to be able to see response times and response codes as the test is running against your HTTP API for example. This **must** integrate with your existing monitoring setup, whether it’s Prometheus, Datadog, CloudWatch or something else. You need to be able to see all of your metrics alongside each other.

### Will it break the bank?

You need to be able to generate enough load, and do it without breaking the bank. This rules out a lot, if not all, hosted SaaS solutions, and generally points you towards something that you can run on-prem (whether that's your own DC or AWS). If you want to run these tests regularly, you need to be able to run them cost effectively.

### Ease of customization

You will probably need to extend and customize your virtual user behavior at some point beyond what can be done out of the box with tooling of choice. Being able to write your own plugins and extensions, and do it in a language you already know, can come in handy.

### Advanced features

And finally, filing under "advanced", it’s really useful if you can alter load dynamically especially based on an external metric. This lets you automate back off behaviour later down the line, to make load tests ease off or stop when response times experienced by real users start to rise for example. Another cool thing it lets you do is automatically top up your real traffic with synthetic traffic to reach a certain target level.

## Goals for production load tests

Usually, there are two main motivations for running production load tests:

1. A big traffic event coming up, eg. Cyber Week in e-commerce, Election week for a publisher, fashion week for Vogue etc. You have projections of traffic and you want to make sure you can meet it. A launch of a new service would fall into this category as well.
2. Building a margin of confidence and safety, e.g. run 25% extra traffic in production so that you know there’s always that safety margin. This can be sliced and implemented in a variety of different ways, for example:
  - Run on a schedule, e.g. weekly, with extra load added to go above weekly natural peak
  - Run extra load continuously as a percentage of real load or a fixed margin above weekly peak

Of course, it’s natural to shift between these, e.g. you can start by running load tests before a busy period with a lot of human oversight, and then continue running them regularly afterwards. You can start with weekly tests, and as you improve automation and failsafe mechanisms, you start running them daily, or maybe even on certain releases to `prod` automatically and with no human oversight.

## General principles for production load testing

This brings us to some general principles which underpin production load testing.

### Build up in small chunks

The first one is that you will be building up your production load testing capabilities in iterations and in layers. In that sense it’s similar to developing any new piece of software. You start with something small but still useful, and build up from there. In practical terms, this means that it’s fine to start with a production load test, which is run once a week, by a human following a simple run-book but with little automation, testing only one user journey. That’s a great place to start. It does not have to do everything on day one.

Your team may be keen on load testing in `prod` but other teams may need to be convinced. Trailblaze and start with your own microservices, the rest of the system can come later.

### It's OK to take time

The second one is that it will take time. It will take time to put everything together and to build up capacity to run these tests safely and address everyone’s concerns. Plan at least a couple of months for conversations to be had, teams to allocate time to gather data you may need, put extra monitoring in place, make changes to some of the services, and just get comfortable with the idea. It doesn’t mean that nothing will happen for a couple of months - no, you should be able to start adding some extra traffic to production within a couple of weeks, but you won’t run a Big Production Load Test for a while. It cannot be a last-minute effort. It takes time.

### Instrumenting code for load testing


The third one, and this one clears up all of the common objections to production load testing once it is internalised, is: you will need to **instrument your code for load testing**, and add load testing specific code. **That’s not as weird as it may sound** - we add code to do monitoring, to do logging, feature flags and A/B testing, and security controls. Adding code to aid load testing is just one more of those.

Let’s look at specific examples of this in the context of common concerns and objections to load testing.

## Common concerns

### What about junk in our database? or other side effects?

Synthetic traffic in production *is* going to add database records to your production database. It’s going to make your code send out more logs and send more metrics. Your traffic dashboards will show that extra traffic. It will affect analytics, it will affect all sorts of reports assembled by other teams, such as marketing, data, analytics, advertising etc.

This is where extra instrumentation comes in.

You will need a way to distinguish real traffic from synthetic traffic, possibly as it propagates through the system too. For example - if service A is the entry point into the system, and it calls service B, then service B will need to able to know when a request was triggered by a load test. One common way of doing this is via an extra HTTP header, which is then propagated across every subsequent request inside the system, similar to how distributed request tracing works.

You will also need a way to distinguish any persistent objects or database records created by load testing traffic. You might want to clear those out periodically, or you will want to be able to ignore them in reports created by your data or analytics team for example. One way to do it for example is to use a convention for usernames or email addresses associated with accounts in your system, whether that’s the domain used, part of the username or a combination of both. You can get creative, there's no one-size-fits-all approach here.

### What about irreversible or destructive operations?

There may also be some operations that you don’t want to trigger from synthetic tests - attempting to charge a credit card or send out an email being a classic example. These will need to be a no-op when the request is from a virtual user.

It will take time to discover and identify those places in a system, and then to implement that branching, and you will need to allow for plenty of time for it.

### Breaking stuff for real users

The other common concern is of course affecting real users by increasing tail latencies with extra load for example, or causing an outright outage, just brining everything down in flames. 🔥

The way you work around this is two-fold:

One, you always ramp up load slowly and over time so that negative effects of extra traffic can be spotted early, and the test run can be paused or stopped. You never go the whole hog from the start. It’s important to exercise caution, especially early on, and also to **be seen to exercise caution** (see below on why production load testing is only partly about technology).

The second part of this is to have your production SLOs and KPIs monitored and for those metrics to be available - for people running tests when they’re run manually, and programmatically later on for automation. As an operator of a production load test, you need to have a dashboard which tracks conformance to SLOs, defined in terms of real user experience, and it shows you how close you are to breaching those SLOs. You need to be able to have them right there.

### We can't do 100% coverage

This concern is usually a variation of “are we going to load test our payment processing or physical stock allocation too?”. Yes it’s true, there will be parts of the system you will not want to exercise, pretty much always. But - think back to that confidence spectrum. You won’t exercise 100% of all paths in a production system, or all of the components, but there is value in every shift to the right towards that 100%. Even if you never reach it. Every bit of extra confidence gained is valuable.

### What do we do about third parties?

That 100% coverage point is often related to load testing third-party services and dependencies. This has to be decided on a case by case basis, but again: you can always add a load testing specific branch in your code and no-op some operations, or call a mock. It’s OK to do that if you have a 10 step process and you’re not really testing the last one - you’ve still tested the other 9.

Some vendors have specific policies around load testing. Either way, it can't hurt to reach out and ask.

### Cost

Yes, you will be be using additional resources by adding extra traffic, both to generate that traffic and to serve it. Ultimately, it’s a case-by-case call. You might need to put an estimation together. At the end of the day, it’s up to you to decide whether it’s worth it or not, but the arguments against could probably be used against other kinds of testing, like spending time to write unit tests, or pay for non-prod environments — and you probably have both of those.

## Production load testing is only 50% about technology

The other 50% is the social side of it. You will need to talk to a lot of people. Publicise your production load testing initiative across the company. Talk to teams that may want to know or be affected by this extra production traffic, teams outside of core engineering like ad and analytics teams, data teams, marketing, front line customer support and so on.

## Pre-requisites and pre-requirements

Let’s look at what we need to have in place *before* we consider production load testing.

As mentioned earlier, we need the ability to monitor our production SLOs and KPIs in real time, and be able to see at a glance when we’re getting close to breaching one of them. We also need to decide on what our tolerances are, or what our abort condition is. If for example your response time SLO is p95 of 500ms calculated over a sliding 5m window, are you OK to breach that SLO for 5m or 10m while a load test runs, perhaps to give autoscaling time to kick in? If the typical value is 300, you might say stop the test once it's exceeded by 10%. You can define similar stop conditions for other SLOs, such as the ratio of 5xx responses to total requests for example. The key here is that the operator -- whether that’s a human to start with, or an automated system -- can continuously and unambiguously check that the load test is not causing issues.

If you don’t have this, load testing in production is too dangerous.

In a similar vein, you should have monitoring across all layers of your system, from CDN down to EC2 instances that make up your Kubernetes worker pool and everything in between. You’re running a production system, at scale, so you probably have that in place already.

Again, this has already been mentioned – but we want to start **mapping out different components** of the system that may be affected by initial load tests, and make a list of actions that may need to be branched for synthetic traffic, such as sending an actual email, and talking to teams responsible for those components and getting them involved.

**Request tracing and metadata propagation** across the system - again, this will help us distinguish synthetic traffic from real traffic where needed. Without this capability the surface area of the system you will be able to load test in production is going to shrink. It’s a worthwhile investment to make if you don’t have that in place already.

Don’t forget your monitoring system here. Let’s say you use Datadog. You want to be able to plot a timeseries which shows all requests to production, and then split it by real traffic vs load testing traffic. The way to do that is through metric tagging, the exact mechanics may depend on how exactly you’re tracking metrics, but it should be possible.

This goes without saying, but **you should be able to stop your load test almost instantly** when needed. This is some hard-won experience right there. We were running tests one day, and we did have the ability to stop them, just not instantly it turned out, and that five minutes can feel like a loooooong time when you’re seeing error rate on `prod` start climbing. Sigh.

## Roadmap - getting to your first production load test

So, what will this look like in practical terms? You starting point is that you are not running any load tests in production. Let’s say you don’t run any load tests whatsoever.

The overall idea is to iterate, and communicate your progress to teams & people who may be interested.

The first thing you want to do is pick your load testing tooling. We have covered the evaluation criteria you can use.

In parallel, start talking to relevant people and teams. Usually a project like this would be championed by the SRE team or its equivalent in your organization. Obviously, we want to include dev teams in charge of any services and components which are going to be hit with extra load. We want to let data and analytics teams know well in advance too and get as much feedback from them as possible – their data analysis and reporting pipelines are likely to be affected. Someone from marketing and product should be included too - if for no other reason than to let them know **how seriously you’re taking reliability**. In my experience, almost no one does not want to know that you’re working towards being able to show that `prod` can handle extra traffic spikes at any moment. Everyone regardless of their role tends to understand the importance of reliability, and production load testing sounds cool.

You will also want to set up a situation room or an initiative room in Slack or your real time communication platform of choice. You will use this for updates on the project and when load tests are being run.

The next step is to gather data. You need to understand your load patterns, and your usage patterns. What are the most common user journeys through the system? What does traffic look like - are there daily or weekly peaks for example?

This will inform testing scenarios that you will be writing. To start with, it’s best to pick something simple and expand your coverage with time. It will also inform when you may want to run your first few tests. The general idea being that to stay on the safe side, you first few tests will run during off-peak hours.

It will also help you make sure that synthetic traffic is realistic and exercises the system in a similar manner. You hit the same endpoints, in the same general sequence, and synthetic traffic ramps up and down with the same shape as real traffic.

This is where you start putting together a new set of dashboards which a human operator can use when running the first few production load tests. These need to display top-level SLOs and KPIs, with the ability to tell at a glance when they start degrading.

As this information is being put together, start writing a run book for running these load tests. This is how you prepare the test, do a dry run, run a full run; this is where you watch key metrics, these are the thresholds for stopping the test early, this is how you prepare test data if needed, this is how you clean up etc — start with this. It will serve as basis for automation later.

Finally, you have your scenarios ready to go, you have a time window for your first test, you have your monitoring set up… pick a modest amount of extra traffic to start with. Announce the test run ahead of time, ideally the day before at least and then again on the day using a distribution list or a relevant Slack channel to give someone who might have a reason for you to hold off plenty of time to be able to tell you… and then, just run your test. At this point, it should not feel dangerous at all because if nothing else you won’t be adding much extra load.

If everything goes well, and you’ve confirmed that for example you can tell synthetic traffic apart, request headers are being propagated correctly, no-op operations are firing as expected… dial up that level of load and run again. And then again. Something might go wrong, but **your blast radius will be minimal** at every step. And eventually, you will arrive at a point where you’re running with 20% extra traffic, in production, and things just work.

At this point - **celebrate**! 🎉 This is hugely important. Spread the good news. **A production load test is something to be proud of.**

## Conclusion

My hope for this write up is to share what I learned implementing production load testing at a number of companies, to provide some clarity on what it takes to run load tests against `prod`, and to show that it's actually not that hard. It takes time, it takes team work, it takes a perspective shift, but it’s very doable.

I’m hoping that you will want to give it a go, and get to experience how fun it is and how great it feels to have that level of confidence that your production system can handle that extra traffic without breaking a sweat.

Questions? Feedback? Vigorous objections? I'd love to hear from you! Drop me a line on [h@veldstra.org](h@veldstra.org) or ping me on Twitter - [@hveldstra](https://twitter.com/hveldstra).
