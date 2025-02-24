-- First, update any existing null values to 0
update pokemons set wins = 0 where wins is null;
update pokemons set losses = 0 where losses is null;

-- Then, alter the columns to set the default to 0
alter table pokemons alter column wins set default 0;
alter table pokemons alter column losses set default 0;

-- Finally, set the columns to not null
alter table pokemons alter column wins set not null;
alter table pokemons alter column losses set not null;
