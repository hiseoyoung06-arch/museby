-- Optional: sample brand for local testing.
-- Run manually after 0001_init.sql if you want a working code out of the box.
insert into brands (name, code)
values ('샘플 브랜드', 'SAMPLE-CODE-0001')
on conflict (code) do nothing;
