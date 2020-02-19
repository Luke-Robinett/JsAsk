drop database if exists test_db;
create database test_db;
use test_db;

create table users (
 id int not null AUTO_INCREMENT,
 username varchar(255) unique not null,
 email varchar(255) unique not null,
 password varchar(255) not null,
 primary key(id)
);
