--- 
wordpress_id: 35
title: MySQL table types and foreign key constraints
wordpress_url: http://bucionrails.com/?p=35
layout: post
---
Uff, I have recently spent some time checking foreign key constraints in MySQL and I got a bit upset. The MySQL docs tell you that <a href="http://dev.mysql.com/doc/refman/5.0/en/innodb-foreign-key-constraints.html">InnoDB tables support foreign key constraints</a> but that's not the same as saying MyISAM tables do not. More importantly, an error (or at least a warning) should be raised so that I am not relying on something that seems to be there when in fact it is not.

Here is the raw SQL:

<pre lang="sql">
CREATE TABLE `drivers` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(100)
);


CREATE TABLE `cars` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `plate_number` VARCHAR(12),
  `driver_id` INT,
  FOREIGN KEY (`driver_id`) REFERENCES `drivers`(`id`) ON DELETE CASCADE
);

INSERT INTO drivers(name) VALUES ('bob');
INSERT INTO drivers(name) VALUES ('alice');
INSERT INTO cars(plate_number, driver_id) VALUES ('bbb', 1);
INSERT INTO cars(plate_number, driver_id) VALUES ('ooo', 1);
INSERT INTO cars(plate_number, driver_id) VALUES ('aaa', 2);
INSERT INTO cars(plate_number, driver_id) VALUES ('lll', 2);
</pre>

<pre lang="shell">
mysql> delete from drivers where id=1;
Query OK, 1 row affected (0.00 sec)

mysql> select * from cars;
+----+--------------+-----------+
| id | plate_number | driver_id |
+----+--------------+-----------+
|  1 | bbb          |         1 | 
|  2 | ooo          |         1 | 
|  3 | aaa          |         2 | 
|  4 | lll          |         2 | 
+----+--------------+-----------+
4 rows in set (0.00 sec)
</pre>

<pre lang="sql">
CREATE TABLE `drivers` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(100)
) ENGINE=INNODB;


CREATE TABLE `cars` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `plate_number` VARCHAR(12),
  `driver_id` INT,
  FOREIGN KEY (`driver_id`) REFERENCES `drivers`(`id`) ON DELETE CASCADE
) ENGINE=INNODB;

INSERT INTO drivers(name) VALUES ('bob');
INSERT INTO drivers(name) VALUES ('alice');
INSERT INTO cars(plate_number, driver_id) VALUES ('bbb', 1);
INSERT INTO cars(plate_number, driver_id) VALUES ('ooo', 1);
INSERT INTO cars(plate_number, driver_id) VALUES ('aaa', 2);
INSERT INTO cars(plate_number, driver_id) VALUES ('lll', 2);
</pre>

<pre lang="shell">
mysql> delete from drivers where id=1;
Query OK, 1 row affected (0.00 sec)

mysql> select * from cars;
+----+--------------+-----------+
| id | plate_number | driver_id |
+----+--------------+-----------+
|  3 | ppp          |         2 | 
|  4 | eee          |         2 | 
+----+--------------+-----------+
2 rows in set (0.00 sec)
</pre>

I know very well one should <a href="http://bucionrails.com/2008/10/22/postgresql-pg_hbaconf-authentication/">read the manual before complaining</a> but I also think software should complain if asked something which it is not capable of doing. -1 for MySQL.
