CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '未命名设计',
  context TEXT NOT NULL DEFAULT '{}',        -- JSON: DesignContext
  sketch_analysis TEXT,                      -- JSON: SketchAnalysisResult
  generated_images TEXT NOT NULL DEFAULT '[]', -- JSON: GeneratedImage[]
  final_image TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created ON projects(created_at DESC);
