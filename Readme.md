## Backend Technologies
	Node JS
	Mongo DB

Please Install Mongo DB and create a database mydb and
Make a collection named admin by following commands:

mongod --dbpath . // my going in dir where u have to create database

in new tab open a mongo client 
and type foll commands ::

	use mydb
	db.admin.insert("username":"admin","password":"123");
// now u can use this to login in site ...

always start your mongodb before trying the app ..
	mongod --dbpath .

then start the main app by following command

	sudo node bin/www
then u can assess the app at

	localhost:3000

## Front End Technologies

	Angular JS
	J Query
	








