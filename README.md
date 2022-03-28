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
time you run this command. In the future, root hooks will be added to Mocha so that this database
is cleaned up automatically. 

## Timeout Strategy

As per the [OWASP recommendations for automatic session expiration](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html#automatic-session-expiration), both idle timeout and absolute timeout are implemented in this sample.

Idle timeout requires that the `rolling` option in express-session be `true`.
When this is `true`, the web server will set the `Set-Cookie` HTTP response header on every response, which lets the user reset the expiration countdown of the cookie indefinitely as long as they keep making timely requests.
When `rolling` is false, the `Set-Cookie` HTTP response header is only set once—in the response after the cookie is initialized—and the cookie expires after the `maxAge` interval.

Due to limitations in express-session, absolute timeout requires extra state to be stored in the session to work.
At login time, a UTC timestamp is stored in `req.session.createdAt`, and middleware will run on subsequent server requests to ensure that the session has not been active for too long. If it has, the user is logged out and redirected to the `/login` page.

As an aside, we set the ```resave``` option in express-session to `false` because connect-sqlite3 will *always* touch the session store when the request pipeline runs.
Specifically, connect-sqlite3 updates the `SESSION.expired` column in the database during every request—we don't need to ask it to update the `SESSION.sess` column too.

## Improvements

* Introduce TypeScript
	* e.g. github.com/jacobstern/typescript-handlebars-realworld/
* Introduce integration tests
	* e.g. GET /logout depends on a successful POST /login first, see: gist.github.com/joaoneto/5152248
* Handle timing attacks
	* Measures can be added to the `POST /login` endpoint so that its response time is not dependent on its input, e.g. github.com/alex996/node-auth/blob/master/api/src/routes/auth.ts#L16
* Handle CSRF
	* CSRF tokens can be added to all HTML forms returned by the web server to protect against CSRF attacks

## License

See the [LICENSE](https://github.com/gvlsq/node-cookie-auth/blob/main/LICENSE) file.
