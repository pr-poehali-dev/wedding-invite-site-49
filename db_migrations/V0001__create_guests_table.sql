CREATE TABLE t_p76259693_wedding_invite_site_.guests (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  attending TEXT NOT NULL,
  guests_count INTEGER DEFAULT 1,
  drinks TEXT,
  song TEXT,
  dietary TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);