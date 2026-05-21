CREATE TABLE users (
  id SERIAL PRIMARY KEY,

  name VARCHAR(100) NOT NULL,

  email VARCHAR(255) UNIQUE NOT NULL,

  password TEXT NOT NULL,

  role VARCHAR(20) NOT NULL DEFAULT 'contributor'
    CHECK (role IN ('contributor', 'maintainer')),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE issues (
  id SERIAL PRIMARY KEY,

  title VARCHAR(150) NOT NULL,

  description TEXT NOT NULL,

  type VARCHAR(30) NOT NULL
    CHECK (type IN ('bug', 'feature_request')),

  status VARCHAR(30) NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'in_progress', 'resolved')),

  reporter_id INTEGER NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);