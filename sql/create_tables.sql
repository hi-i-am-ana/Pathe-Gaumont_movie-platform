DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
    user_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    password CHAR(60) NOT NULL,
    is_active BOOLEAN NOT NULL
);

DROP TABLE IF EXISTS ratings; 

CREATE TABLE IF NOT EXISTS ratings (
    rating_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    movie_id INT NOT NULL,
    user_id INT NOT NULL,
    rating_value INT NOT NULL CHECK (rating_value BETWEEN 0 AND 5),
    create_at TIMESTAMPTZ,
    update_at TIMESTAMPTZ,

    FOREIGN KEY(user_id)
      REFERENCES users(user_id)
      ON DELETE CASCADE
);

DROP TABLE IF EXISTS email_confirmation;

CREATE TABLE IF NOT EXISTS email_confirmation (
    hash_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email VARCHAR(50) NOT NULL UNIQUE,
    hash CHAR(60) NOT NULL,
    create_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    FOREIGN KEY(email) 
      REFERENCES users(email)
      ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS password_reset (
    hash_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email VARCHAR(50) NOT NULL UNIQUE,
    hash CHAR(60) NOT NULL,

    FOREIGN KEY(email) 
      REFERENCES users(email)
      ON DELETE CASCADE
);