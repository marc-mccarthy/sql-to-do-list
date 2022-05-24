CREATE TABLE tasks (
	"id" serial primary key,
    "complete" boolean default 'No',
	"task" text not null,
	"start_date" text not null default current_date,
	"end_date" text not null,
	"priority" boolean not null,
	"progress" integer not null default 0,
	"username" varchar(10) default current_user,
	"finish_date" text not null default 'Incomplete'
);

INSERT INTO tasks (task, start_date, end_date, priority) VALUES 
('Mow the lawn', '05/25/2022', '05/27/2022', 'false'),
('Code a To-Do-List', '05/23/2022', '05/24/2022', 'true'),
('Pick up dog poo', '05/26/2022', '05/27/2022', 'false'),
('Setup a tasks database', '05/24/2022', '05/28/2022', 'true');
