create table items (
	item_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	item_name VARCHAR(50) NOT NULL,
	item_description TEXT,
	item_price INT NOT NULL,
	item_category VARCHAR(20) NOT NULL,
	item_rating INT,
	item_reviews INT,
	item_image_url VARCHAR(1000)
);
insert into items (item_name, item_description, item_price, item_category, item_rating, item_reviews, item_image_url) values ('Blala', 'lorem ipsum heee.', 38068, 'Horror', 4, 860, 'http://localhost:3000/items-images/1.jpg');

create table account (
	user_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	email VARCHAR(50) UNIQUE NOT NULL,
	password VARCHAR(50) NOT NULL,
	first_name VARCHAR(50) NOT NULL,
	last_name VARCHAR(50) NOT NULL,
	age INT NOT NULL,
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
insert into account ( email, password, first_name, last_name, age, gender, country, city, street_address, postal_code, phone_number, birthdate, registration_date, profile_picture_address)
values ('lfydo0@sitemeter.com', '12345678', 'Lovell', 'Fydo', 30, 'Male', 'Japan', 'Hirado', '13782 Roxbury Trail', '276-0017', '726-844-7617', '1908-10-22', '2013-02-11', 'http://localhost:3000');

create table transactions (
transaction_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
transaction_date DATE NOT NULL,
customer_id UUID NOT NULL REFERENCES account(user_id),
product_id UUID NOT NULL REFERENCES items(item_id),
total_price INT NOT NULL,
payment_method VARCHAR(50) NOT NULL,
payment_status VARCHAR(8) NOT NULL,
city VARCHAR(50) NOT NULL,
state VARCHAR(50) NOT NULL,
country VARCHAR(50) NOT NULL,
shipping_cost INT NOT NULL,
tax_rate INT NOT NULL,
tax_amount INT NOT NULL
);

insert into transactions (transaction_date, customer_id, product_id, total_price, payment_method, payment_status, city, state, country, shipping_cost, tax_rate, tax_amount)
values ('2022/05/21', '618b5735-9b1b-4b0c-bc6b-0f4d7b00434f', '7eec2196-f55c-4841-bf78-15e09aa9bb27', 9121794, 'debit card', 'refunded', 'Galatás', 'Albela', 'Greece', 9808, 16, 76463);

create table orders (
order_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
customer_id UUID REFERENCES account(user_id),
product_id UUID REFERENCES items(item_id),
order_date DATE,
transaction_id UUID REFERENCES transactions(transaction_id),
quantity INT,
unit_price INT,
total_price INT,
shipping_address VARCHAR(50),
shipping_city VARCHAR(50),
shipping_state VARCHAR(50),
shipping_zip_code VARCHAR(50),
shipping_country VARCHAR(50),
shipping_method VARCHAR(8),
order_status VARCHAR(10),
estimated_delivery_date DATE,
actual_delivery_date DATE,
customer_feedback TEXT,
customer_rating INT,
customer_comments TEXT
);

insert into orders (customer_id, product_id, order_date, transaction_id, quantity, unit_price,
total_price, shipping_address, shipping_city, shipping_state, shipping_zip_code, shipping_country, shipping_method, order_status, estimated_delivery_date, actual_delivery_date, customer_feedback, customer_rating, customer_comments)
values ('618b5735-9b1b-4b0c-bc6b-0f4d7b00434f', '7eec2196-f55c-4841-bf78-15e09aa9bb27', '2021/02/12','f9f6c96c-0718-4d16-b2bb-583b6bb8f4a0',4, 50, 200, '492 Meadow Vale Place', 'Gocoton', null, '6337', 'Philippines', 'Express', 'Shipped', '2021/04/05', '2021/04/06', 'Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.', 4, 'Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem.');

create table cart (
product_id UUID REFERENCES items(item_id),
customer_id UUID REFERENCES account(user_id),
quantity INT DEFAULT 1
);
insert into cart (product_id, customer_id, quantity) values ('7eec2196-f55c-4841-bf78-15e09aa9bb27', '618b5735-9b1b-4b0c-bc6b-0f4d7b00434f', 3);

