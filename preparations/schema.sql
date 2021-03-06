DROP DATABASE IF EXISTS spending;

CREATE DATABASE spending;

USE spending;

CREATE TABLE persons (
    id TINYINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE categories (
    id TINYINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE spendings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    person_id TINYINT UNSIGNED NOT NULL,
    cat_id TINYINT UNSIGNED NOT NULL,
    amount DECIMAL(8,2) UNSIGNED NOT NULL,
    made_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (person_id) REFERENCES persons(id),
    FOREIGN KEY (cat_id) REFERENCES categories(id)
);