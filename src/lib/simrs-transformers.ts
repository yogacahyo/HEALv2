// ============================================================
// SIMRS Transformers — Data transformation and SQL/CSV/XLSX parsing
// ============================================================

import { SIMRS_TABLE_NAMES } from './simrs-schema';

/** Parse simple SQL CREATE TABLE statements to extract table names and columns */
export function parseSQLSchema(sql: string): Record<string, string[]> {
  const tables: Record<string, string[]> = {};
  const createTableRegex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?`?(\w+)`?\s*\(([\s\S]*?)\);/gi;
  let match;

  while ((match = createTableRegex.exec(sql)) !== null) {
    const tableName = match[1].toLowerCase();
    const columnsBlock = match[2];
    const columns: string[] = [];

    const lines = columnsBlock.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (
        trimmed &&
        !trimmed.startsWith('PRIMARY') &&
        !trimmed.startsWith('FOREIGN') &&
        !trimmed.startsWith('INDEX') &&
        !trimmed.startsWith('UNIQUE') &&
        !trimmed.startsWith('KEY') &&
        !trimmed.startsWith('CONSTRAINT') &&
        !trimmed.startsWith('--') &&
        !trimmed.startsWith(')')
      ) {
        const colMatch = trimmed.match(/^`?(\w+)`?\s+/);
        if (colMatch) {
          columns.push(colMatch[1].toLowerCase());
        }
      }
    }

    if (columns.length > 0) {
      tables[tableName] = columns;
    }
  }

  return tables;
}

/** Parse INSERT statements to extract data */
export function parseSQLInserts(sql: string, tableName: string): Record<string, unknown>[] {
  const results: Record<string, unknown>[] = [];
  const insertRegex = new RegExp(
    `INSERT\\s+(?:IGNORE\\s+)?INTO\\s+\`?${tableName}\`?\\s*\\(([^)]+)\\)\\s*VALUES\\s*(.+?);`,
    'gi'
  );

  let match;
  while ((match = insertRegex.exec(sql)) !== null) {
    const columns = match[1].split(',').map((c) => c.trim().replace(/`/g, ''));
    const valuesBlock = match[2];

    const valueGroups = valuesBlock.match(/\(([^)]+)\)/g);
    if (valueGroups) {
      for (const group of valueGroups) {
        const values = group.slice(1, -1).split(',').map((v) => {
          const trimmed = v.trim();
          if (trimmed === 'NULL') return null;
          if (trimmed.startsWith("'") && trimmed.endsWith("'")) return trimmed.slice(1, -1);
          if (!isNaN(Number(trimmed))) return Number(trimmed);
          return trimmed;
        });

        const row: Record<string, unknown> = {};
        columns.forEach((col, i) => {
          row[col] = values[i] ?? null;
        });
        results.push(row);
      }
    }
  }

  return results;
}

/** Validate table names against SIMRS schema */
export function validateTableNames(tables: string[]): { valid: string[]; invalid: string[] } {
  const valid: string[] = [];
  const invalid: string[] = [];

  for (const table of tables) {
    if (SIMRS_TABLE_NAMES.includes(table.toLowerCase())) {
      valid.push(table);
    } else {
      invalid.push(table);
    }
  }

  return { valid, invalid };
}

/** Convert CSV row data to typed records */
export function csvToRecords(headers: string[], rows: string[][]): Record<string, unknown>[] {
  return rows.map((row) => {
    const record: Record<string, unknown> = {};
    headers.forEach((header, i) => {
      const value = row[i]?.trim();
      if (!value || value === '') {
        record[header] = null;
      } else if (!isNaN(Number(value))) {
        record[header] = Number(value);
      } else {
        record[header] = value;
      }
    });
    return record;
  });
}
