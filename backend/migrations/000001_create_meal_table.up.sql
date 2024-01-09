create table IF NOT EXISTS meal
(
    id            serial not null
        constraint meal_pk primary key,
    name          varchar(255),
    created_date  TIMESTAMP,
    created_by    integer,
    modified_date TIMESTAMP,
    modified_by   integer,
    constraint meal_name_constraint unique (name, created_by)
);


