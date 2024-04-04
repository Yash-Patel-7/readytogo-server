import { newServer } from './index';

describe('newServer', () => {
	it('should create a new http server', async () => {
		const port = 9000;
		const { app, server } = newServer(port, {inactive: {enable: false}});
		app.get('/', (_req, res) => {
			res.send('Hello World');
		});
		let text = '';
		try {
			const res = await fetch('http://localhost:' + port);
			if (res.status !== 200) throw new Error('ERROR');
			text = await res.text();
		} catch (error) {}
		server.close();
		expect(text).toBe('Hello World');
	});
});

