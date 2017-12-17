# vetomap

The goal of this application is to provide a tool to do **map veto** for the game Counter Strike : Global Offensive. The application is deployed on vetomap.com

## Getting Started

The project is made with Angular and Node.js

### Prerequisites

You need to install [Node.js](https://nodejs.org/en/) and then install [the Angular client](https://github.com/angular/angular-cli). It will provide you a local webserver on port 4200 and compile on the fly your Angular code.

You will also need [TypeScript compiler](https://www.typescriptlang.org/#download-links) for the back-end

### Installing

First, you need to run `npm install` on both *front* and *back* folders to install the node.js dependencies.

Then, you can deploy Angular front-end by executing the command below into the *front* folder and access to the application on http://localhost:4200 : 

```
ng serve
```

To deploy the back-end, you need to compile the code with the typescript compiler into the *back* folder with the command `tsc` and run the node.js application : 

```
node ./dist/server/server.js
```

## Deployment

First, don't forget to change the websocket url in *front/src/app/services/api.service.ts* with your own domain name (same port).

Then, you should build the Angular application with **aot** and **prod** options : `ng build --prod --aot`. Then deploy the content of the *front/dist* folder on the webserver.

You also need to add some rewrite rules to ensure that all urls redirect to the *index.html* file. For example, on an Apache server, you need to add those rules in the virtual host configuration file : 

```
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html[L]
```

To deploy the back-end, you just need to run the compiled node application on any server. You can use [PM2](http://pm2.keymetrics.io/) for example to better handle and monitor the application.

## License

This project is licensed under the GPL-3.0 - see the [LICENSE](LICENSE) file for details
