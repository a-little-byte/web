import { Database } from "..";

export type InformationSchemaTables = {
  table_catalog: string;
  table_schema: string;
  table_name: keyof Database;
  table_type: string;
  self_referencing_column_name: string | null;
  reference_generation: string | null;
  user_defined_type_catalog: string | null;
  user_defined_type_schema: string | null;
  user_defined_type_name: string | null;
  is_insertable_into: 'YES' | 'NO';
  is_typed: 'YES' | 'NO';
  commit_action: string | null;
}

