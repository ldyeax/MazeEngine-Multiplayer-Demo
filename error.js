import sendError from '@tinypudding/puddy-lib/http/HTTP-1.0.js';
import errorsCallback from '@tinypudding/puddy-lib/http/errorsCallback.js';
const error_page = function (
	// App
	app,
	// Default Error Callback
	errorCallback = (req, res, next, data) => {
		return sendError.send(res, data.code);
	}
) {
	// Logger
	const loggerError = function (req, res, data) {
		// Not Error 404
		if (data.code !== 404) {
			console.error(data.err);
		}
		// Return Error Callback
		return errorCallback(req, res, null, error404(req));
	};
	// Error 404
	const error404 = function (req) {
		return {
			code: 404,
			path: req.url,
			originalUrl: req.originalUrl,
			err: new Error('not found')
		};
	};
	app.post('*', (req, res) => {
		return loggerError(req, res, error404(req));
	});
	app.get('*', (req, res) => {
		return loggerError(req, res, error404(req));
	});
	// Other Errors
	app.use(errorsCallback(function (req, res, next, data) {
		return loggerError(req, res, data);
	}));
	// Complete
	return;
};

export { error_page };
