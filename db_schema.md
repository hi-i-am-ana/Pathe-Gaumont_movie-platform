## Table: Users

### users

| `Column Name` | `Type`      | `Constrains`    | `Description` |
| ------------- | ----------- | --------------- | ------------- |
| user_id       | INT         | PRIMARY KEY     |               |
| firstname     | VARCHAR(50) | NOT NULL        |               |
| lastname      | VARCHAR(50) | NOT NULL        |               |
| email         | VARCHAR(50) | NOT NULL UNIQUE |               |
| password      | CHAR(60)    | NOT NULL        |               |
| is_active     | BOOLEAN     | NOT NULL        |               |

## Table: Ratings

### ratings

| `Column Name` | `Type`      | `Constrains`                                  | `Description` |
| ------------- | ----------- | --------------------------------------------- | ------------- |
| rating_id     | INT         | PRIMARY KEY                                   |               |
| movie_id      | INT         | NOT NULL                                      |               |
| user_id       | INT         | FOREIGN KEY REFERENCE users(user_id) NOT NULL |               |
| rating_value  | INT         | NOT NULL CHECK (rating_value BETWEEN 0 AND 5) |               |
| create_at     | TIMESTAMPTZ |                                               |               |
| update_at     | TIMESTAMPTZ |                                               |               |

## Table: Email Confirmation

### email_confirmation

| `Column Name` | `Type`      | `Constrains`                                         | `Description` |
| ------------- | ----------- | ---------------------------------------------------- | ------------- |
| hash_id       | INT         | PRIMARY KEY                                          |               |
| email         | VARCHAR(50) | FOREIGN KEY REFERENCE users(user_id) NOT NULL UNIQUE |               |
| hash          | CHAR(60)    | NOT NULL                                             |               |

## Table: Password Reset

### password_reset

| `Column Name` | `Type`      | `Constrains`                                         | `Description` |
| ------------- | ----------- | ---------------------------------------------------- | ------------- |
| hash_id       | INT         | PRIMARY KEY                                          |               |
| email         | VARCHAR(50) | FOREIGN KEY REFERENCE users(user_id) NOT NULL UNIQUE |               |
| hash          | CHAR(60)    | NOT NULL                                             |               |
