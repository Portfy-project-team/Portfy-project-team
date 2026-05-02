CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100) NOT NULL,
  password TEXT NOT NULL
);

INSERT INTO users (email, password)
VALUES ('test@mail.com', '1234');