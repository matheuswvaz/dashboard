SET FOREIGN_KEY_CHECKS=0;

-- ====================
-- TABELA credenciais
-- ====================
CREATE TABLE IF NOT EXISTS `credenciais` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(255) NOT NULL UNIQUE,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `foto_url` VARCHAR(512) DEFAULT NULL,
  `is_verified` BOOLEAN NOT NULL DEFAULT FALSE,
  `verification_token` VARCHAR(255) DEFAULT NULL,
  `verification_token_expires` DATETIME DEFAULT NULL,
  `reset_token` VARCHAR(255) DEFAULT NULL,
  `reset_token_expires` DATETIME DEFAULT NULL,
  `last_login` DATETIME DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================
-- TABELA postagens
-- ====================
CREATE TABLE `postagens` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `autor` VARCHAR(255) NOT NULL,
  `titulo` VARCHAR(255) NOT NULL,
  `subtitulo` VARCHAR(255) DEFAULT NULL,
  `conteudo` TEXT NOT NULL,
  `categoria` VARCHAR(100) DEFAULT NULL,
  `imagem` VARCHAR(255) DEFAULT NULL,
  `legenda_imagem_destaque` VARCHAR(255) DEFAULT NULL,
  `data_publicacao` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `status` VARCHAR(50) NOT NULL DEFAULT 'publicado',
  `data_agendamento` DATETIME DEFAULT NULL,
  `is_published` TINYINT(1) DEFAULT 0,
  `featured` TINYINT(1) DEFAULT 0,
  `external_source` VARCHAR(255) DEFAULT NULL,
  `external_url` VARCHAR(500) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- ====================
-- TABELA leads
-- ====================
CREATE TABLE IF NOT EXISTS `leads` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nome` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `telefone` VARCHAR(50) NOT NULL,
  `data_envio` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `consent_marketing` BOOLEAN DEFAULT FALSE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================
-- TABELA access_logs
-- ====================
CREATE TABLE IF NOT EXISTS `access_logs` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `access_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `http_method` VARCHAR(10) NOT NULL,
  `requested_url` VARCHAR(2048) NOT NULL,
  `path` VARCHAR(2048) DEFAULT NULL,
  `user_agent` VARCHAR(1024) DEFAULT NULL,
  `country` VARCHAR(10) DEFAULT NULL,
  `city` VARCHAR(100) DEFAULT NULL,
  `latitude` DECIMAL(10,6) DEFAULT NULL,
  `longitude` DECIMAL(10,6) DEFAULT NULL,
  `referrer` VARCHAR(2048) DEFAULT NULL,
  `device_type` VARCHAR(20) DEFAULT NULL,
  `consent_details` JSON DEFAULT NULL,
  `is_page_view` TINYINT(1) DEFAULT 0,
  `status_code` INT DEFAULT 200,
  `response_time_ms` DECIMAL(10,3) DEFAULT NULL,
  `user_id` INT DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_access_logs_access_time` (`access_time`),
  KEY `idx_access_logs_path` (`path`(191)),
  KEY `idx_access_logs_country` (`country`),
  KEY `idx_access_logs_device_type` (`device_type`),
  KEY `idx_access_logs_status_code` (`status_code`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- ====================
-- TABELA candidaturas
-- ====================
CREATE TABLE IF NOT EXISTS `candidaturas` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nome` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `telefone` VARCHAR(50) DEFAULT NULL,
  `vaga` VARCHAR(255) NOT NULL,
  `resumo` TEXT,
  `caminho_anexo` VARCHAR(512) NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'Recebida', -- Ex: Recebida, Em Análise, Aprovada, Rejeitada
  `data_envio` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================
-- ÍNDICES
-- ====================
CREATE INDEX `idx_postagens_categoria` ON `postagens`(`categoria`);
CREATE INDEX `idx_postagens_autor` ON `postagens`(`autor`);
CREATE INDEX `idx_postagens_data_publicacao` ON `postagens`(`data_publicacao`);
CREATE INDEX `idx_leads_email` ON `leads`(`email`);
CREATE INDEX `idx_leads_data_envio` ON `leads`(`data_envio`);
CREATE INDEX `idx_access_logs_path` ON `access_logs`(`path`(191));
CREATE INDEX `idx_access_logs_access_time` ON `access_logs`(`access_time`);
CREATE INDEX `idx_access_logs_ip_address` ON `access_logs`(`ip_address`);

-- ====================
-- ADMIN INICIAL 
-- ====================
-- Lembre de substituir pela hash do bcrypt:
-- Gerar uma senha com bcrypt: https://bcrypt-generator.com/
-- INSERT INTO `credenciais` (`username`, `email`, `password`)
-- VALUES ('admin', 'admin@nepen.org.br', '$2b$10$abcde12345...');

SET FOREIGN_KEY_CHECKS=1;
