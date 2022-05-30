CREATE TABLE tasks (
	"id" serial primary key,
    "complete" boolean default 'No',
	"task" text not null,
	"start_date" text not null default current_date,
	"end_date" text not null,
	"priority" boolean not null,
	"progress" integer not null default 0,
	"username" varchar(20) default current_user,
	"finish_date" text not null default 'Incomplete'
);

INSERT INTO tasks (task, start_date, end_date, priority, progress, username) VALUES 
('Mow the lawn', '5/25/22', '5/27/22', 'false', '40', 'Madden'),
('Code a To-Do-List', '5/23/22', '5/24/22', 'true', '100', 'Mila'),
('Pick up dog poo', '5/26/22', '5/27/22', 'false', '20', 'Reya'),
('Paint the fence', '5/24/22', '5/28/22', 'true', '100', 'Jessica');

INSERT INTO tasks (complete, task, start_date, end_date, priority, progress, username) VALUES ('No', 'Setup a tasks database', '5/20/22', '5/23/22', 'Yes', '20', 'Marc');

SELECT * FROM tasks ORDER BY id DESC;

UPDATE tasks SET complete = 'No', finish_date = 'Incomplete' WHERE id = 2;

UPDATE tasks SET complete = 'Yes', finish_date = '5/23/22' WHERE id = 2;

DELETE FROM tasks WHERE id = 3;
