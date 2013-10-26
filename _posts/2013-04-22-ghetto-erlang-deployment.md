---
layout: post
title: ghetto Erlang deployment
---

Sometimes you just don't have the time to do things properly. For a side project I'm hacking on, my deployment process is this:

1. `ssh into the server`
2. `git pull`
3. `rebar compile`

And that's it (Mochiweb's `reloader` reloads the code on the fly).

Erlang is running under `screen` so I can always poke around in the shell and do some good old printf debugging when I need to.

It works well and will serve me fine until I know I need to make it more robust.