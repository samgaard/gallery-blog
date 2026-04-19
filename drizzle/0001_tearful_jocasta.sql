ALTER TABLE "artworks" ADD COLUMN "slug" varchar(255);--> statement-breakpoint
ALTER TABLE "artworks" ADD CONSTRAINT "artworks_slug_unique" UNIQUE("slug");