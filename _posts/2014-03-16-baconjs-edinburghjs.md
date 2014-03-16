---
layout: post
title: Bacon.js
---

(The following is based on a talk about Bacon.js I gave at the last EdinburghJS meetup.)

## Intro

If your code is full of callbacks inside callbacks inside callbacks, or full of promises and you're unhappy with that, you should give Bacon.js a try. It can make your code shorter, easier to read and modify, easier to test, and just more pleasant to work with.

Bacon allows you to do something called Functional Reactive Programming in the browser or in Node.js. Never mind the "functional reactive programming" bit - FRP is pretty straightforward to understand if all you care about cleaner shorter code. (Of course, if it's your kind of thing - you can also get lost in all sorts of wonderful weird ideas and details of the theory behind it all, but you don't need to.)

## FRP

In a nutshell, FRP allows you to say this: `A = B + C` is to always be true, at any given point in time while my program is running. Every time `B` or `C` change, `A` will _react_ and recalculate itself. Just like cells in a spreadsheet.

Bacon allows us to set up these "magic" values that react to changes in values they depend on. The functions your write that will run in reaction to changes can do anything of course - update DOM, make AJAX requests etc.

Changes in values are triggered by I/O (mouse events, keyboard input, network requests) and here Bacon wants you to stop thinking in terms of individual events and instead work with event streams, just like undescore.js wants you to stop working with individual elements in a for-loop at a time and instead work with generalized collections.

Your whole app if structured according to this view of the world can be thought of a big spreadsheet.

## Bacon

There are two main concepts in Bacon: `EventStream` and `Property`.

An event stream is self-explanatory - you set one up to handle a type of events you want your code to react to. Clicks on a certain DOM element, keyboard input in a certain text field etc. (Spreadsheet metaphor: anything that updates a cell.)

A property is a dynamic value derived from a stream. For example, a property of an event stream that handles keyboard input in a text area could be the code of the last keypress. (Spreadsheet metaphor: if `A1=INT(B1)` then `INT(B1)` could be a property of event stream `B1`.)

Bacon gives you functions to manipulate streams, like `map`, `filter`, `merge` etc.

    $('.increment') // select an element
    .asEventStream('click') // returns an event stream of clicks on that element
    .map(1) // returns an event stream that emits "1" every time the element is clicked

Exhibit #1: http://jsfiddle.net/6f6uA/1/ - increment/decrement a number in a text box (DOM event streams, DOM updates)
Exhibit #2: http://jsfiddle.net/hktn6/1/ - autocomplete search (AJAX requests to an external API)

## Wonderwheel

I'm using Bacon in <a href="http://wonderwheel.fm">Wonderwheel</a> - an app I built to find new tunes. The app is split into four visible components: Search, Wheel, Details and Playlist which are self-contained, know nothing about each other and communicate via messages through a `Bacon.Bus` (https://github.com/baconjs/bacon.js#bus) There's another component, creatively-named `APILookups` which deals with fetching all the data from external APIs.

As an example, here is what happens when you search for an artist:

1. We hit 7Digital to display matches in the autocomplete dropdown
2. When an artist is selected, we hit 7Digital again to get the picture
	- Once the response comes back we can animate the center of the wheel. At the same time we queue up two more requests:
		1. Hit EchoNest to get recommendations
			- When this comes back we can animate the rest of the wheel and queue up another request:
				- Hit Last.fm to get additional artist information
		2. Hit 7Digital to get the artist's top tracks
			- When that comes back we display the playlist
				- For each track in the playlist we fire off a request to Wonderwheel's own API which gives us a signed request to send to 7Digital to play a preview of a track

Bacon allowed me to decouple animation code from network code, get rid of nested callbacks, and isolate components of the app - which will make it easier to add features, like gig listings from Songkick in the sidebar, or add other catalogues like iTunes or Grooveshark or Soundcloud into the app.

I’m also using Bacon on the server side too to speed up search autocomplete for popular artists. So there you have calls to 7Digital and calls to Redis which acts as an object cache - it’s not a lot of code, but it’s also much nicer thanks to Bacon.

(Here I'd also like to give a shout out to Phil Roberts who introduced me to Bacon.)

## Fin

Bacon is just library, not a framework and it’s very small, and you can start small and just sprinkle bits of it in a few places without having to rewrite all of your code. You can use it in the browser or on the server.

It does takes a little bit to get used to, but once you’re used to it - it’s easier to write new code, to read code, and to modify code because you’re working at higher level of abstraction.

I encourage you to go and play with it. You’ll have fun if nothing else.