DROP TABLE IF EXISTS public.chats;

CREATE TABLE IF NOT EXISTS public.chats
(
    id integer NOT NULL DEFAULT nextval('chats_id_seq'::regclass),
    message character varying COLLATE pg_catalog."default",
    date timestamp with time zone,
    username character varying COLLATE pg_catalog."default",
    CONSTRAINT chats_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.chats
    OWNER to postgres;


DROP TABLE IF EXISTS public.users;

CREATE TABLE IF NOT EXISTS public.users
(
    id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    name text COLLATE pg_catalog."default" NOT NULL,
    email text COLLATE pg_catalog."default" NOT NULL,
    password character varying COLLATE pg_catalog."default",
    CONSTRAINT users_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users
    OWNER to postgres;

DROP TABLE IF EXISTS public.uploads;

CREATE TABLE IF NOT EXISTS public.uploads
(
    id integer NOT NULL DEFAULT nextval('uploads_id_seq'::regclass),
    label text COLLATE pg_catalog."default" NOT NULL,
    filename text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT uploads_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.uploads
    OWNER to postgres;