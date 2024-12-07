-- Create tables

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
    id SERIAL PRIMARY KEY,
    bus_no INTEGER NOT NULL,
    institution_id INTEGER NOT NULL,
    driver_id INTEGER NOT NULL,
    device_id VARCHAR(50) NOT NULL,
    FOREIGN KEY (institution_id) REFERENCES institution(id),
    FOREIGN KEY (driver_id) REFERENCES driver(id)
);

-- Create device table
CREATE TABLE device (
    id VARCHAR(50) PRIMARY KEY,
    bus_id INTEGER NOT NULL,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    battery_status VARCHAR(50) NOT NULL,
    signal_strength INTEGER NOT NULL,
    FOREIGN KEY (bus_id) REFERENCES bus(id)
);

-- Create route table
CREATE TABLE route (
    id SERIAL PRIMARY KEY,
    bus_id INTEGER NOT NULL,
    source_latitude DECIMAL(10, 7) NOT NULL,
    source_longitude DECIMAL(10, 7) NOT NULL,
    destination_latitude DECIMAL(10, 7) NOT NULL,
    destination_longitude DECIMAL(10, 7) NOT NULL,
    FOREIGN KEY (bus_id) REFERENCES bus(id)
);

-- Create parent table
CREATE TABLE parent (
    phone VARCHAR(20) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL
);

-- Create student table
CREATE TABLE student (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    home_latitude DECIMAL(10, 7) NOT NULL,
    home_longitude DECIMAL(10, 7) NOT NULL,
    bus_id INTEGER NOT NULL,
    institution_id INTEGER NOT NULL,
    FOREIGN KEY (bus_id) REFERENCES bus(id),
    FOREIGN KEY (institution_id) REFERENCES institution(id)
);

-- Create parent_student relationship table
CREATE TABLE parent_student (
    student_id INTEGER NOT NULL,
    phone VARCHAR(20) NOT NULL,
    PRIMARY KEY (student_id, phone),
    FOREIGN KEY (student_id) REFERENCES student(id),
    FOREIGN KEY (phone) REFERENCES parent(phone)
);

-- Create bus_location table
-- timestamp is primary key because timescaledb creates partitioning based on time
CREATE TABLE bus_location (
    id SERIAL,
    bus_id INTEGER NOT NULL,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    speed INTEGER NOT NULL,
    course INTEGER NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (bus_id, timestamp),
    FOREIGN KEY (bus_id) REFERENCES bus(id)
);

-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  institution_id INTEGER REFERENCES institution(id)
);

-- Insert data into tables

CREATE OR REPLACE FUNCTION seed_bus_tracking_data() RETURNS VOID AS $$
BEGIN
    -- Insert institutions
    INSERT INTO institution (id, name, contact, latitude, longitude) VALUES
        (1, 'City School', '123-456-7890', 40.7128, -74.0060),
        (2, 'County High', '987-654-3210', 34.0522, -118.2437);

    -- Insert drivers
    INSERT INTO driver (id, name, mobile) VALUES
        (1, 'John Doe', '555-1234'),
        (2, 'Jane Smith', '555-5678');

    -- Insert buses
    INSERT INTO bus (id, bus_no, institution_id, driver_id, device_id) VALUES
        (1, 101, 1, 1, 'DEV001'),
        (2, 102, 2, 2, 'DEV002');

    -- Insert devices
    INSERT INTO device (id, bus_id, type, status, battery_status, signal_strength) VALUES
        ('DEV001', 1, 'GPS', 'Active', 'Full', 5),
        ('DEV002', 2, 'GPS', 'Active', 'Medium', 4);

    -- Insert routes
    INSERT INTO route (id, bus_id, source_latitude, source_longitude, destination_latitude, destination_longitude) VALUES
        (1, 1, 40.7128, -74.0060, 40.7589, -73.9851),
        (2, 2, 34.0522, -118.2437, 34.1478, -118.1445);

    -- Insert parents
    INSERT INTO parent (phone, name, email) VALUES
        ('555-1111', 'Alice Johnson', 'alice@email.com'),
        ('555-2222', 'Bob Williams', 'bob@email.com');

    -- Insert students
    INSERT INTO student (id, name, home_latitude, home_longitude, bus_id, institution_id) VALUES
        (1, 'Charlie Johnson', 40.7300, -74.0100, 1, 1),
        (2, 'Diana Williams', 34.0600, -118.2500, 2, 2);

    -- Insert parent_student relationships
    INSERT INTO parent_student (student_id, phone) VALUES
        (1, '555-1111'),
        (2, '555-2222');

    -- Insert bus_location data
    INSERT INTO bus_location (id, bus_id, latitude, longitude, speed, course, timestamp) VALUES
        (1, 1, 40.7200, -74.0080, 30, 90, NOW()),
        (2, 2, 34.0550, -118.2460, 25, 180, NOW());
END;
$$
 LANGUAGE plpgsql;

-- Execute the seed function
SELECT seed_bus_tracking_data();