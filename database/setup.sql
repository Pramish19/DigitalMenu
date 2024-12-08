CREATE DATABASE hotel_menu;

USE hotel_menu;

CREATE TABLE dishes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

-- Yo chai sample dishes
INSERT INTO dishes (category, name, description, price) VALUES
('Appetisers', 'Spring Rolls', 'Crispy rolls filled with vegetables and sweet chili sauce.', 6.00),
('Appetisers', 'Thai Dumplings', 'Steamed dumplings with chicken and vegetable filling.', 7.50),
('Main Dishes', 'Pad Thai', 'Stir-fried rice noodles with shrimp, tofu, peanuts, and bean sprouts.', 12.00),
('Main Dishes', 'Basil Chicken', 'Stir-fried chicken with Thai basil, chili, and vegetables.', 12.00),
('Fried Rice', 'Thai Fried Rice', 'Fried rice with chicken, shrimp, or vegetables.', 11.00),
('Fried Rice', 'Pineapple Fried Rice', 'Fried rice with pineapple, cashews, and choice of meat or tofu.', 12.50);



CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('staff', 'admin') NOT NULL
);


CREATE TABLE tables (
    id INT AUTO_INCREMENT PRIMARY KEY,
    table_number INT NOT NULL UNIQUE,
    status ENUM('available', 'occupied') NOT NULL DEFAULT 'available'
);



