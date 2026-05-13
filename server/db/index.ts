import initSqlJs, { Database as SqlJsDatabase } from 'sql.js'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DB_PATH = join(__dirname, '..', '..', 'data.db')

let db: SqlJsDatabase

export function getDb(): SqlJsDatabase {
  if (!db) throw new Error('数据库未初始化，请先调用 initDb()')
  return db
}

function saveDb() {
  const data = db.export()
  const buffer = Buffer.from(data)
  writeFileSync(DB_PATH, buffer)
}

export async function initDb(): Promise<void> {
  const SQL = await initSqlJs()

  if (existsSync(DB_PATH)) {
    const fileBuffer = readFileSync(DB_PATH)
    db = new SQL.Database(fileBuffer)
  } else {
    db = new SQL.Database()
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL DEFAULT '未命名设计',
      context TEXT NOT NULL DEFAULT '{}',
      sketch_analysis TEXT,
      generated_images TEXT NOT NULL DEFAULT '[]',
      final_image TEXT,
      status TEXT NOT NULL DEFAULT 'draft',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `)
  saveDb()
  console.log('[DB] 数据库初始化完成 (sql.js)')
}

// 辅助函数
export function runQuery(sql: string, params?: any[]): any[] {
  const d = getDb()
  const stmt = d.prepare(sql)
  if (params) stmt.bind(params)
  const results: any[] = []
  while (stmt.step()) {
    results.push(stmt.getAsObject())
  }
  stmt.free()
  return results
}

export function execQuery(sql: string, params?: any[]): void {
  const d = getDb()
  d.run(sql, params)
  saveDb()
}
