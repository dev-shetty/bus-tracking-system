-- Create tables
DROP TABLE IF EXISTS route CASCADE;
DROP TABLE IF EXISTS bus CASCADE;
DROP TABLE IF EXISTS driver CASCADE;
DROP TABLE IF EXISTS institution CASCADE;
DROP TABLE IF EXISTS parent_student CASCADE;
DROP TABLE IF EXISTS student CASCADE;
DROP TABLE IF EXISTS parent CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'normal' CHECK (role IN ('normal', 'government', 'institution'))
);

-- Create institution table
CREATE TABLE institution (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact VARCHAR(20) NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL
);

-- Create driver table
CREATE TABLE driver (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    mobile VARCHAR(20) NOT NULL
);

-- Create bus table
CREATE TABLE bus (
    id VARCHAR(50) PRIMARY KEY NOT NULL,
    institution_id INTEGER NOT NULL,
    driver_id INTEGER NOT NULL,
    device_id VARCHAR(50) NOT NULL,
    FOREIGN KEY (institution_id) REFERENCES institution(id),
    FOREIGN KEY (driver_id) REFERENCES driver(id)
);

-- Create route table
CREATE TABLE route (
    id SERIAL PRIMARY KEY,
    bus_id VARCHAR(50) NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    address VARCHAR(255) NOT NULL,
    FOREIGN KEY (bus_id) REFERENCES bus(id)
);

-- Create parent table
CREATE TABLE parent (
    phone VARCHAR(20) PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Create student table
CREATE TABLE student (
    id SERIAL,
    name VARCHAR(255) NOT NULL,
    usn VARCHAR(255) PRIMARY KEY,
    year INTEGER NOT NULL,
    home_latitude DECIMAL(10, 7) NOT NULL,
    home_longitude DECIMAL(10, 7) NOT NULL,
    home_address VARCHAR(255) NOT NULL,
    bus_id VARCHAR(50) NOT NULL,
    institution_id INTEGER NOT NULL,
    FOREIGN KEY (bus_id) REFERENCES bus(id),
    FOREIGN KEY (institution_id) REFERENCES institution(id)
);

-- Create parent_student relationship table
CREATE TABLE parent_student (
    student_usn VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    PRIMARY KEY (student_usn, phone),
    FOREIGN KEY (student_usn) REFERENCES student(usn),
    FOREIGN KEY (phone) REFERENCES parent(phone)
);


-- Insert data into tables

CREATE OR REPLACE FUNCTION seed_bus_tracking_data() RETURNS VOID AS $$
BEGIN
    -- These 3 are mandatory, then you can insert from sahyadri_seed.sql
    -- Insert institutions
    INSERT INTO institution (id, name, contact, latitude, longitude) VALUES (1, 'Sahyadri College of Engineering and Management', '08242277333', 12.868533721052383, 74.9254481089104);

    -- Insert drivers
    INSERT INTO driver (id, name, mobile) VALUES (1, 'Ramesh Kumar', '9876543210');

    -- Insert buses
    INSERT INTO bus (id, institution_id, driver_id, device_id) VALUES ('KA19AE3048', 1, 1, '0bd16d97-78aa-438e-9b94-dd85b5452ae3');

    -- Insert users
    -- This can also be done using the Auth API
    INSERT INTO users (name, email, password, role) VALUES 
        ('John Doe', 'john@example.com', 'password123', 'normal'),
        ('Gov Admin', 'gov@gov.in', 'gov123', 'government'),
        ('Institution Admin', 'admin@sahyadri.edu.in', 'admin123', 'institution');


    -- !! Use the Sahyadri SQL Data to Populate the students, parents, and parent_student tables
    -- Otherwise you can uncomment the following code to insert the data manually

    -- -- Insert parents
    -- INSERT INTO parent (phone, name) VALUES
    --     ('9876541203', 'Ramesh Kumar'),
    --     ('9876541204', 'Rajesh Kumar');

    -- -- Insert students
    -- INSERT INTO student (id, name, usn, year, home_latitude, home_longitude, home_address, bus_id, institution_id) VALUES
    --     (1, 'Deveesh Shetty', '4SF21CS146', 4, 40.7300, -74.0100, '123 Main St, New York, NY 10001', 7, 1),
    --     (2, 'Rohan', '4SF21CS127', 4, 34.0600, -118.2500, '456 Elm St, Los Angeles, CA 90001', 7, 1);

    -- -- Insert parent_student relationships
    -- INSERT INTO parent_student (student_id, phone) VALUES
    --     (1, '9876541203'),
    --     (2, '9876541204');

      -- Populating routes
    -- INSERT INTO route (bus_id, latitude, longitude, address)
    --     SELECT DISTINCT 'KA19AE3048', home_latitude, home_longitude, home_address
    --     FROM student;


END;
$$
 LANGUAGE plpgsql;

-- Execute the seed function
SELECT seed_bus_tracking_data();