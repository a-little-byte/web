import { sql, type Kysely } from "kysely";

export const up = async (db: Kysely<any>): Promise<void> => {
  await db.schema
    .createTable("casbin_rule")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("ptype", "varchar(100)", (col) => col.notNull())
    .addColumn("v0", "varchar(100)", (col) => col.notNull())
    .addColumn("v1", "varchar(100)", (col) => col.notNull())
    .addColumn("v2", "varchar(100)", (col) => col.notNull())
    .addColumn("v3", "varchar(100)")
    .addColumn("v4", "varchar(100)")
    .addColumn("v5", "varchar(100)")
    .execute();

  await db.schema
    .createIndex("ptype_index")
    .on("casbin_rule")
    .column("ptype")
    .using("btree")
    .execute();

  await db.schema
    .createIndex("v0_index")
    .on("casbin_rule")
    .column("v0")
    .using("btree")
    .execute();

  await db.schema
    .createIndex("v1_index")
    .on("casbin_rule")
    .column("v1")
    .using("btree")
    .execute();

  await db.schema
    .createIndex("v2_index")
    .on("casbin_rule")
    .column("v2")
    .using("btree")
    .execute();

  await db.schema
    .createIndex("v3_index")
    .on("casbin_rule")
    .column("v3")
    .using("btree")
    .execute();

  await db.schema
    .createIndex("v4_index")
    .on("casbin_rule")
    .column("v4")
    .using("btree")
    .execute();

  await db.schema
    .createIndex("v5_index")
    .on("casbin_rule")
    .column("v5")
    .using("btree")
    .execute();
};

export const down = async (db: Kysely<any>): Promise<void> => {
  await db.schema.dropIndex("ptype_index").on("casbin_rule").execute();
  await db.schema.dropIndex("v0_index").on("casbin_rule").execute();
  await db.schema.dropIndex("v1_index").on("casbin_rule").execute();
  await db.schema.dropIndex("v2_index").on("casbin_rule").execute();
  await db.schema.dropIndex("v3_index").on("casbin_rule").execute();
  await db.schema.dropIndex("v4_index").on("casbin_rule").execute();
  await db.schema.dropIndex("v5_index").on("casbin_rule").execute();

  await db.schema.dropTable("casbin_rule").execute();
};
