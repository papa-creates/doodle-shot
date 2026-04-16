export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.svg"]),
	mimeTypes: {".svg":"image/svg+xml"},
	_: {
		client: {start:"_app/immutable/entry/start.0vvp9xnO.js",app:"_app/immutable/entry/app.JnAOIqQh.js",imports:["_app/immutable/entry/start.0vvp9xnO.js","_app/immutable/chunks/i0V9hBy0.js","_app/immutable/chunks/mEjUREfi.js","_app/immutable/chunks/CivMEJKI.js","_app/immutable/entry/app.JnAOIqQh.js","_app/immutable/chunks/mEjUREfi.js","_app/immutable/chunks/CPrKfT3M.js","_app/immutable/chunks/iYE05zWP.js","_app/immutable/chunks/CivMEJKI.js","_app/immutable/chunks/BnpHQfXV.js","_app/immutable/chunks/pUgZARa3.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
