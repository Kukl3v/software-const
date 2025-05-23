--liquibase formatted sql
--changeset p.kuklev:1-initial-create-tables

CREATE TABLE club (
    id UUID PRIMARY KEY,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL
);

CREATE TABLE user_table (
    id UUID PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);

CREATE TABLE membership (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    duration_days INTEGER NOT NULL
);

CREATE TABLE service (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    membership_id UUID
);

CREATE TABLE group_class (
    id UUID PRIMARY KEY,
    club_id UUID,
    trainer_id UUID
);

CREATE TABLE user_membership (
    id UUID PRIMARY KEY,
    start_date DATE,
    expiration_date DATE,
    user_id UUID,
    membership_id UUID
);

CREATE TABLE session_table (
    id UUID PRIMARY KEY,
    trainer_id UUID,
    type VARCHAR(50),
    membership_id UUID,
    day_of_week VARCHAR(20),
    start_time TIME,
    end_time TIME,
    client_id UUID,
    group_id UUID
);

CREATE TABLE group_clients (
    group_id UUID NOT NULL,
    client_id UUID NOT NULL,
    PRIMARY KEY (group_id, client_id)
);

ALTER TABLE service ADD CONSTRAINT fk_service_membership FOREIGN KEY (membership_id) REFERENCES membership(id);
ALTER TABLE group_class ADD CONSTRAINT fk_group_class_club FOREIGN KEY (club_id) REFERENCES club(id);
ALTER TABLE group_class ADD CONSTRAINT fk_group_class_trainer FOREIGN KEY (trainer_id) REFERENCES user_table(id);
ALTER TABLE user_membership ADD CONSTRAINT fk_user_membership_user FOREIGN KEY (user_id) REFERENCES user_table(id);
ALTER TABLE user_membership ADD CONSTRAINT fk_user_membership_membership FOREIGN KEY (membership_id) REFERENCES membership(id);
ALTER TABLE session_table ADD CONSTRAINT fk_session_trainer FOREIGN KEY (trainer_id) REFERENCES user_table(id);
ALTER TABLE session_table ADD CONSTRAINT fk_session_client FOREIGN KEY (client_id) REFERENCES user_table(id);
ALTER TABLE session_table ADD CONSTRAINT fk_session_membership FOREIGN KEY (membership_id) REFERENCES membership(id);
ALTER TABLE session_table ADD CONSTRAINT fk_session_group FOREIGN KEY (group_id) REFERENCES group_class(id);
ALTER TABLE group_clients ADD CONSTRAINT fk_group_clients_group FOREIGN KEY (group_id) REFERENCES group_class(id);
ALTER TABLE group_clients ADD CONSTRAINT fk_group_clients_user FOREIGN KEY (client_id) REFERENCES user_table(id);

CREATE INDEX idx_user_email ON user_table(email);
CREATE INDEX idx_service_membership ON service(membership_id);
CREATE INDEX idx_group_class_club ON group_class(club_id);
CREATE INDEX idx_group_class_trainer ON group_class(trainer_id);
CREATE INDEX idx_user_membership_user ON user_membership(user_id);
CREATE INDEX idx_user_membership_membership ON user_membership(membership_id);
CREATE INDEX idx_session_trainer ON session_table(trainer_id);
CREATE INDEX idx_session_client ON session_table(client_id);
CREATE INDEX idx_session_membership ON session_table(membership_id);
CREATE INDEX idx_session_group ON session_table(group_id);
CREATE INDEX idx_group_clients_group ON group_clients(group_id);
CREATE INDEX idx_group_clients_client ON group_clients(client_id);
