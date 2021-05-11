DROP DATABASE IF EXISTS `tradingapp`;

CREATE DATABASE `tradingapp`;
USE `tradingapp`;

FLUSH PRIVILEGES;
-- create test user
CREATE USER 'trader'@'%' IDENTIFIED BY 'trader';
FLUSH PRIVILEGES;
GRANT ALL PRIVILEGES ON `%`.* TO 'trader'@'%' IDENTIFIED BY 'trader' WITH GRANT OPTION;
FLUSH PRIVILEGES;
CREATE USER 'trader'@'localhost' IDENTIFIED BY 'trader';
FLUSH PRIVILEGES;
GRANT ALL PRIVILEGES ON `%`.* TO 'trader'@'localhost' IDENTIFIED BY 'trader' WITH GRANT OPTION;
FLUSH PRIVILEGES;
-- tradingapp.users definition
CREATE TABLE `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `fname` varchar(255) DEFAULT NULL,
  `lname` varchar(255) DEFAULT NULL,
  `password` binary(60) DEFAULT NULL,
  `created` datetime DEFAULT current_timestamp(),
  `updated` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- tradingapp.provider definition
CREATE TABLE `provider` (
  `provider_id` int(11) NOT NULL AUTO_INCREMENT,
  `provider_name` varchar(255) NOT NULL,
  `created` datetime DEFAULT current_timestamp(),
  `updated` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`provider_id`),
  UNIQUE KEY `provider_UN` (`provider_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- tradingapp.user_profile definition
CREATE TABLE `user_profile` (
  `profile_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `provider_id` int(11) NOT NULL,
  `access_token` longtext DEFAULT NULL,
  `refresh_token` longtext DEFAULT NULL,
  `refreshed_at` varchar(128) DEFAULT NULL,
  `expires_in` varchar(128) DEFAULT NULL,
  `created` datetime DEFAULT current_timestamp(),
  `updated` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`profile_id`),
  UNIQUE KEY `user_profile_UN` (`user_id`,`provider_id`),
  KEY `user_id` (`user_id`,`provider_id`),
  KEY `user_profile_FK` (`provider_id`),
  CONSTRAINT `user_profile_FK` FOREIGN KEY (`provider_id`) REFERENCES `provider` (`provider_id`),
  CONSTRAINT `user_profile_FK_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- tradingapp.provider_account definition
CREATE TABLE `provider_account` (
  `account_id` int(11) NOT NULL AUTO_INCREMENT,
  `provider_id` int(11) NOT NULL,
  `can_day_trade` varchar(54) NOT NULL DEFAULT 'false',
  `day_trading_qualified` varchar(54) NOT NULL DEFAULT 'false',
  `name` varchar(255) DEFAULT NULL,
  `account_key` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `type_desc` varchar(255) DEFAULT NULL,
  `is_simulated` tinyint(1) NOT NULL DEFAULT 0,
  `created` datetime DEFAULT current_timestamp(),
  `updated` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`account_id`),
  UNIQUE KEY `provider_account_UN` (`provider_id`,`account_key`),
  CONSTRAINT `provider_account_FK` FOREIGN KEY (`provider_id`) REFERENCES `provider` (`provider_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- tradingapp.orders definition
CREATE TABLE `orders` (
  `app_order_id` int(11) NOT NULL AUTO_INCREMENT,
  `account_id` varchar(56) NOT NULL,
  `provider_order_id` varchar(255) NOT NULL,
  `asset_type` enum('EQ') NOT NULL DEFAULT 'EQ',
  `symbol` varchar(54) NOT NULL,
  `duration` enum('DAY','DYP','GTC','GCP') NOT NULL DEFAULT 'DAY',
  `limit_price` varchar(54) DEFAULT NULL,
  `stop_price` varchar(54) DEFAULT NULL,
  `order_type` enum('Limit','Market','StopLimit','StopMarket') NOT NULL DEFAULT 'Limit',
  `quantity` varchar(54) NOT NULL,
  `trade_action` enum('BUY','SELL','BUYTOCOVER','SELLSHORT') NOT NULL,
  `order_confirm_id` varchar(100) DEFAULT NULL,
  `order_status` varchar(100) DEFAULT NULL,
  `oso_app_order_id` int(11) DEFAULT NULL,
  `created` datetime DEFAULT current_timestamp(),
  `updated` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `message` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`app_order_id`),
  UNIQUE KEY `orders_UN` (`provider_order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- tradingapp.watchlist definition
CREATE TABLE `watchlist` (
  `watchlist_id` int(11) NOT NULL AUTO_INCREMENT,
  `watchlist_name` varchar(255) NOT NULL DEFAULT 'Default',
  `symbol` varchar(10) NOT NULL,
  `created` datetime DEFAULT current_timestamp(),
  `updated` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`watchlist_id`),
  UNIQUE KEY `watchlist_UN` (`watchlist_name`,`symbol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- tradingapp.intraday_patterns definition
CREATE TABLE `intraday_patterns` (
  `intraday_pattern_id` int(11) NOT NULL AUTO_INCREMENT,
  `symbol` varchar(100) NOT NULL,
  `pattern_id` int(11) NOT NULL,
  `timeframe` enum('5M','15M','60M','Daily') DEFAULT NULL,
  `c_open` varchar(10) NOT NULL,
  `c_high` varchar(10) NOT NULL,
  `c_low` varchar(10) NOT NULL,
  `c_close` varchar(10) NOT NULL,
  `c_date` varchar(100) NOT NULL,
  `has_active_order` tinyint(1) DEFAULT 0,
  `has_active_position` tinyint(1) DEFAULT 0,
  `candles` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`candles`)),
  `created` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`intraday_pattern_id`),
  KEY `intraday_patterns_FK` (`pattern_id`),
  CONSTRAINT `intraday_patterns_FK` FOREIGN KEY (`pattern_id`) REFERENCES `patterns` (`pattern_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

-- data setup for a single user
INSERT INTO users (`username`, `fname`, `lname`, `password`) VALUES ('user', 'firstname', 'lastname', password('trader'));

-- data setup for provider table
INSERT INTO provider (`provider_name`) VALUES ('Tradestation');
INSERT INTO provider (`provider_name`) VALUES ('Alpha Advantage');

-- data setup for watchlist
INSERT INTO watchlist (`symbol`) VALUES ('SPY'), ('QQQ'), ('UVXY'), ('TSLA')

-- Create event to delete old/expired patterns
CREATE EVENT delete_expired_patterns
ON SCHEDULE EVERY 5 MINUTE
STARTS '2021-05-06 02:04:57.000'
ON COMPLETION NOT PRESERVE
ENABLE
DO DELETE FROM intraday_patterns
	WHERE intraday_pattern_id NOT IN 
			(SELECT MAX(intraday_pattern_id) id, c_date 
				FROM intraday_patterns ip 
				WHERE ip.timeframe <> 'Daily' 
				AND CAST(c_date AS DATE) > DATE_ADD(CURRENT_DATE(), INTERVAL -2 DAY)
				GROUP BY symbol
			UNION
			SELECT MAX(intraday_pattern_id) id, c_date 
				FROM intraday_patterns ip 
				WHERE ip.timeframe = 'Daily' 
				AND CAST(c_date AS DATE) > DATE_ADD(CURRENT_DATE(), INTERVAL -3 DAY)
				GROUP BY symbol);

-- Turn on Global event scheduler to run events.
SET GLOBAL event_scheduler = ON;

-- tradingapp.vw_intraday_patterns source
CREATE OR REPLACE
ALGORITHM = UNDEFINED VIEW `tradingapp`.`vw_intraday_patterns` AS
select
    `ip`.`intraday_pattern_id` AS `intraday_pattern_id`,
    `ip`.`created` AS `created`,
    `ip`.`symbol` AS `symbol`,
    `p`.`pattern_name` AS `pattern_name`,
    `p`.`pattern_type` AS `pattern_type`,
    `ip`.`timeframe` AS `timeframe`,
    `ip`.`c_open` AS `open`,
    `ip`.`c_high` AS `high`,
    `ip`.`c_low` AS `low`,
    `ip`.`c_close` AS `close`,
    `ip`.`c_date` AS `date`,
    `ip`.`has_active_order` AS `has_active_order`,
    `ip`.`has_active_position` AS `has_active_position`,
    `ip`.`candles` AS `candles`
from
    (`tradingapp`.`intraday_patterns` `ip`
join `tradingapp`.`patterns` `p` on
    (`p`.`pattern_id` = `ip`.`pattern_id`))
where
    `ip`.`intraday_pattern_id` in (
    select
        max(`ip`.`intraday_pattern_id`) AS `id`
    from
        `tradingapp`.`intraday_patterns` `ip`
    where
        `ip`.`timeframe` <> 'Daily'
    group by
        `ip`.`symbol`)
    or cast(`ip`.`c_date` as date) in (
    select
        max(cast(`ip2`.`c_date` as date))
    from
        `tradingapp`.`intraday_patterns` `ip2`
    where
        `ip2`.`timeframe` = 'Daily')
    and `ip`.`timeframe` = 'Daily'
order by
    `ip`.`intraday_pattern_id` desc;
