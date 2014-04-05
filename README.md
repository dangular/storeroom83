# Storeroom 83

Inventory and asset management application built using MEAN stack (MongoDB, Express.js, Angular.js, and Node.js).  This application is a work in progress.  Over time it will develop into a full-scale inventory management and asset management application.  In the meantime, it will serve to demonstrate the latest techniques for developing robust single page web applications based around the MEAN stack.  It will also embrace continuous integration and testing workflows using Grunt, Karma, Protractor.

Some of the technologies planned for Storeroom 83 include:

#### Client Side Technologies

* HTML 5
* Twitter Bootstrap 3.1.x
* angularjs
* ui-router (angular routing framework)
* Restacular (angular REST support)
* angular-ui (useful directives for angular)
* angular-cache (drop in replacement caching mechanism)

#### Server Side Technologies

* Node.js
* MongoDB  (persistent storage)
* Express.js  (web application framework built on top of Connect for Node.js)
* Mongoose (schema based domain modeling)
* Elastisearch
* Passport (authentication)

#### Package Management

* npm
* Bower

#### Testing/Continuous Integration

* Jasmine
* Karma
* Grunt
* Protractor

#### Source Repository

* Git/GitHub (where else?)

## Installation Instructions

### Prerequisites

#### Node JS

You will need Node.js.  If you don't have it installed already, you can find an installer for your operating system [here](http://nodejs.org "Get NodeJS"). The node installer will also install **npm**.  This project is currently using Node 0.10.26.

Once you have Node installed, clone the repo into a directory of your choice. Then run npm install from within the newly created project directory. This will download and install all the dependencies listed in the package.json file.

```
$ npm install
```

#### Grunt

`npm install` will install grunt into your local development/project directory.  However, you will also want the grunt command line interface (cli).  This should be installed globally. Note that you may prefer to use "sudo" when doing global installs to avoid permission issues.

```
$ npm install -g grunt-cli
```

#### Bower

You will also need Bower installed globally.  Bower uses npm so make sure you have installed Node first. To install Bower globally:

```
$ npm install -g bower
```

Once this is complete, run bower install from within the working directory.  This will download and install all of the 3rd party javascript, css, and related files into a directory `bower_components`.

```
$ bower install
```

#### Mocha

To execute the server-side mocha tests from the command line you will want to install mocha globally:

```
$ npm install -g mocha
```

### Building Storeroom83

There is a pre-configured Gruntfile with some tasks pre-defined for building the application.  Run:

```
$ grunt build
```

This will execute several tasks including cleaning any existing files, copying resources to the public (i.e. build) directory, compiling less files into css and copying, and concatenating application javascript files into a small number of files that are referenced by the index.html page.

### Starting Node

To start node, run the following command:

```
$ npm start
```

You should see:

```
Server listening on port 3000
```

Navigate to [http://localhost:3000](http://localhost:3000)


## Running Tests

To run unit tests you can execute the "test" grunt task:

```
$ grunt test
```

This will execute the unit client side Jasmine tests (note spec files are co-mingled in the src/app directory next to production code per [Google's new recommended file layout](http://blog.angularjs.org/2014/02/an-angularjs-style-guide-and-best.html).  It will do so in a headless browser (PhantomJS).

Grunt is not yet configured to execute the server-side mocha tests (coming soon). In the meantime, you can execute the mocha tests from the command line.  Currently, there are only 2 mocha tests in the ./test directory.

```
$ mocha
```

## Development Workflow

Running the default grunt task will build the files and create "watchers" on the various files in the src directory.  If any of these files change, its associated grunt task is executed (such as compiling less files into public css directory or concatenating application javascript files into the public/js directory).  Also, whenever any javascript files change, the karma test runner will execute the unit tests and output the results in the terminal.

### Webstorm

[Webstorm](http://www.jetbrains.com) is a fantastic IDE will outstanding support for all of these technologies.  Version 8 has improved support for angular js and it comes will some outstanding tools and support for Grunt and Karma.  It is highly recommended.





