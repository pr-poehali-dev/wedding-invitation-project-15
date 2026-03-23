CREATE TABLE rsvp_responses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    attend VARCHAR(10) NOT NULL,
    guests VARCHAR(10),
    alcohol TEXT[],
    music TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);