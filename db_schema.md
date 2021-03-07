# Table: Users

| `Column Name` | `Type`      | `Constrains`    | `Description` |
| ------------- | ----------- | --------------- | ------------- |
| user_id       | INT         | PRIMARY KEY     |               |
| firstname     | VARCHAR(50) | NOT NULL        |               |
| lastname      | VARCHAR(50) | NOT NULL        |               |
| email         | VARCHAR(50) | NOT NULL UNIQUE |               |
| password      | CHAR(64)    | NOT NULL        |               |

# Table: Ratings

| `Column Name` | `Type`      | `Constrains`                                  | `Description` |
| ------------- | ----------- | --------------------------------------------- | ------------- |
| movie_id      | INT         | PRIMARY KEY                                   |               |
| user_id       | INT         | FOREIGN KEY                                   |               |
| rating_value  | INT         | NOT NULL CHECK (rating_value BETWEEN 0 AND 5) |               |
| create_at     | TIMESTAMPTZ |                                               |               |
| update_at     | TIMESTAMPTZ |                                               |               |
