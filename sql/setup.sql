DROP TABLE IF EXISTS recipes;
DROP TABLE IF EXISTS logs;

CREATE TABLE recipes (
  id BIGINT GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  directions TEXT[],
  ingredients jsonb[]
);

CREATE TABLE logs (
  id BIGINT GENERATED ALWAYS AS IDENTITY,
  recipe_id BIGINT NOT NULL,
  date_of_event TEXT NOT NULL,
  notes TEXT,
  rating TEXT 
);
