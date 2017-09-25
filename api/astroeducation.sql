-- CREATE table Users
-- (
--     id int NOT NULL AUTO_INCREMENT UNIQUE,
--     username varchar(16) NOT NULL UNIQUE,
--     password_hash varchar(200) NOT NULL,
--     password_salt varchar(50)
-- );

-- CREATE table Assessment
-- (
--     id int NOT NULL AUTO_INCREMENT UNIQUE,
--     name varchar(100) NOT NULL,
--     max_score decimal,
--     min_score int
-- );

-- CREATE table Score
-- (
--     id int NOT NULL AUTO_INCREMENT UNIQUE,
--     user_id int NOT NULL,
--     assessment_id int NOT NULL,
--     score int NOT NULL,
--     FOREIGN KEY (user_id) REFERENCES Users(id),
--     FOREIGN KEY (assessment_id) REFERENCES Assessment(id)
-- );

CREATE table Users
(
id int
)