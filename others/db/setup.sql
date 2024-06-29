CREATE DATABASE running;
CREATE EXTENSION postgis;
create table "public"."users" (
    "id" serial not null,
    "created_at" TIMESTAMPTZ not null default NOW(),
    "username" varchar(50) UNIQUE not null,
    "password" varchar(255) not null,
    constraint "users_pkey" primary key ("id")
);
create table "public"."sessions" (
    "id" VARCHAR(36) not null default GEN_RANDOM_UUID (),
    "created_at" TIMESTAMPTZ not null default NOW(),
    "user_id" INT4 not null,
    constraint "sessions_pkey" primary key ("id"),
    constraint "session_user_id" FOREIGN KEY ("user_id") REFERENCES users ("id") ON DELETE CASCADE
);
create table "public"."runs" (
    "id" serial not null,
    "ran_by" INT not null,
    "created_at" TIMESTAMPTZ not null default NOW(),
    "ran_at" TIMESTAMPTZ not null,
    "distance" DECIMAL not null,
    "duration" INT not null,
    "avg_speed" DECIMAL not null,
    "elevation_gain" DECIMAL not null,
    "route" GEOMETRY not null,
    constraint "runs_pkey" primary key ("id"),
    CONSTRAINT "run_user" FOREIGN KEY ("ran_by") REFERENCES users ("id") ON DELETE CASCADE
);
create table "public"."visited_roads" (
    "visited_by" INT4 not null,
    "road_gid" INT4 not null,
    "run_id" INT not null,
    constraint "visited_roads_pkey" primary key ("visited_by", "road_gid"),
    constraint "roads_visited_by" FOREIGN KEY ("visited_by") REFERENCES users ("id") ON DELETE CASCADE,
    constraint "visited_road_gid" FOREIGN KEY ("road_gid") REFERENCES roads ("gid") ON DELETE CASCADE,
    constraint "visited_in_run_id" FOREIGN KEY ("run_id") REFERENCES runs ("id") ON DELETE CASCADE
);