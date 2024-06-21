# MySCL

## What is MySCL?
(To be completely clear, MySCL IS NOT MySQL)

MySCL is a lightweight NoSQL database with caching capabilities. MySCL is also a open-source database
that is a implementation/re-written Redis and MongoDB combined. Lastly MySCL is a development database
not meant for production applications.

> [!WARNING]
> MySCL is still in the works and is one of my first projects. MySCL is not a production database!

## Version Support

### Linux

This database is made for Linux and is made in Linux.
All the steps in this documentation are made specifically and only for Linux.

### Windows

Try running WSL2 on your machine and running your project on WSL2.
(I tested it on WSL2, it does work as good as Linux)

### Unix (MacOS)

I haven't tested on Unix, it may work or not. The directory will be different for configuration
obviously. (Why are you using Unix for development)

## Setup Process

### Installing Server

Installing the MySCL Database Server is quite simple using the npm package 'myscl-server'. To install the
myscl-server package and use it, run the following command listed below.

```
sudo npm i myscl-server -g
```

### Running the Server

In order to run the MySCL DB Server, run the listed commands below in order to start the db server.

```
sudo myscl
sudo myscl kill
sudo myscl start
```

The server will by default run on port 8000 and on host 127.0.0.1.

### Configuring the database

All users must go to the configuration json file located in a certain directory. (THIS MAY VARY DEPENDING ON OS, CHECK SUPPORT VERSIONS)
The directory for the configuration is listed below this text.

```
/usr/local/lib/node_modules/myscl-server/db
```

If this directory doesn't exist, you have encountered a problem with npm and not the myscl-server package.
If it does exist, the config.json file will contain all the necessary options to change the server. This directory
also contains all the application data that your program will use like the databases, and collections/documents.

> [!CAUTION]
> Edit the cli.json file at your own risk. (Editting this file can corrupt the CLI and DB)
> However this file is not meant for users to edit!

After making any changes to the database, do remember to run the command:

```
sudo myscl restart
```