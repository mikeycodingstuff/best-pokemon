alter table "public"."pokemons" enable row level security;

create policy "Enable read access for all users"
on "public"."pokemons"
as permissive
for select
to public
using (true);



