# readytogo-server
Create a pre-configured express HTTP server

## Usage

```javascript
import { newServer } from '@readytogo/server';

const { app, server } = newServer(9000, {});

app.get('/', (_req, res) => {
	res.send('Hello World!');
});

if (false) server.close();
```

## Note
Every call to newServer() will try to create a new server instance and listen on the given port. Subsequent calls given the same port will throw EADDRINUSE error. If you want to create multiple servers, you should use different ports. Passing an empty object {} as the config parameter to newServer() will use the default configuration. It will enable all the middleware using the default values. If you want to disable specific middleware or change the default values, you should pass the proper configuration object.

