# Cookie-based authentication in Node.js

This sample implements cookie-based authentication in Node.js using express-session and bcrypt.
A SQLite disk file is used to store users and sessions, so the app can downloaded easily and tried
out.

## Build

To initialize the project, use the command line to navigate to the root folder of the repository and enter `npm install`.

Then, run the project in development mode by entering `npm run dev`. Alternatively, run it in "production" mode by entering `npm run start`.

## Timeout Strategy

As per the [OWASP recommendations for automatic session expiration](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html#automatic-session-expiration),
both idle timeout and absolute timeout are implemented in this sample.

Idle timeout requires that the ```rolling``` option in express-session be true. When this is set to
true, the web server will set the ```Set-Cookie``` HTTP response header on every response, which
will effectively reset the expiration countdown of the cookie indefinitely. If ```rolling``` were false,
the ```Set-Cookie``` HTTP response header would only be set once, after the cookie was initialized,
and the cookie would expire after the ```maxAge``` interval.

Absolute timeout requires extra state be stored in the session to work. At login time, a UTC timestamp
is stored in ```req.session.createdAt``` to track when the session was created. Subsequent requests to
the web server pass through middleware in [auth.js](https://www.google.com) to check whether or not the
session has been active for too long. If it has, the user is logged out and returned to the ```/login```
page with a error message indicating session expiration.

As an aside, the ```resave``` option in express-session is set to false because connect-sqlite3 touches
the session store every time the request pipeline runs. In other words, connect-sqlite3 updates the 
SESSION.expired column in the database during every request, so we don't need to ask it to update the
SESSION.sess column too.

## License

See the LICENSE file.
