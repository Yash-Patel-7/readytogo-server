import express from 'express';
import http from 'http';

interface Config {
	inactive?: {
		enable?: boolean;
		time?: number;
		wait?: number;
	};
	cors?: {
		enable?: boolean;
		origin?: string;
		methods?: string;
		headers?: string;
	};
	json?: {
		enable?: boolean;
	};
	urlencoded?: {
		enable?: boolean;
	};
}

interface NewServer {
	app: express.Express;
	server: http.Server;
}

const newServer = (port: number, config: Config): NewServer => {
	config = {
		inactive: {
			enable: true,
			time: 60 * 60 * 1000,
			wait: 10 * 1000,
			...config.inactive
		},
		cors: {
			enable: true,
			origin: '*',
			methods: 'GET, POST',
			headers: 'Content-Type',
			...config.cors
		},
		json: {
			enable: true,
			...config.json
		},
		urlencoded: {
			enable: true,
			...config.urlencoded
		},
	};

	const inactive = (): void => {
		const timeout = (): NodeJS.Timeout => setTimeout(() => {
			server.close(() => process.exitCode = 0);
			setTimeout(() => {throw new Error('FORCEQUIT')}, config.inactive?.wait);
		}, config.inactive?.time);
		let inactiveTimer = timeout();
		app.use((_req, res, next) => {
			res.on('finish', () => {
				clearTimeout(inactiveTimer);
				inactiveTimer = timeout();
			});
			next();
		});
	}

	const cors = (): void => {
		app.use((_req, res, next) => {
			if (config.cors?.origin !== undefined)
			res.setHeader('Access-Control-Allow-Origin', config.cors.origin);
			if (config.cors?.methods !== undefined)
			res.setHeader('Access-Control-Allow-Methods', config.cors.methods);
			if (config.cors?.headers !== undefined)
			res.setHeader('Access-Control-Allow-Headers', config.cors.headers);
			next();
		});
	}

	const json = (): void => {
		app.use(express.json());
	}

	const urlencoded = (): void => {
		app.use(express.urlencoded({ extended: true }));
	}

	const app = express();
	const server = app.listen(port);

	if (config.inactive?.enable === true) inactive();
	if (config.cors?.enable === true) cors();
	if (config.json?.enable === true) json();
	if (config.urlencoded?.enable === true) urlencoded();

	return { app, server };
}

export {
	newServer
}
