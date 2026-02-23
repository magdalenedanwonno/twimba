
 Twimba – Mini Twitter Clone

Twimba is a small Twitter-inspired web app built with HTML, CSS, and JavaScript. It allows a single user to post tweets, like, retweet, reply, and delete tweets, with all data saved in the browser using localStorage.


 Features

* Post new tweets (appears at the top of the feed)
* Like and retweet tweets
* Reply to tweets
* Delete your own tweets
* Undo last deleted tweet
* Persistent data with localStorage


Demo



 Usage

1. Clone the repository:

```bash
git clone https://github.com/magdalenedanwonno/twimba.git
```

2. Open `index.html` in your browser.
3. Use the input box to post tweets, click icons to like, retweet, reply, or delete.


 Tech Stack

* HTML, CSS, JavaScript
* localStorage for persistent data
* UUID for unique tweet identifiers


 Notes

* Only one user (`@Magdalene`) is supported.
* Delete action works only on tweets posted by the logged-in user.
* Replies are nested under their parent tweet.

