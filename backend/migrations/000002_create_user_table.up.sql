CREATE TABLE IF NOT EXISTS user_info
(
    id    serial not null
        constraint user_pk primary key,
    email varchar(255),
    password varchar(255),
    created_date  TIMESTAMP,
    modified_date TIMESTAMP,
    constraint user_name_unique unique (email)
);


