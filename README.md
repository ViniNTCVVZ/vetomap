# vetomap

The goal of this application is to provide a tool to do **map veto** for the game Counter Strike : Global Offensive. The application is deployed on vetomap.com

## Getting Started

The project is made with Angular and Node.js

### Prerequisites

You need to install [Node.js](https://nodejs.org/en/) and you should then install [angular cli](https://github.com/angular/angular-cli) with npm. It will deploy a light webserver on port 4200 and compile on the fly your frontend code (Angular).

You will also need [TypeScript compiler](https://www.typescriptlang.org/#download-links) for the backend

### Installing

Serve Angular code (front) by executing this command into the *front* directory then you can access the application on http://localhost:4200

```
ng serve
```

To deploy the backend, you need to compile the code with typescript compiler into the *back* directory by using `tsc` then run the node.js program with this command into the *back* directory

```
node ./dist/server.js
```

## Deployment

You should buil the Angular code with **aot** and **prod** option like this `ng build --prod --aot`. Then deploy the content of the *dist* folder on a webserver.

To deploy the backend, you just need to run the node application on any server. You can use [PM2](http://pm2.keymetrics.io/) for example

## License

This project is licensed under the GPL-3.0 - see the [LICENSE](LICENSE) file for details
