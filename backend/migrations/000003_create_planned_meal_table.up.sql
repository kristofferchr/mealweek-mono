CREATE TABLE IF NOT EXISTS planned_meal
(
    id    serial not null,
    meal_id integer not null references meal(id),
    user_id integer not null references user_info(id),
    date DATE not null
);


