CREATE TABLE IF NOT EXISTS "urls" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar(8) NOT NULL,
	"url" text NOT NULL,
	CONSTRAINT "urls_key_unique" UNIQUE("key")
);
