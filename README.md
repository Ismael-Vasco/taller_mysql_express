https://gist.github.com/andrescortesdev/85d96f121b02813aabce686664459b63

### Install
```
npm install express mysql2 dotenv
```
Execute this commant to install express, mysql2 for connections between mysql and express, and finally dotenv to handle environment variables into our `db.js`

### Exmaple of package.json looks like:
```js
{
  "name": "taller-express-mysql",
  "version": "1.0.0",
  "description": "",
  "main": "app.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "commonjs",
  "dependencies": {
    "dotenv": "^17.3.1",
    "express": "^5.2.1",
    "mysql2": "^3.17.2"
  }
}
```