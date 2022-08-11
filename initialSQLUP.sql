/* Initialize Channels Table */
CREATE TABLE oc_database.oc_channels (
	channel_id varchar(32) NOT NULL,
	name varchar(64) NOT NULL,
	last_updated DATETIME NOT NULL,
	created DATETIME NOT NULL,
	opportunity_cost_seconds BIGINT UNSIGNED NOT NULL,
	CONSTRAINT oc_channels_PK PRIMARY KEY (channel_id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;
CREATE UNIQUE INDEX oc_channels_channel_id_IDX USING BTREE ON oc_database.oc_channels (channel_id);

/* Initialize Videos Table */
CREATE TABLE oc_database.oc_videos (
	video_id varchar(32) NOT NULL,
	channel_id varchar(32) NOT NULL,
	title varchar(64) NOT NULL,
	views BIGINT UNSIGNED NOT NULL,
	video_length_seconds INT UNSIGNED NOT NULL,
	opportunity_cost_seconds BIGINT UNSIGNED NOT NULL,
	last_updated DATETIME NOT NULL,
	created DATETIME NOT NULL,
	video_published_date DATETIME NOT NULL,
	likes INT UNSIGNED NOT NULL,
	CONSTRAINT oc_videos_FK FOREIGN KEY (channel_id) REFERENCES oc_database.oc_channels(channel_id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;
CREATE INDEX oc_videos_channel_id_IDX USING BTREE ON oc_database.oc_videos (channel_id);
CREATE UNIQUE INDEX oc_videos_video_id_IDX USING BTREE ON oc_database.oc_videos (video_id);