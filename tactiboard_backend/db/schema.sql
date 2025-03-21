-- Teamテーブルの作成
CREATE TABLE Team (
    name TEXT PRIMARY KEY,
    admin TEXT NOT NULL,
    description TEXT,
    create_date TEXT NOT NULL
);

-- Userテーブルの作成
CREATE TABLE User (
    name TEXT PRIMARY KEY
);

-- UserTeams (中間テーブル) の作成
CREATE TABLE UserTeams (
    user_name TEXT NOT NULL,
    team_name TEXT NOT NULL,
    role TEXT NOT NULL,
    PRIMARY KEY (user_name, team_name),
    FOREIGN KEY (user_name) REFERENCES User(name),
    FOREIGN KEY (team_name) REFERENCES Team(name)
);

-- Tacticsテーブルの作成
CREATE TABLE Tactics (
    name TEXT NOT NULL,
    team TEXT NOT NULL,
    description TEXT,
    create_date TEXT NOT NULL,
    admin TEXT NOT NULL,
    PRIMARY KEY (name, team),
    FOREIGN KEY (team) REFERENCES Team(name)
);

-- SavedTacticsテーブルの作成
CREATE TABLE SavedTactics (
    name TEXT NOT NULL,
    tactics_name TEXT NOT NULL,
    team_name TEXT NOT NULL,
    description TEXT,
    PRIMARY KEY (name, tactics_name, team_name),
    FOREIGN KEY (tactics_name, team_name) REFERENCES Tactics(name, team),
    FOREIGN KEY (team_name) REFERENCES Team(name)
);

-- Activityテーブルの作成
CREATE TABLE Activity (
    name TEXT PRIMARY KEY,
    activity TEXT NOT NULL,
    create_date TEXT NOT NULL
);