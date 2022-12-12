CREATE TYPE USER_TYPE AS ENUM (
    'student', 'parent', 'admin', 'teacher'
    );
CREATE TYPE Marks AS ENUM (
    '1', '2', '3', '4','5'
    );
CREATE TYPE WORK_TYPE AS ENUM (
    'с/р', 'к/р', 'д/з'
    );

create table if not exists Users
(
    id         bigserial primary key,
    name       varchar(100) not null,
    surname    varchar(100) not null,
    patronymic varchar(100) not null,
    username   varchar(100) not null,
    password   varchar(100) not null,
    parent_id  BIGINT,
    type       USER_TYPE    NOT NULL
);

create table Journal
(
    id      bigserial primary key,
    user_ud BIGINT                  not null,
    subject BIGINT                  not null,
    mark    MARKS                   not null,
    type    WORK_TYPE               not null,
    date    timestamp default now() not null
);

create table Subject
(
    id         bigserial primary key,
    name       varchar(100) not null,
    teacher_id BIGINT       not null
);

create table Schedules
(
    id         bigserial primary key,
    class_id   BIGINT not null,
    subject_id bigint not null
);

create table Class
(
    id     bigserial primary key,
    number smallint not null,
    symbok char(1)  not null };

create table UserInClass
(
    id       bigserial primary key,
    user_id  bigint not null,
    class_id bigint not null
);



select *
from Users
where password = 'test_password'
  and username = 'test_username';


select *
from (select * from Journal where user_id = 1) jr
         left join (select * from Subject) sb
                   on jr.subject_id = sb.id;



select *
from (select class_id from UserInClass where user_id = 1) uic
         left join (select * from Schedules) sch
                   on sch.class_id = uic.class_id
         left join (select id, name from Subject) sb
                   on sch.subject_id = sb.id;


update Journal
set mark = '5'
where id = 1;

    
INSERT INTO Journal
    (user_id, subject_id, type, date)
VALUES (1, 1, 'к/р', '2022-10-13 19:42:11.128204 +00:00');


INSERT INTO Users
    (name, surname, patronymic, username, password, parent_id, type)
VALUES ('Igor', 'Ivanov', 'Ivanovich', 'IgorCool', '123456', NULL, 'student');

INSERT INTO Class
    (number, symbol)
VALUES (1, 'a');

INSERT INTO UserInClass
    (user_id, class_id)
VALUES (1, 1);
