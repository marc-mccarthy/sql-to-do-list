CREATE TABLE tasks (
	"id" serial primary key,
    "complete" boolean default 'No',
	"task" text not null,
	"start_date" timestamp not null default current_timestamp,
	"end_date" timestamp not null,
	"priority" boolean not null,
	"progress" integer not null default 0,
	"username" varchar(10) default current_user
);

INSERT INTO tasks (task, end_date, priority) VALUES 
('Mow the lawn', '05/25/22 03:25 AM', 'false'),
('Code a To-Do-List', '05/23/22 06:10 PM', 'true'),
('Pick up dog poo', '05/26/22 08:45 PM', 'false'),
('Setup a tasks database', '05/24/22 10:30 AM', 'true');
