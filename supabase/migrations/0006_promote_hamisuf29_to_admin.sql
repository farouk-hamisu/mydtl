-- Promote hamisuf29@gmail.com to admin role

update public.profiles
set role = 'admin'
where email = 'hamisuf29@gmail.com';
