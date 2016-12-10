---
layout: post
title: Writing open-source? Pick MPL 2.0
---

# Writing open-source? Pick MPL 2.0

## tldr

You should use MPL 2.0 for your next open-source project. It should be one's default choice unless there are good reasons to pick something else.

## What is MPL 2.0?

MPL stands for "Mozilla Public License", and as the name would suggest, it's a license for open-source software developed by Mozilla. The **version number is very important** - nothing in this blog post applies to MPL v1. I would encourage you to go ahead and [give MPL 2.0 a read](https://www.mozilla.org/en-US/MPL/2.0/), it's not too dense. **The gist of it** is that MPL 2.0 is a *file-level copyleft license*, meaning that if someone uses your MPL 2.0 code, it does NOT affect the choice of license for any of *their* code but any fixes and enhancements to *YOUR* code have to be shared back<sup>[1]</sup>.

It's basically **the best of both worlds** and a perfect balance between the two competing definitions of "freedom": the BSD camp that place *developers'* freedom above everything else vs the GPL camp that prioritize *users'* freedom.

## The Pitch

### Are you a fan of the BSD license? (or MIT, ISC etc)

Anyone can use your BSD/MIT/ISC-licensed code anywhere, including proprietary software. That's cool. What's not cool is that people that benefit from your work don't have to contribute back - anything, ever. Not bug fixes, not performance improvements, not new features - absolutely nothing.

If your code is licensed under MPL 2.0 however, everybody retains the freedom to use your code as they please, **but** any enhancements to your open-source code have to be shared back. Sounds much fairer to me, and hopefully to you too.

### Or do you prefer the GPL?

Now, if your preference for the GPL is purely faith-based, I don't expect you to be convinced easily, however, consider that MPL 2.0 is *almost* like the GPL, but companies that would NEVER EVER touch any GPL-licensed code, can now use your code because MPL 2.0 is not viral, *and* any of the improvements they might make to the code will be shared back.

If you want your work to benefit as many people as possible, this should sound quite attractive.

## The practicalities

It takes just a tiny bit more work to use MPL 2.0. Apart from placing the appropriate [LICENSE.txt](https://www.mozilla.org/en-US/MPL/2.0/) in the root of your repo, you also need to add the license header to every file that is distributed under it. Mozilla provide [license header templates](https://www.mozilla.org/en-US/MPL/headers/) for a variety of commenting syntaxes.

With some filetypes (e.g. JSON) headers might not be an option. In that case, explicitly mention in the README which files are distributed under MPL 2.0.

**Node.js/npm specific**: For next time you run `npm init`, the [SPDX license identifier](https://spdx.org/licenses/) for MPL 2.0 is `MPL-2.0`.

That's it.

## When NOT to use MPL 2.0

When would you go with something other than MPL 2.0? I can imagine a couple of cases:

### 1. Your company has a licensing policy for open-source

You're writing open-source in your job (lucky you) and your company has an open-source policy. Maybe the license of choice is APL, or MIT, or WTFPL - whatever it is, if there's a policy, that's the license you should probably pick.

### 2. You want to do dual-licensing

This is where you basically say "hey, if you're not reselling something built on top of my software, you can use it for free. Otherwise, you have to compensate me for the value I created." In this case, you probably want LGPL or AGPL + a commercial license of some kind. Two successful examples off the top of my head are [Mongo](https://www.mongodb.com/blog/post/the-agpl/) (AGPL with Apache for drivers - an important detail; a large project) and [Sidekiq](http://sidekiq.org/products/enterprise) (LGPL; a micro-ISV). Another one is [MySQL](http://www.mysql.com/about/legal/licensing/oem/) (GPL).

### 3. A dependency mandates the license

Is a critical dependency of your project under GPL? Then you probably need to pick GPL too.

## Fin

Hopefully this convinced you that MPL 2.0 is a good default license for your next open-source endeavour, or at least provided some education or entertainment. As my parting words, I must say that I am obviously **not a lawyer** and this is **not legal advice**. Always use that fine head Zeus/nature gifted you with, and take your own circumstances and preferences into account.

Happy open-source hacking!

### Footnotes

1. *Upon distribution.* Even the extremely viral GPL would not force you to release all of your code unless you distribute the application to other users.
