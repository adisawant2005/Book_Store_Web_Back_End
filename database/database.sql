-- Active: 1721880385002@postgres:pgsql@localhost:5432/book_store
create table items (
	item_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	item_name VARCHAR(50) NOT NULL,
	item_description TEXT,
	item_price INT NOT NULL,
	item_category VARCHAR(50) NOT NULL,
	item_rating INT,
	item_reviews INT,
	item_image_url VARCHAR(1000),
	item_seller_id UUID NOT NULL REFERENCES account(user_id),
	item_quantity INT NOT NULL DEFAULT 0
);
insert into items (item_name, item_description, item_price, item_category, item_rating, item_reviews, item_image_url, item_seller_id, item_quantity) values ('Book_name', 'Lorem ipsum coding', 800, 'Space', 4, 520, 'http://localhost:3000/Items-images/atlas.jpg', '234ca2a4-0182-4a84-8a47-0356cc139bba', 7);
insert into items (item_name, item_description, item_price, item_category, item_rating, item_reviews, item_image_url, item_seller_id, item_quantity) values ('Why_Bharat_Matters', 'The India Way: Strategies for an Uncertain World’ by Dr S Jaishankar', 300, 'World Affairs', 5, 794, 'http://localhost:3000/Items-images/Why_Bharat_Matters.jpg', '234ca2a4-0182-4a84-8a47-0356cc139bba', 10);
insert into items (item_name, item_description, item_price, item_category, item_rating, item_reviews, item_image_url, item_seller_id, item_quantity) values ('Ramayana', 'Lorem ipsum chanting', 500, 'Spritual', 5, 2610, 'http://localhost:3000/Items-images/ramayana.jpg', '234ca2a4-0182-4a84-8a47-0356cc139bba', 5);
insert into items (item_name, item_description, item_price, item_category, item_rating, item_reviews, item_image_url, item_seller_id, item_quantity) values ('Rich Dad & Poor Dad', 'Lorem ipsum thinking', 900, 'Economics', 4, 2340, 'http://localhost:3000/Items-images/RichDad&PoorDad.jpg', '234ca2a4-0182-4a84-8a47-0356cc139bba', 10);
insert into items (item_name, item_description, item_price, item_category, item_rating, item_reviews, item_image_url, item_seller_id, item_quantity) values ('Stories Behind The Images', 'Lorem ipsum climbing', 600, 'Hill Climbing', 3, 870, 'http://localhost:3000/Items-images/StoriesBTI_3DCover.jpg', '234ca2a4-0182-4a84-8a47-0356cc139bba', 12);
insert into items (item_name, item_description, item_price, item_category, item_rating, item_reviews, item_image_url, item_seller_id) values ('Atlas', 'Twinkle, twinkle, little star,
How I wonder what you are!
Up above the world so high,
Like a diamond in the sky.

When the blazing sun is gone,
When he nothing shines upon,
Then you show your little light,
Twinkle, twinkle, all the night.', 800, 'Horror', 4, 860, 'http://localhost:3000/Items-images/atlas.jpg', '234ca2a4-0182-4a84-8a47-0356cc139bba');






create table account (
	user_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	email VARCHAR(50) UNIQUE NOT NULL,
	password VARCHAR(50) NOT NULL,
	first_name VARCHAR(50) NOT NULL,
	last_name VARCHAR(50) NOT NULL,
	gender VARCHAR(50) NOT NULL,
	country VARCHAR(50) NOT NULL,
	city VARCHAR(50) NOT NULL,
	street_address VARCHAR(50) NOT NULL,
	postal_code VARCHAR(50) NOT NULL,
	phone_number VARCHAR(50) NOT NULL,
	birthdate DATE NOT NULL,
	registration_date DATE DEFAULT CURRENT_DATE,
	profile_picture_address VARCHAR(1000)
);
insert into account ( email, password, first_name, last_name, gender, country, city, street_address, postal_code, phone_number, birthdate, registration_date, profile_picture_address)
values ('lfydo0@sitemeter.com', '12345678', 'Lovell', 'Fydo', 'Male', 'Japan', 'Hirado', '13782 Roxbury Trail', '276-0017', '726-844-7617', '1908-10-22', '2013-02-11', 'http://localhost:3000');

insert into account ( email, password, first_name, last_name, gender, country, city, street_address, postal_code, phone_number, birthdate, registration_date, profile_picture_address)
values ('adisawant@gmail.com', '12345678', 'Lovell', 'Fydo', 'Male', 'Japan', 'Hirado', '13782 Roxbury Trail', '276-0017', '726-844-7617', '1908-10-22', '2013-02-11', 'http://localhost:3000');

insert into account ( email, password, first_name, last_name, gender, country, city, street_address, postal_code, phone_number, birthdate, registration_date, profile_picture_address)
values ('adisawant123@gmail.com', '123', 'Aditya', 'Sawant', 'Male', 'Japan', 'Hirado', '13782 Roxbury Trail', '276-0017', '726-844-7617', '1908-10-22', '2013-02-11', 'http://localhost:3000');


create table transactions (
transaction_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
transaction_date DATE NOT NULL,
customer_id UUID NOT NULL REFERENCES account(user_id),
product_id UUID NOT NULL,
total_price DECIMAL(10,2) NOT NULL,
payment_method VARCHAR(50) NOT NULL,
payment_status VARCHAR(8) NOT NULL,
city VARCHAR(50) NOT NULL,
state VARCHAR(50) NOT NULL,
country VARCHAR(50) NOT NULL,
shipping_cost DECIMAL(10,2) NOT NULL,
tax_rate DECIMAL(10,2) NOT NULL,
tax_amount DECIMAL(10,2) NOT NULL,
card_number VARCHAR(25),
card_cvv VARCHAR(4),
card_expiry_date DATE,
upi_id VARCHAR(50)
);

insert into transactions (transaction_date, customer_id, product_id, total_price, payment_method, payment_status, city, state, country, shipping_cost, tax_rate, tax_amount, card_expiry_date)
values ('2022/05/21', '234ca2a4-0182-4a84-8a47-0356cc139bba', 'cc9fc759-2c48-403c-9c32-21688f27a13a', 9121794, 'debit card', 'refunded', 'Galatás', 'Albela', 'Greece', 9808, 16, 76463, '1111-11-11');

create table orders (
order_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
customer_id UUID REFERENCES account(user_id),
product_id UUID REFERENCES items(item_id),
order_date DATE,
transaction_id UUID REFERENCES transactions(transaction_id),
quantity INT,
unit_price INT,
shipping_address VARCHAR(200),
shipping_city VARCHAR(50),
shipping_state VARCHAR(50),
shipping_zip_code VARCHAR(50),
shipping_country VARCHAR(50),
shipping_method VARCHAR(8),
order_status VARCHAR(10),
estimated_delivery_date DATE,
actual_delivery_date DATE,
product_image_address  VARCHAR(1000) NOT NULL,
product_name  VARCHAR(50),
product_description  VARCHAR(500)
);

insert into orders (customer_id, product_id, order_date, transaction_id, quantity, unit_price,
 shipping_address, shipping_city, shipping_state, shipping_zip_code, shipping_country, shipping_method, order_status, estimated_delivery_date, actual_delivery_date, product_image_address, product_name, product_description)
values ('234ca2a4-0182-4a84-8a47-0356cc139bba', 'cc9fc759-2c48-403c-9c32-21688f27a13a', '2021/02/12','21b8159c-4b83-4b89-9bc5-29ad74e21d23',4, 50, '492 Meadow Vale Place', 'Gocoton', null, '6337', 'Philippines', 'Express', 'Shipped', '2021/04/05', '2021/04/06', 'http://localhost:3000/Items-images/atlas.jpg', 'lorem', 'lorem ipsum boooooooooooooom');

create table cart (
product_id UUID REFERENCES items(item_id),
customer_id UUID REFERENCES account(user_id),
quantity INT DEFAULT 1
);
insert into cart (product_id, customer_id, quantity) values ('cc9fc759-2c48-403c-9c32-21688f27a13a', '234ca2a4-0182-4a84-8a47-0356cc139bba', 3);

