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
('Mow the lawn', '05/25/22', '05/27/22', 'false'),
('Code a To-Do-List', '05/23/22', '05/24/22', 'true'),
('Pick up dog poo', '05/26/22', '05/27/22', 'false'),
('Setup a tasks database', '05/24/22', '05/28/22', 'true');

INSERT INTO tasks (complete, task, start_date, end_date, priority, progress, username) VALUES ('No', 'Paint the fence', '5/20/22', '5/23/22', 'Yes', '20', 'Madden');

SELECT * FROM tasks ORDER BY id DESC;

UPDATE tasks SET complete = 'No', finish_date = 'Incomplete' WHERE id = 2;

UPDATE tasks SET complete = 'Yes', finish_date = '5/23/22' WHERE id = 2;

DELETE FROM tasks WHERE id = 3;