create policy "Enable update for users"
on "public"."pokemons"
as permissive
for update
to public
using (true)
with check (((wins IS NOT NULL) OR (losses IS NOT NULL)));



