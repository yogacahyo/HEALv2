// ============================================================
// Upload Validation — Validate uploaded files against SIMRS schema
// ============================================================

import { SIMRS_TABLE_NAMES, getTableSchema } from './simrs-schema';
import type { SchemaHealth } from './types';

export interface UploadValidationResult {
  isValid: boolean;
  tables: string[];
  matchedTables: string[];
  unmatchedTables: string[];
  columnMismatches: Record<string, string[]>;
  messages: string[];
}

/** Validate parsed tables against SIMRS schema */
export function validateUploadedSchema(
  parsedTables: Record<string, string[]>
): UploadValidationResult {
  const tables = Object.keys(parsedTables);
  const matchedTables: string[] = [];
  const unmatchedTables: string[] = [];
  const columnMismatches: Record<string, string[]> = {};
  const messages: string[] = [];

  for (const table of tables) {
    const lowerTable = table.toLowerCase();
    if (SIMRS_TABLE_NAMES.includes(lowerTable)) {
      matchedTables.push(lowerTable);

      // Validate columns
      const schema = getTableSchema(lowerTable);
      if (schema) {
        const expectedColumns = schema.columns.map((c) => c.name);
        const actualColumns = parsedTables[table].map((c) => c.toLowerCase());
        const missingColumns = expectedColumns.filter((c) => !actualColumns.includes(c));
        if (missingColumns.length > 0) {
          columnMismatches[lowerTable] = missingColumns;
          messages.push(
            `Tabel "${lowerTable}": kolom ${missingColumns.join(', ')} tidak ditemukan pada file yang di-upload.`
          );
        }
      }
    } else {
      unmatchedTables.push(table);
    }
  }

  if (unmatchedTables.length > 0) {
    messages.push(
      `Tabel tidak ditemukan pada struktur database SIMRS yang diizinkan: ${unmatchedTables.join(', ')}`
    );
  }

  if (Object.keys(columnMismatches).length > 0) {
    messages.push(
      'Beberapa kolom tidak sesuai dengan database SIMRS. Data dapat dipreview, tetapi belum dapat diterapkan ke dashboard.'
    );
  }

  return {
    isValid: matchedTables.length > 0 && Object.keys(columnMismatches).length === 0,
    tables,
    matchedTables,
    unmatchedTables,
    columnMismatches,
    messages,
  };
}

/** Calculate schema health */
export function calculateSchemaHealth(
  parsedTables: Record<string, string[]>
): SchemaHealth {
  const tables = Object.keys(parsedTables).map((t) => t.toLowerCase());
  const matched = tables.filter((t) => SIMRS_TABLE_NAMES.includes(t));
  const missing = SIMRS_TABLE_NAMES.filter((t) => !tables.includes(t));
  const extra = tables.filter((t) => !SIMRS_TABLE_NAMES.includes(t));

  const columnMismatches: Record<string, string[]> = {};
  for (const table of matched) {
    const schema = getTableSchema(table);
    if (schema) {
      const expected = schema.columns.map((c) => c.name);
      const actual = (parsedTables[table] || []).map((c) => c.toLowerCase());
      const missingCols = expected.filter((c) => !actual.includes(c));
      if (missingCols.length > 0) {
        columnMismatches[table] = missingCols;
      }
    }
  }

  return {
    total_tables: SIMRS_TABLE_NAMES.length,
    matched_tables: matched.length,
    missing_tables: missing,
    extra_tables: extra,
    column_mismatches: columnMismatches,
  };
}
