import { Database } from "@/db";
import type { Kysely } from "kysely";

export const up = async (db: Kysely<Database>): Promise<void> => {
  await db.schema
    .createTable("casbin_rule")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("ptype", "varchar(100)", (col) => col.notNull())
    .addColumn("v0", "varchar(100)", (col) => col.notNull())
    .addColumn("v1", "varchar(100)", (col) => col.notNull())
    .addColumn("v2", "varchar(100)", (col) => col.notNull())
    .addColumn("v3", "varchar(100)")
    .addColumn("v4", "varchar(100)")
    .addColumn("v5", "varchar(100)")
    .execute();

  await db.schema
    .createIndex("casbin_rule")
    .on("ptype")
    .using("btree")
    .execute();

  await db.schema.createIndex("casbin_rule").on("v0").using("btree").execute();

  await db.schema.createIndex("casbin_rule").on("v1").using("btree").execute();

  await db.schema.createIndex("casbin_rule").on("v2").using("btree").execute();

  await db.schema.createIndex("casbin_rule").on("v3").using("btree").execute();

  await db.schema.createIndex("casbin_rule").on("v4").using("btree").execute();

  await db.schema.createIndex("casbin_rule").on("v5").using("btree").execute();
};

export const down = async (db: Kysely<Database>): Promise<void> => {
  await db.schema.dropIndex("casbin_rule").on("ptype").execute();

  await db.schema.dropIndex("casbin_rule").on("v0").execute();
  await db.schema.dropIndex("casbin_rule").on("v1").execute();
  await db.schema.dropIndex("casbin_rule").on("v2").execute();
  await db.schema.dropIndex("casbin_rule").on("v3").execute();
  await db.schema.dropIndex("casbin_rule").on("v4").execute();
  await db.schema.dropIndex("casbin_rule").on("v5").execute();

  await db.schema.dropTable("casbin_rule").execute();
};
