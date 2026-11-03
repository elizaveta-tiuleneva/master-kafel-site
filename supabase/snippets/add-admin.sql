-- Назначить пользователя администратором сайта.
--
-- 1. Создайте пользователя: Authentication → Users → Add user → Create new user.
-- 2. Замените ADMIN_EMAIL ниже на его email (только в SQL Editor, не в этом файле).
-- 3. Выполните запрос в SQL Editor.
--
-- Этот файл — шаблон. Не сохраняйте в нём реальные адреса.

insert into public.admins (user_id)
select id from auth.users where email = 'ADMIN_EMAIL'
on conflict (user_id) do nothing;

-- Проверка: должна вернуться одна строка с этим email.
select a.user_id, u.email, a.created_at
from public.admins a
join auth.users u on u.id = a.user_id;
