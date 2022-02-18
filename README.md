# Cookie-based authentication in Node.js with SQLite

This web server implements cookie-based authentication in Node.js using a SQLite database.

![Login page screenshot](https://github.com/gvlsq/node-cookie-auth/blob/main/screenshot.png)

## Installation

To initialize the necessary packages, navigate to the root folder of the repository on the command line and enter `npm install`.
Then, run the project in development mode by entering `npm run dev`. This will automatically create a SQLite database named `default.db` and seed it with some tables.

## Unit Testing

Mocha and Chai were used to write unit tests for the middleware and routes in this project. To run
the tests, enter `npm run test` on the command line from the root folder.

Note that a test environment database named `default.test.db` will be created in the root folder every
time you run this command. In the future, the root hooks will be added to Mocha so that this database
is cleaned up automatically.

## Timeout Strategy

As per the [OWASP recommendations for automatic session expiration](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html#automatic-session-expiration), both idle timeout and absolute timeout are implemented in this sample.

Idle timeout requires that the `rolling` option in express-session be true.
When this is true, the web server will set the `Set-Cookie` HTTP response header on every response, which effectively allows for the expiration countdown of the cookie to be reset indefinitely.
When `rolling` is false, the `Set-Cookie` HTTP response header is only be set once (in the response after the cookie is initialized), and the cookie expires after the `maxAge` interval.

Absolute timeout requires extra state be stored in the session to work.
At login time, a UTC timestamp is stored in `req.session.createdAt`.
Subsequent requests to the web server pass through the `ensureActive` middleware in [auth.js](https://github.com/gvlsq/node-cookie-auth/blob/main/middleware/auth.js) to check whether or not the session has been active for too long. If it has, the user is logged out and redirected to the `/login` page with a error message indicating session expiration.

As an aside, the ```resave``` option in express-session is set to false because connect-sqlite3 will *always* touch the session store when the request pipeline runs.
Specifically, connect-sqlite3 updates the `SESSION.expired` column in the database during every request, so we don't need to ask it to update the `SESSION.sess` column too.

## Improvements

* Timing attacks
	* Measures can be added to POST /login so that the time it takes to run does not depend on the
	input to the API, and so that measurements of the time it takes do not leak information to begin
	with
* Integration tests

## License

See the [LICENSE](https://github.com/gvlsq/node-cookie-auth/blob/main/LICENSE) file.
