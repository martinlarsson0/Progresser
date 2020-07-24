CREATE DATABASE progresser_dev;

\c progresser_dev;

CREATE EXTENSION citext;
CREATE DOMAIN email_type AS citext
  CHECK ( value ~ '^[a-zA-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$' );
CREATE TYPE difficulty AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE exercise_type AS ENUM ('time', 'weight');

CREATE TABLE progresser_user (
    id SERIAL PRIMARY KEY NOT NULL,
    email email_type UNIQUE CHECK (LENGTH(email) > 0) NOT NULL,
    pwd_hash TEXT CHECK (LENGTH(pwd_hash) > 0) NOT NULL
);
ALTER TABLE progresser_user OWNER TO dev;

CREATE TABLE user_info (
    user_id INTEGER PRIMARY KEY NOT NULL,
    weight INTEGER CHECK (weight > -1) NOT NULL,
    height INTEGER CHECK (height > -1) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES progresser_user (id)
);
ALTER TABLE user_info OWNER TO dev;

CREATE TABLE user_workout (
    id SERIAL PRIMARY KEY NOT NULL,
    user_id INTEGER NOT NULL,
    name VARCHAR(255) CHECK (LENGTH(name) > 0) NOT NULL,
    description VARCHAR(1000),
    rating REAL,
    latest_perceived_difficulty difficulty,
    latest_date TIMESTAMP WITH TIME ZONE NOT NULL,
    times_completed INTEGER CHECK (times_completed > -1) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES progresser_user (id)
);
ALTER TABLE user_workout OWNER TO dev;

CREATE TABLE workout_exercise (
    id SERIAL PRIMARY KEY NOT NULL,
    user_id INTEGER NOT NULL,
    workout_id INTEGER NOT NULL,
    name VARCHAR(255) CHECK (LENGTH(name) > 0) NOT NULL,
    description VARCHAR(1000),
    type exercise_type NOT NULL,
    latest_perceived_difficulty difficulty,
    FOREIGN KEY (user_id) REFERENCES progresser_user (id),
    FOREIGN KEY (workout_id) REFERENCES user_workout (id)
);
ALTER TABLE workout_exercise OWNER TO dev;

CREATE TABLE time_exercise (
    id SERIAL PRIMARY KEY NOT NULL,
    user_id INTEGER NOT NULL,
    workout_id INTEGER NOT NULL,
    exercise_id INTEGER NOT NULL,
    duration INTEGER NOT NULL,
    distance REAL DEFAULT (0) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES progresser_user (id),
    FOREIGN KEY (workout_id) REFERENCES user_workout (id),
    FOREIGN KEY (exercise_id) REFERENCES workout_exercise (id)
);
ALTER TABLE time_exercise OWNER TO dev;

CREATE TABLE weight_exercise (
    id SERIAL PRIMARY KEY NOT NULL,
    user_id INTEGER NOT NULL,
    workout_id INTEGER NOT NULL,
    exercise_id INTEGER NOT NULL,
    sets INTEGER CHECK (sets > -1) NOT NULL,
    reps INTEGER CHECK (reps > -1) NOT NULL,
    weight REAL NOT NULL,
    FOREIGN KEY (user_id) REFERENCES progresser_user (id),
    FOREIGN KEY (workout_id) REFERENCES user_workout (id),
    FOREIGN KEY (exercise_id) REFERENCES workout_exercise (id)
);
ALTER TABLE weight_exercise OWNER TO dev;

CREATE TABLE user_workout_result (
    id SERIAL PRIMARY KEY NOT NULL,
    user_id INTEGER NOT NULL,
    workout_id INTEGER NOT NULL,
    perceived_difficulty difficulty,
    note VARCHAR(255),
    latest_date TIMESTAMP WITH TIME ZONE DEFAULT (current_timestamp AT TIME ZONE 'UTC') NOT NULL,
    FOREIGN KEY (user_id) REFERENCES progresser_user (id),
    FOREIGN KEY (workout_id) REFERENCES user_workout (id)
);
ALTER TABLE user_workout_result OWNER TO dev;

CREATE TABLE workout_exercise_result (
    id SERIAL PRIMARY KEY NOT NULL,
    user_id INTEGER NOT NULL,
    workout_result_id INTEGER NOT NULL,
    perceived_difficulty difficulty,
    note VARCHAR(255),
    type exercise_type NOT NULL,
    FOREIGN KEY (user_id) REFERENCES progresser_user (id),
    FOREIGN KEY (workout_result_id) REFERENCES user_workout_result (id)
);
ALTER TABLE workout_exercise_result OWNER TO dev;

CREATE TABLE time_exercise_result (
    id SERIAL PRIMARY KEY NOT NULL,
    user_id INTEGER NOT NULL,
    workout_result_id INTEGER NOT NULL,
    exercise_result_id INTEGER NOT NULL,
    duration INTEGER NOT NULL,
    distance REAL NOT NULL,
    FOREIGN KEY (user_id) REFERENCES progresser_user (id),
    FOREIGN KEY (workout_result_id) REFERENCES user_workout_result (id),
    FOREIGN KEY (exercise_result_id) REFERENCES workout_exercise_result (id)
);
ALTER TABLE time_exercise_result OWNER TO dev;


CREATE TABLE weight_exercise_result (
    id SERIAL PRIMARY KEY NOT NULL,
    user_id INTEGER NOT NULL,
    workout_result_id INTEGER NOT NULL,
    exercise_result_id INTEGER NOT NULL,
    sets INTEGER CHECK (sets > -1) NOT NULL,
    reps INTEGER CHECK (reps > -1) NOT NULL,
    weight REAL NOT NULL,
    FOREIGN KEY (user_id) REFERENCES progresser_user (id),
    FOREIGN KEY (workout_result_id) REFERENCES user_workout_result (id),
    FOREIGN KEY (exercise_result_id) REFERENCES workout_exercise_result (id)
);
ALTER TABLE weight_exercise_result OWNER TO dev;

ALTER DATABASE progresser_dev OWNER TO dev;