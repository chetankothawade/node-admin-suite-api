-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Mar 12, 2026 at 03:28 AM
-- Server version: 9.1.0
-- PHP Version: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `prisma_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

DROP TABLE IF EXISTS `activity_logs`;
CREATE TABLE IF NOT EXISTS `activity_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `board_id` int DEFAULT NULL,
  `list_id` int DEFAULT NULL,
  `task_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  `action` varchar(255) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `activityLogs_uuid_unique` (`uuid`),
  KEY `boardId` (`board_id`),
  KEY `listId` (`list_id`),
  KEY `taskId` (`task_id`),
  KEY `userId` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `attachments`
--

DROP TABLE IF EXISTS `attachments`;
CREATE TABLE IF NOT EXISTS `attachments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `task_id` int NOT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `uploaded_by` int NOT NULL,
  `uploaded_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `attachments_uuid_unique` (`uuid`),
  KEY `taskId` (`task_id`),
  KEY `uploadedBy` (`uploaded_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `boards`
--

DROP TABLE IF EXISTS `boards`;
CREATE TABLE IF NOT EXISTS `boards` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `name` varchar(150) NOT NULL,
  `description` text,
  `created_by` int NOT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `boards_uuid_unique` (`uuid`),
  KEY `createdBy` (`created_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `parent_id` int DEFAULT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `categories_uuid_unique` (`uuid`),
  KEY `parentId` (`parent_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `uuid`, `name`, `parent_id`, `status`, `created_at`, `updated_at`) VALUES
(1, 'c2e7979c-154a-4f70-9998-2f764e2c5486', 'Electronics', NULL, 'active', '2025-11-06 07:45:51.000', '2025-11-06 07:58:32.000'),
(2, '0745ed4d-9455-4b36-b52d-5701997878da', 'Mobiles', 1, 'active', '2025-11-06 08:12:22.000', '2025-11-06 08:12:22.000');

-- --------------------------------------------------------

--
-- Table structure for table `cms`
--

DROP TABLE IF EXISTS `cms`;
CREATE TABLE IF NOT EXISTS `cms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `title` varchar(100) NOT NULL,
  `content` text NOT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `title` (`title`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `cms_uuid_unique` (`uuid`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `cms`
--

INSERT INTO `cms` (`id`, `uuid`, `title`, `content`, `status`, `createdAt`, `updatedAt`) VALUES
(1, '97b40d38-738b-4c65-8bfd-8df11f3aa758', 'Terms & Condition', 'Terms & Condition', 'active', '2025-09-24 11:22:05', '2025-09-25 04:56:44'),
(2, '2513c0ee-8684-4c62-b8aa-70aa1945c55d', 'Privacy Policy', '<p>&nbsp;</p><figure class=\"image\"><img style=\"aspect-ratio:200/200;\" src=\"http://localhost:8000/uploads/editor/1758775613758-850917873.png\" width=\"200\" height=\"200\"></figure><ul><li><strong>Lorem Ipsum</strong> is simply dummy text of the printing and typesetting industry.&nbsp;</li><li>Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.&nbsp;</li><li>It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</li><li><strong>Lorem Ipsum</strong> is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.&nbsp;</li><li>It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</li><li>&nbsp;It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</li></ul><p>&nbsp;</p>', 'active', '2025-09-25 04:48:59', '2025-10-01 08:29:26');

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
CREATE TABLE IF NOT EXISTS `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `task_id` int NOT NULL,
  `user_id` int NOT NULL,
  `content` text NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `comments_uuid_unique` (`uuid`),
  KEY `taskId` (`task_id`),
  KEY `userId` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `conversations`
--

DROP TABLE IF EXISTS `conversations`;
CREATE TABLE IF NOT EXISTS `conversations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `type` enum('direct','group') NOT NULL DEFAULT 'direct',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT ' -- used for groups',
  `created_by` int DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `conversations_uuid_unique` (`uuid`),
  KEY `createdBy` (`created_by`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `conversations`
--

INSERT INTO `conversations` (`id`, `uuid`, `type`, `name`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'f7ee1575-ceff-4fc6-9272-550780236e68', 'direct', NULL, 2, '2025-10-03 05:48:45.000', '2025-10-03 05:48:45.000'),
(2, 'e7040908-ec31-4080-8d1e-6a1b61a84b2d', 'direct', NULL, 2, '2025-10-03 12:20:28.000', '2025-10-03 12:20:27.000'),
(3, '5b3691ed-9c6c-4810-a4f0-88c8a1f2c51c', 'direct', NULL, 2, '2025-10-03 12:20:34.000', '2025-10-03 12:20:34.000'),
(4, '01990af4-ec33-4fc0-9a65-7e2e9ed03a47', 'direct', NULL, 2, '2025-10-03 12:20:42.000', '2025-10-03 12:20:41.000'),
(5, 'ec95fe16-4ad6-4aed-a442-246764cc492a', 'direct', NULL, 2, '2025-10-06 10:16:58.000', '2025-10-06 10:16:58.000'),
(6, 'add20880-517f-452c-a066-abfbcab82cea', 'group', 'GT 11', 2, '2025-10-07 09:30:03.000', '2025-10-07 09:30:03.000'),
(7, 'c2c65576-9274-4bfe-8588-a962ca2eae3d', 'group', 'GT 22', 3, '2025-10-08 06:25:45.000', '2025-10-08 06:25:44.000'),
(8, 'a836072f-0366-4bb4-87be-8e66c7836f8c', 'direct', NULL, 2, '2025-10-08 06:54:41.000', '2025-10-08 06:54:40.000'),
(9, '7d93f115-4ef3-4da5-b68d-052f684ca3a2', 'direct', NULL, 3, '2025-10-08 08:51:21.000', '2025-10-08 08:51:20.000'),
(10, '8290e89f-9d37-44c4-98a1-5d42c2c95a44', 'direct', NULL, 2, '2025-10-09 09:49:13.000', '2025-10-09 09:49:13.000'),
(11, 'd2f73077-871e-407c-9587-5815b40aa942', 'direct', NULL, 2, '2025-10-09 09:50:07.000', '2025-10-09 09:50:06.000'),
(12, '76fb46e9-d434-4809-abfe-2802b4489e2f', 'direct', NULL, 2, '2025-10-09 09:53:02.000', '2025-10-09 09:53:01.000'),
(13, '70a8c718-730c-4716-b2e4-f9a114a397a8', 'direct', NULL, 2, '2025-10-09 09:57:57.000', '2025-10-09 09:57:56.000'),
(14, 'c86e6824-9997-4cba-bc7f-6c145a09c3b8', 'direct', NULL, 2, '2025-10-10 06:11:34.000', '2025-10-10 06:11:34.000'),
(15, 'f67406a5-e058-429b-b589-fdd503d79e21', 'group', 'MK 22', 2, '2025-10-14 08:51:25.000', '2025-10-14 08:51:25.000'),
(16, '822e7530-2a6b-4a61-af80-9942c41f09b5', 'direct', NULL, 1, '2026-02-22 09:02:29.000', '2026-02-22 09:02:29.000');

-- --------------------------------------------------------

--
-- Table structure for table `conversation_members`
--

DROP TABLE IF EXISTS `conversation_members`;
CREATE TABLE IF NOT EXISTS `conversation_members` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `conversation_id` int NOT NULL,
  `user_id` int NOT NULL,
  `joined_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `conversationMembers_uuid_unique` (`uuid`),
  KEY `conversationId` (`conversation_id`),
  KEY `userId` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=86 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `conversation_members`
--

INSERT INTO `conversation_members` (`id`, `uuid`, `conversation_id`, `user_id`, `joined_at`, `updated_at`) VALUES
(1, '684f1f5c-a96f-4db4-b9e2-95aa18dac5b3', 1, 2, '2025-10-03 05:48:45.000', '2025-10-03 05:48:45.000'),
(2, 'fffd38fe-0e63-4f2a-bfe7-cff68de17fdb', 1, 3, '2025-10-03 05:48:45.000', '2025-10-03 05:48:45.000'),
(35, '73db9832-c705-4987-a5a7-15115089a453', 2, 2, '2025-10-03 12:20:27.000', '2025-10-03 12:20:27.000'),
(36, 'd3ee3712-ea6e-490b-b154-a7951ee320a2', 2, 4, '2025-10-03 12:20:27.000', '2025-10-03 12:20:27.000'),
(37, '07c7c26b-83c4-49a7-b5e4-b47776399eed', 3, 2, '2025-10-03 12:20:34.000', '2025-10-03 12:20:34.000'),
(38, 'a0652cd1-583a-4af1-9ef9-80f1018bb203', 3, 5, '2025-10-03 12:20:34.000', '2025-10-03 12:20:34.000'),
(39, 'f2833324-0943-499b-88b4-9572b2281540', 4, 2, '2025-10-03 12:20:41.000', '2025-10-03 12:20:41.000'),
(40, '69a24fdf-fe5c-4369-a2bf-dbcf5938ce5d', 4, 6, '2025-10-03 12:20:41.000', '2025-10-03 12:20:41.000'),
(41, '6938450a-0911-465d-a785-ea7fb9045196', 5, 2, '2025-10-06 10:16:58.000', '2025-10-06 10:16:58.000'),
(42, 'e027651f-84d4-4211-bd75-ac3d0506630c', 5, 79, '2025-10-06 10:16:58.000', '2025-10-06 10:16:58.000'),
(43, '08b5aa9a-96c4-414d-8abb-d67377c682e5', 6, 2, '2025-10-07 09:30:03.000', '2025-10-07 09:30:03.000'),
(44, '16df99b5-e589-4bd9-9a41-c81f0a82917d', 6, 3, '2025-10-07 09:30:03.000', '2025-10-07 09:30:03.000'),
(45, '3db8f764-f031-4125-b5a1-e06e2682916a', 6, 4, '2025-10-07 09:30:03.000', '2025-10-07 09:30:03.000'),
(46, '2a4fb5a2-ec9c-4180-9c72-2f5f2ad219a4', 6, 5, '2025-10-07 09:30:03.000', '2025-10-07 09:30:03.000'),
(47, '1cadb627-a666-49fd-8a5a-484882adc91d', 6, 6, '2025-10-07 09:30:03.000', '2025-10-07 09:30:03.000'),
(48, '75a7e687-195a-480d-9a5f-2e2418c8ec57', 6, 7, '2025-10-07 09:30:03.000', '2025-10-07 09:30:03.000'),
(49, 'effcd208-69ba-450e-8763-aee7025a2bf5', 7, 3, '2025-10-08 06:25:44.000', '2025-10-08 06:25:44.000'),
(50, '638d1298-90b0-4888-a2c5-dfa94dbaa2d8', 7, 4, '2025-10-08 06:25:44.000', '2025-10-08 06:25:44.000'),
(51, 'f676f957-e060-488a-962a-52084040c429', 7, 5, '2025-10-08 06:25:44.000', '2025-10-08 06:25:44.000'),
(52, '6b270de4-c423-4ab6-8043-e897d6458680', 7, 6, '2025-10-08 06:25:44.000', '2025-10-08 06:25:44.000'),
(53, '191a4986-3afe-4207-a5c1-5ded5f152873', 7, 7, '2025-10-08 06:25:44.000', '2025-10-08 06:25:44.000'),
(54, '3ab17076-dd43-4c34-841a-e4a837cf561b', 8, 2, '2025-10-08 06:54:40.000', '2025-10-08 06:54:40.000'),
(55, '21fe0fdf-2879-46c0-8ec3-9daf10417e15', 8, 9, '2025-10-08 06:54:40.000', '2025-10-08 06:54:40.000'),
(56, 'b64af5b5-5409-4ed4-a4f9-e4b9bf40d692', 9, 3, '2025-10-08 08:51:20.000', '2025-10-08 08:51:20.000'),
(57, '36230e6f-d254-4fda-b982-a6d1f4dd6dc6', 9, 9, '2025-10-08 08:51:20.000', '2025-10-08 08:51:20.000'),
(66, 'f8c0de71-fe21-4bd3-86eb-caebdec90ceb', 10, 2, '2025-10-09 09:49:13.000', '2025-10-09 09:49:13.000'),
(67, '43985204-86c8-4a09-ab2b-b9bd0271bb0e', 10, 63, '2025-10-09 09:49:13.000', '2025-10-09 09:49:13.000'),
(68, 'eb675d18-4766-4c86-a75e-cabd708bd489', 11, 2, '2025-10-09 09:50:06.000', '2025-10-09 09:50:06.000'),
(69, 'ec743c1c-278f-49d1-866f-ba1498ea49b8', 11, 104, '2025-10-09 09:50:06.000', '2025-10-09 09:50:06.000'),
(70, 'b5827a95-1684-4212-89a2-15c649a6b337', 12, 2, '2025-10-09 09:53:01.000', '2025-10-09 09:53:01.000'),
(71, 'c4435af4-bed5-4e4d-be07-74ffa3c73990', 12, 62, '2025-10-09 09:53:01.000', '2025-10-09 09:53:01.000'),
(72, 'b9db4dc8-6f46-43cf-ba86-097e084fb8bf', 13, 2, '2025-10-09 09:57:56.000', '2025-10-09 09:57:56.000'),
(73, '5610e538-4eca-4072-b53c-84eb9bb8b8ff', 13, 60, '2025-10-09 09:57:56.000', '2025-10-09 09:57:56.000'),
(74, '6d377b45-74e0-452d-9190-6c02ca6ed786', 14, 2, '2025-10-10 06:11:34.000', '2025-10-10 06:11:34.000'),
(75, '593088d5-4593-4019-8cea-2bd708db96b2', 14, 28, '2025-10-10 06:11:34.000', '2025-10-10 06:11:34.000'),
(76, 'a50b4f09-dd85-41dc-871d-356800019162', 15, 2, '2025-10-14 08:51:25.000', '2025-10-14 08:51:25.000'),
(77, 'edebde95-ff0c-4bb6-8af6-a7bf8b268677', 15, 9, '2025-10-14 08:51:25.000', '2025-10-14 08:51:25.000'),
(78, '30bbbb3b-bea1-401a-8687-b9693826a530', 15, 63, '2025-10-14 08:51:25.000', '2025-10-14 08:51:25.000'),
(79, '1f1dfba8-fa99-4197-bed2-b1d80d25a5d9', 15, 60, '2025-10-14 08:51:25.000', '2025-10-14 08:51:25.000'),
(80, '88dcc287-57a3-477e-8d9f-4a46fa326934', 15, 53, '2025-10-14 08:51:25.000', '2025-10-14 08:51:25.000'),
(81, 'c6e51104-4631-44ff-a655-2731220de1b7', 15, 24, '2025-10-14 08:51:25.000', '2025-10-14 08:51:25.000'),
(82, 'de15d93d-4113-40c6-9125-d467ae19f168', 15, 86, '2025-10-14 08:51:25.000', '2025-10-14 08:51:25.000'),
(83, '49140e48-8808-44de-ba52-169cd9bda8be', 15, 1, '2025-10-14 08:51:25.000', '2025-10-14 08:51:25.000'),
(84, '09d351aa-2b58-470d-9405-48966fe28815', 16, 1, '2026-02-22 09:02:29.000', '2026-02-22 09:02:29.000'),
(85, '0a640c56-c68c-4e3f-be55-460d841ac3f5', 16, 2, '2026-02-22 09:02:29.000', '2026-02-22 09:02:29.000');

-- --------------------------------------------------------

--
-- Table structure for table `lists`
--

DROP TABLE IF EXISTS `lists`;
CREATE TABLE IF NOT EXISTS `lists` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `board_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `position` int DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `lists_uuid_unique` (`uuid`),
  KEY `boardId` (`board_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
CREATE TABLE IF NOT EXISTS `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `conversation_id` int NOT NULL,
  `sender_id` int NOT NULL,
  `reply_to_message_id` int DEFAULT NULL,
  `message` text,
  `message_type` enum('text','file') NOT NULL DEFAULT 'text',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `messages_uuid_unique` (`uuid`),
  KEY `conversationId` (`conversation_id`),
  KEY `senderId` (`sender_id`),
  KEY `fk_reply_message` (`reply_to_message_id`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `uuid`, `conversation_id`, `sender_id`, `reply_to_message_id`, `message`, `message_type`, `created_at`, `updated_at`) VALUES
(1, 'da0c26fa-c970-465b-919a-6f31e96d3dcb', 1, 2, NULL, 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.', 'text', '2025-10-03 05:57:21.000', '2025-10-03 05:57:20.000'),
(2, '8d0a4231-0cc8-4799-8fa3-0ebd25771cb4', 1, 3, NULL, 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s.', 'text', '2025-10-03 06:09:46.000', '2025-10-03 06:09:46.000'),
(3, 'e20d0ae8-8d71-4090-b583-bdd85091a42f', 1, 2, NULL, 'Donec luctus nibh leo, efficitur laoreet quam cursus id. Cras finibus eu elit at fermentum. Suspendisse at hendrerit eros. Donec ut cursus leo. Vestibulum congue orci a turpis bibendum consectetur.', 'text', '2025-10-03 06:11:47.000', '2025-10-03 06:11:47.000'),
(4, '39da068c-dc85-4747-908b-f3c677690b81', 1, 2, NULL, '11 Donec luctus nibh leo, efficitur laoreet quam cursus id. Cras finibus eu elit at fermentum. Suspendisse at hendrerit eros. Donec ut cursus leo. Vestibulum congue orci a turpis bibendum consectetur.', 'text', '2025-10-03 06:18:27.000', '2025-10-03 06:18:27.000'),
(5, '216c4c51-9bf3-4644-8468-1e3db3fa0278', 1, 2, NULL, '22  Donec luctus nibh leo, efficitur laoreet quam cursus id. Cras finibus eu elit at fermentum. Suspendisse at hendrerit eros. Donec ut cursus leo. Vestibulum congue orci a turpis bibendum consectetur.', 'text', '2025-10-03 06:21:39.000', '2025-10-03 06:21:38.000'),
(6, '9dbc04d4-1586-4737-86e8-e432f4056c97', 1, 2, NULL, '33 Donec luctus nibh leo, efficitur laoreet quam cursus id. Cras finibus eu elit at fermentum. Suspendisse at hendrerit eros. Donec ut cursus leo. Vestibulum congue orci a turpis bibendum consectetur.', 'text', '2025-10-03 06:25:59.000', '2025-10-03 06:25:58.000'),
(7, '1c5e58ca-3f1f-4b7c-95ea-966b0f7bf83b', 1, 2, NULL, '', 'file', '2025-10-03 06:39:40.000', '2025-10-03 06:39:40.000'),
(8, '57a692fc-e599-4215-8412-944434bb3bf5', 1, 2, NULL, '44  Donec luctus nibh leo, efficitur laoreet quam cursus id. Cras finibus eu elit at fermentum. Suspendisse at hendrerit eros. Donec ut cursus leo. Vestibulum congue orci a turpis bibendum consectetur.Donec luctus nibh leo, efficitur laoreet quam cursus id. Cras finibus eu elit at fermentum. Suspendisse at hendrerit eros. Donec ut cursus leo. Vestibulum congue orci a turpis bibendum consectetur.', 'text', '2025-10-03 06:39:59.000', '2025-10-03 06:39:58.000'),
(9, '7b66733b-7222-4426-87c3-3998397070b1', 1, 3, NULL, '44  Donec luctus nibh leo, efficitur laoreet quam cursus id. Cras finibus eu elit at fermentum. Suspendisse at hendrerit eros. Donec ut cursus leo. Vestibulum congue orci a turpis bibendum consectetur.Donec luctus nibh leo, efficitur laoreet quam cursus id. Cras finibus eu elit at fermentum. Suspendisse at hendrerit eros. Donec ut cursus leo. Vestibulum congue orci a turpis bibendum consectetur.', 'text', '2025-10-03 08:13:29.000', '2025-10-03 08:13:29.000'),
(10, '5bd85e01-e208-45ea-9ae0-a1cd93a94767', 1, 2, NULL, 'sa', 'text', '2025-10-07 04:47:49.000', '2025-10-07 04:47:49.000'),
(11, '7b5d9277-92a3-4aa3-9abc-9260829963fd', 1, 2, NULL, '😃 dasdasdasdasd', 'text', '2025-10-07 04:52:40.000', '2025-10-07 04:52:40.000'),
(12, 'c4e55bf8-b5c1-4056-8644-1bf59a6a9671', 1, 2, NULL, 'Donec luctus nibh leo, efficitur laoreet quam cursus id. Cras finibus eu elit at fermentum. Suspendisse at hendrerit eros', 'file', '2025-10-07 04:53:21.000', '2025-10-07 04:53:21.000'),
(13, 'f74ffeea-6313-48a4-b766-7499f23d36f5', 1, 2, NULL, 'sdfdsfsf', 'text', '2025-10-07 04:54:18.000', '2025-10-07 04:54:18.000'),
(14, '7ddc03a7-549b-40ca-a4df-c3fe45d005dd', 1, 2, NULL, '😘', 'text', '2025-10-07 04:54:33.000', '2025-10-07 04:54:33.000'),
(15, '26ff1ca9-fb2e-4824-bdbd-bff1b1f6061c', 1, 2, NULL, '😗☺️😚😃 dsf', 'text', '2025-10-07 04:54:59.000', '2025-10-07 04:54:58.000'),
(16, '5c66850d-dcfe-4d83-8fcc-f209a97f3d31', 1, 2, NULL, 'ssss', 'text', '2025-10-07 05:22:07.000', '2025-10-07 05:22:06.000'),
(17, '13b26386-4640-40cc-92ed-b75584940ddf', 1, 2, NULL, 'qqqqqqqqqqqq', 'text', '2025-10-07 05:24:40.000', '2025-10-07 05:24:40.000'),
(18, '67cf3126-87cc-47e3-823e-b92494f9b287', 1, 2, NULL, 'weewqewqe😄', 'file', '2025-10-07 05:24:57.000', '2025-10-07 05:24:56.000'),
(19, 'cbae323d-c534-4576-b921-1d9bdcf1f204', 1, 2, NULL, '1111', 'text', '2025-10-07 06:52:46.000', '2025-10-07 06:52:45.000'),
(20, 'b28d0633-c58c-4be0-9cd2-346dafaddca8', 1, 3, NULL, 'AAAA😋', 'text', '2025-10-07 08:05:30.000', '2025-10-07 08:05:29.000'),
(21, '62c18fa4-9878-4375-82a5-a9f285bf8375', 1, 2, NULL, 'ss', 'text', '2025-10-07 10:07:29.000', '2025-10-07 10:07:28.000'),
(22, '73a225bb-8293-49fa-a1c1-434aac0f646c', 1, 2, NULL, '11111111', 'text', '2025-10-07 10:07:50.000', '2025-10-07 10:07:50.000'),
(23, 'cc1006e3-5c5e-4036-b97b-4f06d1c32ad6', 1, 2, NULL, 'dfsf', 'text', '2025-10-07 10:17:41.000', '2025-10-07 10:17:41.000'),
(24, '1930df7b-5014-447c-9277-0ccfac4ab7c2', 6, 2, NULL, 'asda', 'text', '2025-10-08 07:51:43.000', '2025-10-08 07:51:42.000'),
(25, 'dc738ef0-950f-4b53-b31b-efc3e373a80e', 6, 2, NULL, 'dsadsad asdsad', 'text', '2025-10-08 08:45:14.000', '2025-10-08 08:45:13.000'),
(26, '04bdd282-ae54-4bd3-9df4-bdd530a8eab3', 6, 2, NULL, '', 'file', '2025-10-08 08:45:23.000', '2025-10-08 08:45:23.000'),
(27, '83ded5dc-c303-4e6a-8cca-267d7dd76281', 9, 3, NULL, 'ss', 'text', '2025-10-08 08:51:25.000', '2025-10-08 08:51:24.000'),
(28, 'a8680526-96df-4a73-beb8-ad7fdaf0341d', 6, 3, NULL, 'saSAsd', 'text', '2025-10-08 08:52:05.000', '2025-10-08 08:52:04.000'),
(29, 'ad2f3d5b-a245-4650-8632-711dae373a92', 1, 2, NULL, 'Xsas', 'text', '2025-10-08 10:09:24.000', '2025-10-08 10:09:24.000'),
(30, '9ed62461-9061-47c0-8abe-9c216c1b2b34', 1, 2, NULL, 'Donec luctus nibh leo, efficitur laoreet quam cursus id. Cras finibus eu elit at fermentum. Suspendisse at hendrerit erosDonec luctus nibh leo, efficitur laoreet quam cursus id. Cras finibus eu elit at fermentum. Suspendisse at hendrerit erosDonec luctus nibh leo, efficitur laoreet quam cursus id. Cras finibus eu elit at fermentum. Suspendisse at hendrerit eros', 'text', '2025-10-08 10:11:36.000', '2025-10-08 10:11:35.000'),
(31, '36866fc0-fa18-44e6-8f73-22563d7e5437', 1, 2, NULL, 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s.', 'text', '2025-10-08 10:13:37.000', '2025-10-08 10:13:37.000'),
(32, 'bf4c7937-a988-4236-a845-548f9cacdcf3', 1, 2, NULL, 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s.', 'text', '2025-10-08 10:13:40.000', '2025-10-08 10:13:39.000'),
(33, 'ade3f38c-52ed-4b00-8113-c168e69562ba', 1, 2, NULL, 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s.', 'text', '2025-10-08 10:13:43.000', '2025-10-08 10:13:42.000'),
(34, '45b89938-01a0-4534-9ee5-2270f8844101', 1, 3, NULL, 'XYX 11', 'text', '2025-10-08 10:34:31.000', '2025-10-08 10:34:31.000'),
(35, 'cd7b049a-1677-4ec9-96da-1f686e82081b', 2, 2, NULL, 'xcxzczc', 'text', '2025-10-09 08:52:53.000', '2025-10-09 08:52:52.000'),
(36, 'c3b4276a-cf57-4a1c-b835-4b211535e365', 1, 2, NULL, 'Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s.Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s.', 'text', '2025-10-09 08:53:48.000', '2025-10-09 08:53:47.000'),
(40, 'cd2fbc9d-3ad8-4ee9-988c-fbf0b72f9f26', 14, 2, NULL, 'sdsa', 'text', '2025-10-10 07:29:16.000', '2025-10-10 07:29:15.000'),
(41, 'dc5b73cf-25f2-4c4b-ba93-5bfae8141a2b', 1, 2, NULL, '44  Donec luctus nibh leo, efficitur laoreet quam cursus id. Cras finibus eu elit at fermentum. Suspendisse at hendrerit eros. Donec ut cursus leo. Vestibulum congue orci a turpis bibendum consectetur.Donec luctus nibh leo, efficitur laoreet quam cursus id. Cras finibus eu elit at fermentum. Suspendisse at hendrerit eros. Donec ut cursus leo. Vestibulum congue orci a turpis bibendum consectetur.', 'text', '2025-10-10 07:54:52.000', '2025-10-10 07:54:51.000'),
(42, '0f4ef996-39e0-4534-a885-eb6c679f3057', 1, 2, NULL, 'ok', 'text', '2025-10-10 08:10:22.000', '2025-10-10 08:10:22.000'),
(43, 'df6100a8-922e-43db-9ddf-d084494930da', 1, 2, 42, 'asdasd', 'text', '2025-10-10 09:29:32.000', '2025-10-10 09:29:32.000'),
(44, 'd3f8adac-10f4-4c76-8a58-f05614c1c257', 1, 2, 41, 'ok', 'text', '2025-10-10 09:33:36.000', '2025-10-10 09:33:36.000'),
(45, '54850ed8-b967-4343-8e58-bf6be9df0309', 1, 2, 16, 'qq', 'text', '2025-10-16 06:57:33.000', '2025-10-16 06:57:33.000'),
(46, '18d9ef1c-f541-4ae6-af9a-b174d477fed1', 1, 2, NULL, 'dsadsad', 'text', '2025-10-16 08:15:35.000', '2025-10-16 08:15:35.000'),
(47, 'f9d956bb-8f52-47f6-bedb-8ded77456cc6', 1, 2, 46, 'df', 'text', '2025-10-16 08:16:00.000', '2025-10-16 08:16:00.000'),
(48, '76dd2fcd-e222-4705-8e05-f7401d47f5e4', 1, 2, 41, 'vxv', 'text', '2025-10-16 08:16:06.000', '2025-10-16 08:16:06.000'),
(49, 'c4b3eab9-8c6b-4947-adc5-b77dbbb28e69', 1, 2, NULL, 'ddgfdg', 'text', '2025-10-16 08:20:01.000', '2025-10-16 08:20:00.000'),
(50, 'e784c28e-8deb-486f-ab76-4f38ef462c6d', 1, 2, NULL, 'xzc cxvxcvb cvbcvbvc', 'text', '2025-10-16 08:20:12.000', '2025-10-16 08:20:12.000'),
(51, '5ade3006-b654-402e-a90d-356da8dbd487', 1, 2, NULL, 'dxcvcxv', 'text', '2025-10-16 08:20:20.000', '2025-10-16 08:20:20.000'),
(52, '5e7855da-41fb-4b37-9b51-59bafd3c6fb4', 14, 2, NULL, 'czczxczx', 'text', '2025-10-16 08:22:55.000', '2025-10-16 08:22:54.000'),
(53, 'cd7c6b9b-cff9-4f76-ad6a-0b89a4a86895', 14, 2, NULL, 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', 'text', '2025-10-16 08:23:21.000', '2025-10-16 08:23:20.000'),
(54, 'e3c20928-faf7-464f-a52b-69d6f0a8e1e5', 14, 2, 53, 'x', 'text', '2025-10-16 08:23:28.000', '2025-10-16 08:23:27.000'),
(55, 'a0f4197d-3158-43ad-8d10-ebcead732e31', 14, 2, NULL, 'bcvcvb', 'text', '2025-10-16 08:43:34.000', '2025-10-16 08:43:33.000'),
(56, '432c6239-3ee3-4e8a-a24a-604323088cab', 14, 2, NULL, 'aaaaaaa', 'text', '2025-10-16 08:43:41.000', '2025-10-16 08:43:41.000'),
(57, 'ee0e3f35-0239-4739-9e50-6ead8550edf1', 14, 2, NULL, 'Xszczxcxzcczxczx', 'text', '2025-10-17 08:33:47.000', '2025-10-17 08:33:47.000'),
(58, '8d7240d8-eb78-4107-b39a-978fa56b6903', 14, 2, 57, 'xdsadasdasd', 'text', '2025-10-17 08:33:54.000', '2025-10-17 08:33:54.000'),
(59, '69c35bdd-1340-48bd-a8cc-62e04ae986b3', 1, 3, NULL, '44  Donec luctus nibh leo, efficitur laoreet quam cursus id. Cras finibus eu elit at fermentum. Suspendisse at hendrerit eros. Donec ut cursus leo. Vestibulum congue orci a turpis bibendum consectetur.Donec luctus nibh leo, efficitur laoreet quam cursus id. Cras finibus eu elit at fermentum. Suspendisse at hendrerit eros. Donec ut cursus leo. Vestibulum congue orci a turpis bibendum consectetur.', 'text', '2025-10-17 08:38:43.000', '2025-10-17 08:38:43.000'),
(60, 'a0af744c-9e70-441d-9918-11f5a910f69e', 1, 3, NULL, 'Donec luctus nibh leo, efficitur laoreet quam cursus id. Cras finibus eu elit at fermentum. Suspendisse at hendrerit eros. Donec ut cursus leo. Vestibulum congue orci a turpis bibendum consectetur.Donec luctus nibh leo, efficitur laoreet quam cursus id. Cras finibus eu elit at fermentum. Suspendisse at hendrerit eros. Donec ut cursus leo. Vestibulum congue orci a turpis bibendum consectetur.', 'text', '2025-10-17 08:39:28.000', '2025-10-17 08:39:28.000'),
(61, '9ae7c4c5-237d-409c-aa83-47265cbdb5b1', 1, 3, NULL, ' Vestibulum congue orci a turpis bibendum consectetur.Donec luctus nibh leo, efficitur laoreet quam cursus id. Cras finibus eu elit at fermentum. Suspendisse at hendrerit eros. Donec ut cursus leo. Vestibulum congue orci a turpis bibendum consectetur.', 'text', '2025-10-17 08:58:12.000', '2025-10-17 08:58:11.000');

-- --------------------------------------------------------

--
-- Table structure for table `message_files`
--

DROP TABLE IF EXISTS `message_files`;
CREATE TABLE IF NOT EXISTS `message_files` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `message_id` int NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `file_type` varchar(50) DEFAULT NULL,
  `file_size` bigint DEFAULT NULL,
  `uploaded_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `messageFiles_uuid_unique` (`uuid`),
  KEY `messageId` (`message_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `message_files`
--

INSERT INTO `message_files` (`id`, `uuid`, `message_id`, `file_path`, `file_type`, `file_size`, `uploaded_at`, `updated_at`) VALUES
(1, '23c0ed68-1ac9-49f2-913c-bcc00fcc56c9', 4, 'http://localhost:8000/uploads/chat/1759472307192-443801129.png', 'image/png', 2815, '2025-10-03 06:18:27.000', '2025-10-03 06:18:27.000'),
(2, '35709144-d309-430b-86c2-7a7405a4480b', 5, 'http://localhost:8000/uploads/chat/1759472498650-73518727.png', 'image/png', 2815, '2025-10-03 06:21:38.000', '2025-10-03 06:21:38.000'),
(3, 'bb55a60b-7d0c-40b7-9644-04b9c0a23094', 5, 'http://localhost:8000/uploads/chat/1759472498651-982856634.jpg', 'image/jpeg', 5744, '2025-10-03 06:21:38.000', '2025-10-03 06:21:38.000'),
(4, 'b900a380-2e44-4dd7-ac8d-66a83883430d', 6, 'http://localhost:8000/uploads/chat/1759472758472-627932111.PDF', 'application/pdf', 75981, '2025-10-03 06:25:58.000', '2025-10-03 06:25:58.000'),
(5, 'd42c4394-a153-4a0e-b781-748a82b73831', 7, 'http://localhost:8000/uploads/chat/1759473580051-231925459.PDF', 'application/pdf', 75981, '2025-10-03 06:39:40.000', '2025-10-03 06:39:40.000'),
(6, '18c9a110-5067-4378-a9b3-c1b0183f29dd', 8, 'http://localhost:8000/uploads/chat/1759473598646-18478472.PDF', 'application/pdf', 75981, '2025-10-03 06:39:58.000', '2025-10-03 06:39:58.000'),
(7, '21cbcef2-7988-4725-b2fa-79c0a12b1980', 9, 'http://localhost:8000/uploads/chat/1759479209219-15933710.PDF', 'application/pdf', 75981, '2025-10-03 08:13:29.000', '2025-10-03 08:13:29.000'),
(8, '9d21b7e2-f138-443c-9edd-3cde8489925c', 12, 'http://localhost:8000/uploads/chat/1759812800994-375789527.png', 'image/png', 23957, '2025-10-07 04:53:21.000', '2025-10-07 04:53:21.000'),
(9, 'f24ad11c-3a37-45b8-b95e-9acc7a50b71b', 18, 'http://localhost:8000/uploads/chat/1759814696608-642019947.jpg', 'image/jpeg', 68174, '2025-10-07 05:24:56.000', '2025-10-07 05:24:56.000'),
(10, 'e033d548-4dbb-4eba-b34f-9823a01b2f96', 26, 'http://localhost:8000/uploads/chat/1759913123081-873790160.png', 'image/png', 38366, '2025-10-08 08:45:23.000', '2025-10-08 08:45:23.000'),
(11, 'ca218152-01da-44f9-a583-70ef1365aa2e', 60, 'http://localhost:8000/uploads/chat/1760690368296-908505988.pdf', 'application/pdf', 229991, '2025-10-17 08:39:28.000', '2025-10-17 08:39:28.000'),
(12, 'd4c60900-5b4c-48e1-bf61-e46c1b1f56a6', 61, 'http://localhost:8000/uploads/chat/1760691491649-648270269.pdf', 'application/pdf', 229991, '2025-10-17 08:58:11.000', '2025-10-17 08:58:11.000');

-- --------------------------------------------------------

--
-- Table structure for table `message_status`
--

DROP TABLE IF EXISTS `message_status`;
CREATE TABLE IF NOT EXISTS `message_status` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `message_id` int NOT NULL,
  `user_id` int NOT NULL,
  `status` enum('sent','delivered','read') DEFAULT 'sent',
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `messageStatus_uuid_unique` (`uuid`),
  KEY `messageId` (`message_id`),
  KEY `userId` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=139 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `message_status`
--

INSERT INTO `message_status` (`id`, `uuid`, `message_id`, `user_id`, `status`, `updated_at`) VALUES
(1, 'a350b28f-5ca2-4b67-898a-6516b8134e8e', 1, 2, 'read', '2025-10-03 08:04:48.000'),
(2, '49a4b0ba-f46c-435e-9e64-24dcec4c1875', 1, 3, 'read', '2025-10-08 10:17:55.000'),
(3, '269b6720-ec42-4171-8457-43b3a9e4cf6d', 2, 2, 'read', '2025-10-07 10:08:45.000'),
(4, 'd0a68aaa-8269-479b-b89e-44de89c3863e', 2, 3, 'read', '2025-10-08 10:17:55.000'),
(5, '58225bd7-8138-4499-ba2d-cb5721bf17ab', 3, 2, 'read', '2025-10-07 10:08:45.000'),
(6, '708d9a1e-2f58-41b3-9d84-f3f8f455ff57', 3, 3, 'read', '2025-10-08 10:17:55.000'),
(7, '9e4e660e-bfff-49a7-b2d3-c8442fb2091a', 4, 2, 'read', '2025-10-07 10:08:45.000'),
(8, '95761993-e44f-4c2e-9e95-e7a9e5641003', 4, 3, 'read', '2025-10-08 10:17:55.000'),
(9, 'cc3eb145-12bc-426c-841d-59b8404f0eec', 5, 3, 'read', '2025-10-08 10:17:55.000'),
(10, '327d6b73-3283-4f94-94bd-df08684f7225', 5, 2, 'read', '2025-10-07 10:35:05.000'),
(11, 'e69d17a1-9f0e-4aec-b76c-78dcc35a512d', 6, 2, 'read', '2025-10-07 10:08:44.000'),
(12, '8ec00920-7546-4caf-829b-66fe79ded7ef', 6, 3, 'read', '2025-10-08 10:17:55.000'),
(13, 'f9f84497-c865-4645-ad8b-b1917d564bd2', 7, 2, 'read', '2025-10-07 10:08:44.000'),
(14, 'fd34a738-785d-42e9-ad41-b79b6acbef47', 7, 3, 'read', '2025-10-08 10:17:55.000'),
(15, 'b8f531fa-7655-4d23-84a9-0cd8a462c187', 8, 2, 'read', '2025-10-07 10:08:44.000'),
(16, '3a4b8eb8-5c40-48ae-a387-f34b0a41f7aa', 8, 3, 'read', '2025-10-08 10:17:55.000'),
(17, '90852500-bc61-4da4-be66-6abc3db23127', 9, 2, 'read', '2025-10-07 10:08:44.000'),
(18, 'a9944680-dfc7-4cb4-a193-8c176273b0fe', 9, 3, 'read', '2025-10-08 10:17:55.000'),
(19, '25f3bae9-3c6b-4f6a-b36c-777137887031', 10, 3, 'read', '2025-10-08 10:17:55.000'),
(20, '0a3e9bae-b36e-4c71-9707-6298ced0fe2c', 10, 2, 'read', '2025-10-07 10:08:44.000'),
(21, '57893ecf-6d0f-417c-acb1-b86ba67df899', 11, 2, 'read', '2025-10-07 10:08:44.000'),
(22, '22c23216-2ca8-4744-8f52-75494891eb78', 11, 3, 'read', '2025-10-08 10:17:55.000'),
(23, 'fb06b222-bb6a-431e-abaf-e94b52c81e2a', 12, 2, 'read', '2025-10-07 10:08:44.000'),
(24, '8b297499-5e45-4990-8648-6b394317609a', 12, 3, 'read', '2025-10-08 10:17:55.000'),
(25, '28b31467-6f39-4c0a-aa90-aafc385bca42', 13, 2, 'read', '2025-10-07 10:08:44.000'),
(26, '36f850ac-119f-496e-b61d-b9e35db2eb5d', 13, 3, 'read', '2025-10-08 10:17:55.000'),
(27, '0a0ff3bc-2318-46b3-a4d3-183f0c4292ea', 14, 2, 'read', '2025-10-07 10:08:44.000'),
(28, '3dcb0d39-718d-4610-9b78-10d367bfea60', 14, 3, 'read', '2025-10-08 08:51:13.000'),
(29, 'a1c52a8d-1360-406a-99a5-d2da980022ab', 15, 2, 'read', '2025-10-07 10:07:43.000'),
(30, '51a0505f-5d8d-403f-b3ee-d9459c5bd496', 15, 3, 'read', '2025-10-08 08:51:13.000'),
(31, 'cc0a568e-f1fe-4d8a-8d89-2079a74aa39f', 16, 2, 'read', '2025-10-07 10:07:42.000'),
(32, '4c458e2a-25aa-4768-9d33-5c5db40fd217', 16, 3, 'read', '2025-10-08 08:51:13.000'),
(33, '7dede84e-59ae-4437-ab03-f9992fe4b2d7', 17, 2, 'read', '2025-10-07 10:07:42.000'),
(34, '9163e21e-b2ff-4481-9b4f-04c1e50bcd3d', 17, 3, 'read', '2025-10-08 08:45:37.000'),
(35, '0b4787a7-1014-4c06-9a6c-b735b6abbaa7', 18, 3, 'read', '2025-10-08 08:45:37.000'),
(36, 'd15f97f1-30da-4a7d-ba88-6b8106ecf9a8', 18, 2, 'read', '2025-10-07 10:07:41.000'),
(37, '5d90f80e-f7a0-4110-9124-bff206f463d9', 19, 2, 'read', '2025-10-07 10:07:41.000'),
(38, '923a2373-1d3a-4516-bbca-1381113356bc', 19, 3, 'read', '2025-10-08 08:45:37.000'),
(39, '679cb085-70f4-46c5-8d4d-fdb448440954', 20, 2, 'read', '2025-10-07 10:07:41.000'),
(40, '87fd4aaa-97ca-490f-bce5-79336428dbda', 20, 3, 'read', '2025-10-08 08:45:37.000'),
(41, 'ad35e65d-36af-429a-81f8-02caf9d3cf69', 21, 2, 'read', '2025-10-07 10:07:29.000'),
(42, '5da5b790-abf2-41d4-9723-3ef9d7496b13', 21, 3, 'read', '2025-10-08 10:29:13.000'),
(43, '02043704-4d1a-464d-bab4-1c7cffc94bbf', 22, 3, 'read', '2025-10-08 10:29:13.000'),
(44, 'cd277e26-9de0-4552-993c-6aefd3d70ec2', 22, 2, 'read', '2025-10-07 10:07:50.000'),
(45, 'a4902e1c-72c0-48f6-bbde-4a270ee669a0', 23, 2, 'read', '2025-10-07 10:17:42.000'),
(46, '95c2a707-5017-4e0d-8480-3f4639d8bc24', 23, 3, 'read', '2025-10-08 10:29:13.000'),
(47, '1c8650c2-e6b1-4c40-bb67-3e1239b7b57e', 24, 2, 'read', '2025-10-08 07:51:45.000'),
(48, '97614640-af24-495f-b28d-3406f4099eb9', 24, 3, 'read', '2025-10-08 08:45:52.000'),
(49, '5cf6a5f8-5157-4207-977e-55af50fefb18', 24, 4, 'delivered', '2025-10-08 07:51:43.000'),
(50, '8cabe700-5661-4102-92ef-80f346e8478a', 24, 7, 'delivered', '2025-10-08 07:51:43.000'),
(51, '01a1a8c5-b5ef-48a4-a365-30926e8eca0a', 24, 6, 'delivered', '2025-10-08 07:51:43.000'),
(52, '0dec8788-eb36-4015-884a-72a6b70ae484', 24, 5, 'delivered', '2025-10-08 07:51:43.000'),
(53, '453ca202-cb03-4509-875d-40571a702739', 25, 3, 'read', '2025-10-08 08:45:52.000'),
(54, 'fb22c4e7-4c55-4555-8609-4eee96203b63', 25, 5, 'delivered', '2025-10-08 08:45:14.000'),
(55, '38d33d52-db27-401b-aa0a-91b2ceccf756', 25, 4, 'delivered', '2025-10-08 08:45:14.000'),
(56, '28ef3d64-5f6a-4667-b5b5-a3df29a06c94', 25, 2, 'read', '2025-10-08 08:45:16.000'),
(57, 'f09e4503-8015-4596-aef8-4f76c286242f', 25, 6, 'delivered', '2025-10-08 08:45:14.000'),
(58, '7521ed6f-5efe-4ae1-8b17-9a9bdafd5707', 25, 7, 'delivered', '2025-10-08 08:45:14.000'),
(59, 'b5771270-566f-46a3-b176-ada28d9cc5d6', 26, 2, 'read', '2025-10-08 08:45:25.000'),
(60, 'eb138879-4d21-42fa-acd6-7372d28c2375', 26, 3, 'read', '2025-10-08 08:45:52.000'),
(61, 'c918e574-438a-4d58-8943-a443c65cf60e', 26, 4, 'delivered', '2025-10-08 08:45:23.000'),
(62, '5ec00ea1-8937-4070-9ee2-d2c7ccb92686', 26, 5, 'delivered', '2025-10-08 08:45:23.000'),
(63, 'e68e8c73-60b2-4e92-a43a-be4a67d2f1f0', 26, 6, 'delivered', '2025-10-08 08:45:23.000'),
(64, '29b58e8d-1b69-46e2-afa2-37ceb1f152aa', 26, 7, 'delivered', '2025-10-08 08:45:23.000'),
(65, '86976c92-d610-45ec-85e1-95461ff06291', 27, 9, 'delivered', '2025-10-08 08:51:25.000'),
(66, '650e1e9c-ce00-4f85-88f1-74ff9caa56d8', 27, 3, 'read', '2025-10-08 08:51:27.000'),
(67, 'abc21932-b438-4db2-b463-aa07d4b7257f', 28, 3, 'read', '2025-10-08 08:52:07.000'),
(68, '97d251e5-5496-41c4-b9af-e85ed7f60263', 28, 4, 'delivered', '2025-10-08 08:52:05.000'),
(69, '1f3ae2e0-7f5e-437c-96fc-6c5ade3fabec', 28, 5, 'delivered', '2025-10-08 08:52:05.000'),
(70, '9ec8af2f-77e6-404d-9808-228c169d0542', 28, 6, 'delivered', '2025-10-08 08:52:05.000'),
(71, 'fdf7c749-cfe8-450d-be09-ba94ee469fa0', 28, 2, 'read', '2025-10-08 08:52:14.000'),
(72, '72ed6121-a8ae-414f-8aa1-9664683e56cf', 28, 7, 'delivered', '2025-10-08 08:52:05.000'),
(73, 'd3579134-5edb-47bd-b58b-da81f1966732', 29, 2, 'read', '2025-10-08 10:09:28.000'),
(74, '9e2a079b-6cb1-4547-bba2-735b27221dd3', 29, 3, 'read', '2025-10-08 10:30:02.000'),
(75, '6cbb46af-1c9a-4834-8805-60cd01b3e4ca', 30, 2, 'read', '2025-10-08 10:11:38.000'),
(76, '8694e976-5dbb-48bc-99e6-3ee9e32d96f5', 30, 3, 'read', '2025-10-08 10:29:13.000'),
(77, '48ea444b-d5d2-4610-9d1e-97dc013f4a85', 31, 2, 'read', '2025-10-08 10:13:39.000'),
(78, 'd4de6b92-aa9f-4ef2-88b0-9a290d6901f3', 31, 3, 'read', '2025-10-08 10:29:13.000'),
(79, '8683e408-f545-4242-a72c-3c445d9a067f', 32, 2, 'read', '2025-10-08 10:13:42.000'),
(80, 'c3a6b919-52b3-423d-8878-218588cc8555', 32, 3, 'read', '2025-10-08 10:29:13.000'),
(81, 'c4d1febc-845e-4948-94da-24f1b4dbd01b', 33, 2, 'read', '2025-10-08 10:13:45.000'),
(82, '2d5ad39b-0663-4644-8617-28971c73d507', 33, 3, 'read', '2025-10-08 10:29:13.000'),
(83, 'bf913012-678e-41d2-b399-d84e960c6665', 34, 2, 'read', '2025-10-09 06:32:20.000'),
(84, '3ed06de5-83b4-40f6-8857-65d55d2b0b75', 34, 3, 'read', '2025-10-08 10:34:34.000'),
(85, '9350a869-68c3-42fa-8c8c-b2c5ffc3aacd', 35, 2, 'read', '2025-10-09 08:52:55.000'),
(86, 'bfd7a623-0b3c-4a07-b157-ef2a496fadcc', 35, 4, 'delivered', '2025-10-09 08:52:53.000'),
(87, '17962d3e-5e59-4c93-920a-1b55f11fc0f5', 36, 2, 'read', '2025-10-09 08:53:50.000'),
(88, '832e6451-6ced-47c2-8d70-d2241d10f5bc', 36, 3, 'delivered', '2025-10-09 08:53:48.000'),
(95, 'e44ba10e-647f-4a76-ad53-aba8ccb684d9', 40, 28, 'delivered', '2025-10-10 07:29:16.000'),
(96, 'cc6441e8-16ef-497d-8f3d-cdb66e39e7fb', 40, 2, 'read', '2025-10-10 07:29:18.000'),
(97, '7b77a956-d3b7-4899-9903-19a4286b7dd3', 41, 2, 'read', '2025-10-10 07:54:55.000'),
(98, 'b8e623da-0fc3-4497-aca9-f906738d9cfe', 41, 3, 'delivered', '2025-10-10 07:54:52.000'),
(99, '370a26e5-16fb-4d2a-8036-ea0934e16330', 42, 2, 'read', '2025-10-10 08:10:24.000'),
(100, '5087d07a-a75a-4331-9917-311a1c6b7043', 42, 3, 'delivered', '2025-10-10 08:10:22.000'),
(101, '73f4c43c-2eb5-43dd-aba1-1cc916f055a5', 43, 2, 'read', '2025-10-10 09:29:35.000'),
(102, 'e2e7d6ed-c408-4ceb-92c3-c079464bd204', 43, 3, 'delivered', '2025-10-10 09:29:32.000'),
(103, '8dcea31c-a45b-4a54-a29c-349fbb52b28c', 44, 2, 'read', '2025-10-10 09:33:38.000'),
(104, '31e6a539-3b50-484d-95d0-2f63d94048b8', 44, 3, 'delivered', '2025-10-10 09:33:36.000'),
(105, 'f520533a-10ed-4140-b013-8e3484ffa705', 45, 2, 'read', '2025-10-16 06:57:37.000'),
(106, '38f4bbb6-b15a-483a-92ee-cca215c81c10', 45, 3, 'delivered', '2025-10-16 06:57:34.000'),
(107, '521c0b4d-e44c-429b-bd79-9ba6670ca778', 46, 2, 'read', '2025-10-16 08:15:37.000'),
(108, 'c66fd113-6b63-4243-8fcd-c21bf6e66fc7', 46, 3, 'delivered', '2025-10-16 08:15:35.000'),
(109, '85e0ae31-1731-4d96-9d3c-a99dd1f0a845', 47, 2, 'read', '2025-10-16 08:16:02.000'),
(110, '12b412a6-1821-4e1a-9349-cfc2a7689f25', 47, 3, 'delivered', '2025-10-16 08:16:00.000'),
(111, '44a5c1cf-26e6-489d-9781-17095a8ca279', 48, 2, 'read', '2025-10-16 08:16:09.000'),
(112, 'a74e68d4-fcc5-435f-b8dd-60069a41123d', 48, 3, 'delivered', '2025-10-16 08:16:06.000'),
(113, '5281a884-52f2-4db2-af10-c40d7d0e1d80', 49, 2, 'read', '2025-10-16 08:20:06.000'),
(114, '820840e2-7122-4a10-9db5-219fe56aebcc', 49, 3, 'delivered', '2025-10-16 08:20:01.000'),
(115, '45034b30-a57a-48dc-b1f3-e6825c6a97c8', 50, 2, 'read', '2025-10-16 08:20:16.000'),
(116, '200048f4-f961-4aeb-93e4-f0b6b85bd7d8', 50, 3, 'delivered', '2025-10-16 08:20:12.000'),
(117, '3064041c-1c20-4e24-a9a4-f83aeb173a2d', 51, 2, 'read', '2025-10-16 08:20:24.000'),
(118, '7731ae50-fdc9-4e41-a9d4-4ea999ebfea9', 51, 3, 'delivered', '2025-10-16 08:20:20.000'),
(119, '756dae75-93e7-4378-829b-fd96acecfae2', 52, 28, 'delivered', '2025-10-16 08:22:55.000'),
(120, '27d3fba6-6b44-46f6-9de9-76d7ab5d08fb', 52, 2, 'read', '2025-10-16 08:23:01.000'),
(121, 'cc7f2ae7-bc85-4566-baaf-6488a72631c7', 53, 2, 'read', '2025-10-16 08:23:23.000'),
(122, '980cf136-27f5-4ff7-9918-1dfaaf37d14e', 53, 28, 'delivered', '2025-10-16 08:23:21.000'),
(123, '4a1e5bd4-6bbd-4022-8e72-ef9b711a8bba', 54, 2, 'read', '2025-10-16 08:23:30.000'),
(124, 'eeb009c4-cc43-4612-a4c5-2dbcfab3b909', 54, 28, 'delivered', '2025-10-16 08:23:28.000'),
(125, '2a2fab53-9bb9-429c-bf88-a1138c29bad8', 55, 2, 'read', '2025-10-16 08:43:36.000'),
(126, '33878296-6c92-434f-a56a-3c081679107a', 55, 28, 'delivered', '2025-10-16 08:43:34.000'),
(127, '36733ef4-3247-4ae0-acc1-354f4d93c7ae', 56, 2, 'read', '2025-10-16 08:43:43.000'),
(128, '803be607-553a-4516-a066-27682a17b2a0', 56, 28, 'delivered', '2025-10-16 08:43:41.000'),
(129, '90779bcc-a21b-42f2-ac95-6a5ca49ba721', 57, 2, 'read', '2025-10-17 08:33:49.000'),
(130, '1945eeb5-9301-49b0-8299-17f427ca2eb2', 57, 28, 'delivered', '2025-10-17 08:33:47.000'),
(131, '5fcf47b2-cce9-488b-8b5e-0bfbd7a4115d', 58, 2, 'read', '2025-10-17 08:33:57.000'),
(132, '74e8cbb4-3204-4bd8-8a95-335256b4f436', 58, 28, 'delivered', '2025-10-17 08:33:54.000'),
(133, 'aa19c8b5-0c80-460a-a7ae-22524cb34b84', 59, 2, 'read', '2025-10-17 08:39:44.000'),
(134, '5fd1c8cb-3ac0-46e8-86dc-f9800cbe7d70', 59, 3, 'delivered', '2025-10-17 08:38:43.000'),
(135, '4d67892f-1d1d-4b51-93b1-09eb2a46f86d', 60, 2, 'read', '2025-10-17 08:39:44.000'),
(136, 'b5126531-e5ae-4263-a080-f4873f835c5a', 60, 3, 'delivered', '2025-10-17 08:39:28.000'),
(137, '94ef20a7-37b7-4028-bb79-93246594317c', 61, 3, 'delivered', '2025-10-17 08:58:12.000'),
(138, '16db4292-6f95-45f8-9040-69ade009cf2c', 61, 2, 'read', '2025-10-17 08:58:41.000');

-- --------------------------------------------------------

--
-- Table structure for table `modules`
--

DROP TABLE IF EXISTS `modules`;
CREATE TABLE IF NOT EXISTS `modules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `parent_id` int NOT NULL DEFAULT '0',
  `name` varchar(50) NOT NULL,
  `url` varchar(100) DEFAULT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `seq_no` int DEFAULT NULL,
  `is_sub_module` enum('Y','N') NOT NULL DEFAULT 'N',
  `status` enum('active','inactive') DEFAULT 'active',
  `is_permission` enum('Y','N') NOT NULL DEFAULT 'N',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `modules_uuid_unique` (`uuid`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `modules`
--

INSERT INTO `modules` (`id`, `uuid`, `parent_id`, `name`, `url`, `icon`, `seq_no`, `is_sub_module`, `status`, `is_permission`, `created_at`, `updated_at`) VALUES
(1, '65aa0282-1587-4680-8699-f7c8831a7f9c', 0, 'Dashboard', '/admin/dashboard', 'Home', 1, 'N', 'active', 'N', '2025-09-22 13:28:36.000', '2025-10-01 04:51:26.000'),
(2, '9c8ce5e0-bdb8-4923-b5a7-37110113c680', 0, 'User', '/admin/user', 'Users', 2, 'N', 'active', 'Y', '2025-09-22 13:28:36.000', '2025-09-22 13:28:36.000'),
(3, 'bc9f08d7-bcaf-4e15-ba4d-a526f9a82cee', 0, 'CMS', '/admin/cms', 'Book', 3, 'N', 'active', 'Y', '2025-09-22 13:28:36.000', '2025-09-22 13:28:36.000'),
(4, 'c916883a-74ca-45db-ade2-a99a68aa04b1', 0, 'Module', '/admin/module', 'List', 4, 'N', 'active', 'Y', '2025-09-22 13:28:36.000', '2025-10-01 04:51:31.000'),
(5, '4488d5e9-8b59-4f83-a310-9744b9de9e7e', 0, 'Apps', '', 'Grid', 5, 'Y', 'active', 'N', '2025-09-30 09:13:57.000', '2025-09-30 09:13:57.000'),
(6, '925028f1-11e1-4fed-8486-cbd2ebdcb4d6', 5, 'Chat', '/admin/chat/', NULL, 1, 'N', 'active', 'N', '2025-09-30 09:25:27.000', '2025-10-01 04:50:40.000'),
(8, 'cf1767af-54e3-4cad-8a48-29bee045c056', 5, 'Email', '/admin/email/', NULL, 2, 'N', 'active', 'Y', '2025-09-30 10:37:24.000', '2025-10-01 05:38:59.000'),
(10, '77eefd86-1540-4a06-bacc-78fdafffba63', 0, 'Category', '/admin/category', 'List', 5, 'N', 'active', 'Y', '2025-11-06 07:38:24.000', '2025-11-06 07:38:24.000');

-- --------------------------------------------------------

--
-- Table structure for table `module_permissions`
--

DROP TABLE IF EXISTS `module_permissions`;
CREATE TABLE IF NOT EXISTS `module_permissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `module_id` int NOT NULL,
  `permission_id` int NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `module_permissions_uuid_unique` (`uuid`),
  UNIQUE KEY `unique_module_permission` (`module_id`,`permission_id`),
  KEY `permissionId` (`permission_id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `module_permissions`
--

INSERT INTO `module_permissions` (`id`, `uuid`, `module_id`, `permission_id`, `created_at`, `updated_at`) VALUES
(6, '55da9c78-a754-4971-a75f-44c4cbf7682f', 2, 1, '2025-09-30 07:45:02.000', '2025-09-30 07:45:02.000'),
(7, '878928f4-dbc1-401c-a8c7-e0c7011844d1', 2, 2, '2025-09-30 07:45:02.000', '2025-09-30 07:45:02.000'),
(8, 'a1704139-59ef-4328-8fff-6027d0baf721', 2, 3, '2025-09-30 07:45:02.000', '2025-09-30 07:45:02.000'),
(9, 'c159d7da-983e-4c10-a078-05490af8b5b4', 2, 4, '2025-09-30 07:45:02.000', '2025-09-30 07:45:02.000'),
(10, '49c586ae-9f0e-4448-ba28-520d78e75e3b', 2, 5, '2025-09-30 07:45:02.000', '2025-09-30 07:45:02.000'),
(11, '4ac3d851-fa96-4d80-9a0a-b031b43ebc70', 3, 1, '2025-09-30 07:45:05.000', '2025-09-30 07:45:05.000'),
(12, 'bb42f89f-5eb7-4d8f-96f4-bbc679d10668', 3, 2, '2025-09-30 07:45:05.000', '2025-09-30 07:45:05.000'),
(13, '74d59bb3-3282-4847-bfa1-0db55436ea3c', 3, 3, '2025-09-30 07:45:05.000', '2025-09-30 07:45:05.000'),
(14, '53c80871-d67a-4b94-ba68-40b900b2cc80', 3, 4, '2025-09-30 07:45:05.000', '2025-09-30 07:45:05.000'),
(15, '766b0f14-ffbe-4caa-9544-4fbac40b5a83', 3, 5, '2025-09-30 07:45:05.000', '2025-09-30 07:45:05.000'),
(36, '139d7208-730f-44e8-9154-872989ae044b', 4, 1, '2025-10-01 04:51:32.000', '2025-10-01 04:51:32.000'),
(37, 'dad8695b-dcbd-44f4-99c4-b940b3a23475', 4, 2, '2025-10-01 04:51:32.000', '2025-10-01 04:51:32.000'),
(38, '6605ba53-4b89-4736-be9c-636f2b2d5765', 4, 3, '2025-10-01 04:51:32.000', '2025-10-01 04:51:32.000'),
(39, '9849574c-50b3-4b13-a8b6-2bf1a458f7a7', 4, 4, '2025-10-01 04:51:32.000', '2025-10-01 04:51:32.000'),
(40, '44f739a4-7c19-4129-87bd-cb56d86b9b1f', 4, 5, '2025-10-01 04:51:32.000', '2025-10-01 04:51:32.000'),
(41, '737539a4-c51d-459a-ac78-a76e5246d54d', 8, 1, '2025-10-01 05:39:00.000', '2025-10-01 05:39:00.000'),
(42, '72f3071e-6f77-4747-89fb-96d85ed06e7d', 8, 2, '2025-10-01 05:39:00.000', '2025-10-01 05:39:00.000'),
(43, 'd82fb8eb-c014-4cbb-9bf8-95b6d11c50e7', 8, 3, '2025-10-01 05:39:00.000', '2025-10-01 05:39:00.000'),
(44, 'cb3ea125-c478-4e02-8560-1c08c696d3a1', 8, 4, '2025-10-01 05:39:00.000', '2025-10-01 05:39:00.000'),
(45, 'd26858ea-9744-40c1-a58b-6b06c41acb99', 8, 5, '2025-10-01 05:39:00.000', '2025-10-01 05:39:00.000'),
(46, 'eb71765a-59b8-4931-87c1-d57137a0738a', 10, 1, '2025-11-06 07:38:24.000', '2025-11-06 07:38:24.000'),
(47, '4a804047-e53b-4d17-a524-e413147419fe', 10, 2, '2025-11-06 07:38:24.000', '2025-11-06 07:38:24.000'),
(48, 'e0566032-3694-4c8e-9263-45c7166c21f9', 10, 3, '2025-11-06 07:38:24.000', '2025-11-06 07:38:24.000'),
(49, '2e4c524b-84d8-46c3-930c-c8315adc49d6', 10, 4, '2025-11-06 07:38:24.000', '2025-11-06 07:38:24.000'),
(50, '9bec4b4b-ea23-4209-aaf3-f7137d8e5bc5', 10, 5, '2025-11-06 07:38:24.000', '2025-11-06 07:38:24.000');

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
CREATE TABLE IF NOT EXISTS `permissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `action` varchar(50) NOT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `permissions_uuid_unique` (`uuid`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `uuid`, `action`, `status`, `created_at`, `updated_at`) VALUES
(1, '8c6e49b5-d5eb-480c-a97d-6d988c734d8d', 'create', 'active', '2025-09-22 13:29:23.000', '2025-09-22 13:29:23.000'),
(2, '99f9ffe0-daca-4bcc-99b5-8dedca90726f', 'read', 'active', '2025-09-22 13:29:23.000', '2025-09-22 13:29:23.000'),
(3, '07b889c4-777e-427b-8ceb-735fa082be41', 'update', 'active', '2025-09-22 13:29:23.000', '2025-09-22 13:29:23.000'),
(4, '190f54da-1d17-42fd-8173-afc639fc283b', 'delete', 'active', '2025-09-22 13:29:23.000', '2025-09-22 13:29:23.000'),
(5, '5473f7d0-857d-4377-82f7-1334b47a0cb6', 'approve', 'active', '2025-09-22 13:29:23.000', '2025-09-22 13:29:23.000');

-- --------------------------------------------------------

--
-- Table structure for table `role_modules`
--

DROP TABLE IF EXISTS `role_modules`;
CREATE TABLE IF NOT EXISTS `role_modules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role` enum('super_admin','admin','user') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `module_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `role_module_unique` (`role`,`module_id`),
  KEY `role_modules_module_id_foreign` (`module_id`),
  KEY `role_modules_role_index` (`role`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `role_modules`
--

INSERT INTO `role_modules` (`id`, `role`, `module_id`, `created_at`, `updated_at`) VALUES
(1, 'super_admin', 1, '2026-02-11 22:42:17', '2026-02-11 22:42:17'),
(2, 'super_admin', 2, '2026-02-11 22:42:17', '2026-02-11 22:42:17'),
(3, 'super_admin', 3, '2026-02-23 04:42:19', '2026-02-23 04:42:19'),
(4, 'super_admin', 4, '2026-02-23 04:49:03', '2026-02-23 04:49:03'),
(5, 'admin', 1, '2026-02-11 22:42:17', '2026-02-11 22:42:17'),
(6, 'admin', 2, '2026-02-11 22:42:17', '2026-02-11 22:42:17'),
(7, 'admin', 3, '2026-02-23 04:42:19', '2026-02-23 04:42:19'),
(8, 'admin', 4, '2026-02-23 04:49:03', '2026-02-23 04:49:03');

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
CREATE TABLE IF NOT EXISTS `tasks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `list_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `due_date` datetime(3) DEFAULT NULL,
  `priority` enum('low','medium','high') DEFAULT 'medium',
  `position` int DEFAULT '0',
  `created_by` int NOT NULL,
  `assigned_to` int DEFAULT NULL,
  `tags` text,
  `status` enum('pending','completed','cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'pending',
  `active` enum('Y','N') NOT NULL DEFAULT 'Y',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `tasks_uuid_unique` (`uuid`),
  KEY `listId` (`list_id`),
  KEY `createdBy` (`created_by`),
  KEY `assignedTo` (`assigned_to`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `email_verified` enum('Y','N') NOT NULL DEFAULT 'N',
  `email_verified_at` datetime(3) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `avatar` varchar(100) DEFAULT NULL,
  `role` enum('user','admin','super_admin') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'user',
  `reset_password_token` varchar(191) DEFAULT NULL,
  `reset_password_expire` datetime(3) DEFAULT NULL,
  `status` enum('active','inactive','suspended') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'active',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `users_uuid_unique` (`uuid`)
) ENGINE=InnoDB AUTO_INCREMENT=122 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `uuid`, `name`, `email`, `email_verified`, `email_verified_at`, `password`, `phone`, `avatar`, `role`, `reset_password_token`, `reset_password_expire`, `status`, `created_at`, `updated_at`) VALUES
(1, '8dedbb28-d545-45c8-8dde-e4f595caec57', 'Anna Parkar', 'anna@yopmail.com', 'Y', '2025-09-12 10:30:21.000', '$2b$10$YqSkvaPaUd9jLFmeam6pp.90pnocs/iwu8PcnHT2mo5tgfj4CIZL2', '8855221144', NULL, 'super_admin', '1e124066f94eadf324a719e464e1fc97e573fe28f7f41ae5284e9d575ecfab96', '2026-03-11 09:49:58.716', 'active', '2025-09-12 10:30:21.000', '2026-03-11 09:34:58.719'),
(2, '53df67f1-09e1-4f5b-9fab-6e4cfdf4cc74', 'Adam Parkar', 'adam@yopmail.com', 'N', '2026-03-11 11:13:31.280', '$2b$10$YqSkvaPaUd9jLFmeam6pp.90pnocs/iwu8PcnHT2mo5tgfj4CIZL2', '9988552211', 'http://localhost:8000/uploads/images/1758612974783-563958658.jpg', 'admin', NULL, NULL, 'active', '2025-09-12 10:33:11.000', '2026-03-11 11:13:31.284'),
(3, '451a11c7-fe3e-47f8-9498-0916ca60885a', 'Mahi Patil', 'mahi@yopmail.com', 'Y', '2025-09-12 12:57:56.000', '$2b$10$YqSkvaPaUd9jLFmeam6pp.90pnocs/iwu8PcnHT2mo5tgfj4CIZL2', '8855221144', NULL, 'admin', NULL, NULL, 'active', '2025-09-12 12:57:56.000', '2025-09-12 12:57:56.000'),
(4, '4758db3e-cd38-4016-9037-dd98603b793c', 'Rani Patil', 'rani@yopmail.com', 'Y', '2025-09-12 13:09:10.000', '$2b$10$5eV4jqxSpVDTyRw1r4PRvu0NAU8aU3yYqjM/utH8pH1cnqc1fTFDO', '8855221144', 'http://localhost:8000/uploads/images/1758353838989-150202607.jpg', 'admin', NULL, NULL, 'inactive', '2025-09-12 13:09:10.000', '2025-09-20 07:37:19.000'),
(5, '29ebe5ba-2bf8-463e-8ac3-548329e5a379', 'Mahesh Patil', 'mp@yopmail.com', 'Y', '2025-09-12 13:11:00.000', '$2b$10$3vsjJfvuEHIDAT1TV1YUs.EOgLEwgGFTwTPQM5Z96reitG9rYEDze', '8855221144', NULL, 'admin', '430706d74a6f2683494c8c1732ead35ac21106d015baf5fc2a5d2bc954f5f590', '2025-09-20 06:14:12.000', 'active', '2025-09-12 13:11:00.000', '2025-09-20 05:59:12.000'),
(6, 'ffb9c79d-2d12-41f2-ade4-8695e6f842c6', 'Maheshq Patil', 'mpq@yopmail.com', 'Y', '2025-09-13 10:15:38.000', '$2b$10$Yoq/JK44oHCejVve70MkhuGXo0QFOjExVb3/vM90VbzgtSBKMrOSm', '8855221144', NULL, 'admin', NULL, NULL, 'active', '2025-09-13 10:15:38.000', '2025-09-13 10:15:38.000'),
(7, '06e68a6f-e7eb-45a9-b63c-90718570164b', 'Ash Kimg', 'aks@yopmail.com', 'Y', '2025-09-16 05:15:27.000', '$2b$10$UK0Ts2EuEGyZeerhPyLQbOgOBWBb6r/5nDSdNy6Tq6odLFdc0Qsyq', '8855221144', NULL, 'admin', NULL, NULL, 'active', '2025-09-16 05:15:27.000', '2025-09-16 05:15:27.000'),
(8, '4ca3d63b-0f9e-4d90-aac0-69ad4db4c288', 'Ram Singh', 'jd@yopmail.com', 'Y', '2025-09-16 07:00:01.000', '$2b$10$M36dPEBDXLqM2XaIpleitOVLxk6CbYxPo0OWR6GdX4MRxhspuGHh2', '9955884455', 'http://localhost:8000/uploads/images/1758284780133-775955754.jpg', 'admin', NULL, NULL, 'active', '2025-09-16 07:00:01.000', '2025-09-19 12:26:20.000'),
(9, '03f3721e-26ad-4fac-8f9c-4ab47a62066c', 'AJ Pawar', 'abcc@yopmail.com', 'Y', '2025-09-16 09:46:10.000', '$2b$10$679ofVP1S.3/vdQHg4ULJe27ZeyIcUl9v3jiBrvhMwOMjUYSVncse', '+911234567890', NULL, 'admin', NULL, NULL, 'active', '2025-09-16 09:46:10.000', '2025-09-16 09:46:10.000'),
(10, 'e3030086-4207-477d-a3a3-10603a0cf02d', 'John Doe', 'JohnDoe@yopmail.com', 'Y', '2025-09-16 09:46:10.000', '$2b$10$JJJG2MXVh4iLfTq9CHan2OIAc9F/lD1chEVFKBjkHyx/4xV6iUN36', '+911111111113', NULL, 'user', NULL, NULL, 'active', '2025-09-16 09:46:10.000', '2025-11-19 07:55:05.000'),
(11, 'fbc4528f-6c89-42ae-b2ca-8443e9a6b703', 'Courtney Beier', 'Curtis_Stokes@yahoo.com', 'Y', '2025-09-16 09:46:10.000', '$2b$10$Bayb52Al4kC7Tpjk1xeMquO3D6rQ2SpdHqKJqFMMJe4lBHNhIkcqG', '700.960.0993 x58339', 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/26.jpg', 'user', NULL, NULL, 'active', '2025-09-16 09:46:10.000', '2025-09-16 09:46:10.000'),
(12, '96dd3a3a-336e-4504-ae78-28f213c6f2db', 'Francis Simonis', 'Maurine.Schaefer@hotmail.com', 'Y', '2025-09-16 09:46:11.000', '$2b$10$hs9PzZXID8pyNSsYvl0sAOv7hmCL8jBNEfyEFdlmo/AptpBmE3BnW', '(861) 673-0894', 'https://avatars.githubusercontent.com/u/38692216', 'user', NULL, NULL, 'active', '2025-09-16 09:46:11.000', '2025-09-16 09:46:11.000'),
(13, '53570b97-16da-49a4-8960-0f014dcb2f5b', 'Cameron Cremin', 'Pansy34@hotmail.com', 'Y', '2025-09-16 09:46:11.000', '$2b$10$b6QvkfYPGA.qZWcNgRj2AOkpKyOVbIHTxZoF44Wf87dBsOwDvkLIy', '253-997-5077', 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/59.jpg', 'user', NULL, NULL, 'active', '2025-09-16 09:46:11.000', '2025-09-16 09:46:11.000'),
(14, 'a53769c3-0a02-4b31-8ce4-2bd5ff5172ab', 'Ellis Rogahn', 'Floy.Littel@yahoo.com', 'Y', '2025-09-16 09:46:11.000', '$2b$10$7cZRaCSELZfT6V5PvF50UutAIplQIKNilJpbFovo27cC.RKNkpZya', '1-647-887-6323', 'https://avatars.githubusercontent.com/u/3589327', 'user', NULL, NULL, 'active', '2025-09-16 09:46:11.000', '2025-09-16 09:46:11.000'),
(15, '06d2f9c0-029f-40e7-9823-1e4d59a6abb9', 'Kenny Kilback', 'Ken.Kub@hotmail.com', 'Y', '2025-09-16 09:46:11.000', '$2b$10$VaGLXe/1APH1PnlpKMWW2OhF.BotwPFgewDLfxRaWN1kWfzlqr.bu', '508.394.1568 x0496', 'https://avatars.githubusercontent.com/u/10527714', 'user', NULL, NULL, 'active', '2025-09-16 09:46:11.000', '2025-09-16 09:46:11.000'),
(16, '6243dbfa-f9a3-4423-9e2a-964773dfe1d9', 'Shelia Swift', 'deleted_Alycia.Welch34@hotmail.com', 'Y', '2025-09-16 09:46:11.000', '$2b$10$MZmZnSxvkMW.av3VnGVjLeCIodTXPPF2b53RghU7yhtSme7MBc3Ky', '994.732.3753 x5969', 'https://avatars.githubusercontent.com/u/7427686', 'user', NULL, NULL, 'suspended', '2025-09-16 09:46:11.000', '2025-09-20 06:14:07.000'),
(17, '69d2c512-6042-42dc-a4da-3cc269d71b83', 'Darla Kunze', 'Dena_Block11@hotmail.com', 'Y', '2025-09-16 09:46:11.000', '$2b$10$Imjy/gIhWaypi4NiQs1cuOn3x13aLFzShB7ALE00PfefceFGkGRhK', '630.238.3564', 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/4.jpg', 'user', NULL, NULL, 'inactive', '2025-09-16 09:46:11.000', '2025-09-16 09:46:11.000'),
(18, '3db35ffe-a1f2-4485-86e0-cb927584af03', 'Janet Lebsack-Bayer', 'deleted_Julie_Bauch12@yahoo.com', 'Y', '2025-09-16 09:46:11.000', '$2b$10$UB/wsB2NXbVXhfGaNtKJc.Sz87k5Y9q0U8A79MFx2fe3UsAvGOljO', '(251) 936-1375 x7890', 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/76.jpg', 'user', NULL, NULL, 'suspended', '2025-09-16 09:46:11.000', '2025-09-20 06:13:31.000'),
(19, '97f5c5de-ad9e-4c05-8c4f-21c277fdb255', 'Roland Gleason', 'Hailey.Bashirian74@yahoo.com', 'Y', '2025-09-16 09:46:11.000', '$2b$10$XLj9Dn0UExvTEkvIsRcVLORv9orQsQKeHhTLH65AjDjKbdt468/TK', '1-486-543-3097', 'https://avatars.githubusercontent.com/u/55868493', 'user', NULL, NULL, 'inactive', '2025-09-16 09:46:11.000', '2025-09-16 09:46:11.000'),
(20, '4f95f692-9de6-4827-ba16-1dd32bb8b384', 'Thelma Kling', 'Shanna_Deckow@hotmail.com', 'Y', '2025-09-16 09:46:11.000', '$2b$10$z8KtUcUA2ysaoBntbrTnPu/MEa4Fmn8w2pC6Dhzs26gW03/KyAlba', '1-966-247-7376 x9745', 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/75.jpg', 'user', NULL, NULL, 'inactive', '2025-09-16 09:46:11.000', '2025-09-16 09:46:11.000'),
(21, 'cf150f00-dee4-4cff-b965-c7ab4becb3a1', 'Yvette Hickle', 'Lon24@hotmail.com', 'Y', '2025-09-16 09:46:11.000', '$2b$10$BaWNxErIxsQSxl5PG7QAQeToGM/gsaPGC2z5hCgvYz/4aiXi3ByfG', '446-829-8318 x0103', 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/23.jpg', 'user', NULL, NULL, 'inactive', '2025-09-16 09:46:11.000', '2025-09-16 09:46:11.000'),
(22, '9a0a125c-0e5b-4d40-a5dc-7e358623641d', 'Helen Jaskolski', 'Wilford10@gmail.com', 'Y', '2025-09-16 09:46:12.000', '$2b$10$63pfPHhGn8MtoZ1..Q/9oOqiCj1ptC60DLdZtl4poVBch2fHLnyZG', '1-844-948-2058 x397', 'https://avatars.githubusercontent.com/u/78027755', 'user', NULL, NULL, 'inactive', '2025-09-16 09:46:12.000', '2025-09-23 08:22:27.000'),
(23, 'f21b5ed4-4bde-446b-bc24-0138d078b341', 'Cedric Kunde', 'Savannah.Beatty51@yahoo.com', 'Y', '2025-09-16 09:46:12.000', '$2b$10$IpF4tTTwNo4a1MPBzQsNrO04/bR/S802R3RUCt/rCTFxuJHLEMexa', '901.921.0225', 'https://avatars.githubusercontent.com/u/95087262', 'user', NULL, NULL, 'active', '2025-09-16 09:46:12.000', '2025-09-16 09:46:12.000'),
(24, '8154ddf2-7dc4-4ce1-a4e7-eea0da61713a', 'Ann Reinger', 'Chase94@yahoo.com', 'Y', '2025-09-16 09:46:12.000', '$2b$10$8kEWFai0h/51WUBavkVJducqkG2H/8rPFChYaGyow8NovFi.tP/dC', '(995) 989-5934 x142', 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/38.jpg', 'user', NULL, NULL, 'active', '2025-09-16 09:46:12.000', '2025-09-16 09:46:12.000'),
(25, '1d883b43-6c0b-4ce6-814c-a1785aee1823', 'Regina Schinner', 'Moises50@yahoo.com', 'Y', '2025-09-16 09:46:12.000', '$2b$10$mdoiYxkJXOD10EdVSrfwyO073j6huvx99yne5R7mFbs/o11m.uafe', '1-304-379-9487 x388', 'https://avatars.githubusercontent.com/u/62395843', 'user', NULL, NULL, 'active', '2025-09-16 09:46:12.000', '2025-09-16 09:46:12.000'),
(26, '2d8b7b0d-0651-4250-958b-ff380e3777a5', 'Dr. Vincent Koepp', 'Dawn62@yahoo.com', 'Y', '2025-09-16 09:46:12.000', '$2b$10$z6TMdjTRT5N0E2Rcqhr9VujYO7vsTnMi4lCjQD7VrkdEOU8Jv/Cf6', '224.586.9252 x8099', 'https://avatars.githubusercontent.com/u/73337795', 'user', NULL, NULL, 'inactive', '2025-09-16 09:46:12.000', '2025-09-16 09:46:12.000'),
(27, 'f75e552c-f230-4c04-a37c-7d3d8a576715', 'Mr. Julius Botsford', 'Adaline79@yahoo.com', 'Y', '2025-09-16 09:46:12.000', '$2b$10$Qx0/r.2bWiuukSt0t1DUg.TKSuQlj.rg83WXGTAYi2DeE5vOPwx7u', '799.614.2087 x942', 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/9.jpg', 'user', NULL, NULL, 'inactive', '2025-09-16 09:46:12.000', '2025-09-16 09:46:12.000'),
(28, 'c0fb4aed-e6b7-4241-8453-9e242cd729c3', 'Alberto Okuneva', 'Eloisa36@yahoo.com', 'Y', '2025-09-16 09:46:12.000', '$2b$10$6SODO6vmLTBnyBSQusHC5uGVovBJ03bf2YARibFxU6sVtu5i0R01a', '775.925.7219 x807', 'https://avatars.githubusercontent.com/u/61202549', 'user', NULL, NULL, 'inactive', '2025-09-16 09:46:12.000', '2025-09-16 09:46:12.000'),
(29, '37f7ac0f-d6ae-4276-b5a3-2f32d1a1fcd8', 'Virgil Block', 'Marielle22@yahoo.com', 'Y', '2025-09-16 09:46:12.000', '$2b$10$6bZQNqflJvkDn00KM7sNt.z8v3qm996QEXH/nLbopriYVGuEWp4vK', '365.894.6421 x90881', 'https://avatars.githubusercontent.com/u/93632233', 'user', NULL, NULL, 'active', '2025-09-16 09:46:12.000', '2025-09-16 09:46:12.000'),
(30, '1e7002bc-67f3-4da0-bae4-7d64b0af90ee', 'Tyler Kling', 'Vella.Kassulke2@yahoo.com', 'Y', '2025-09-16 09:46:12.000', '$2b$10$ggpG79rK93RtjaOLfLRmFueK/EtCwBQy/GvMM3vvIjuctmZh6YWSK', '(983) 804-1769', 'https://avatars.githubusercontent.com/u/75843520', 'user', NULL, NULL, 'active', '2025-09-16 09:46:12.000', '2025-09-16 09:46:12.000'),
(31, '1de232f6-748f-40ce-af84-88e86f9cde9a', 'Daniel Fritsch', 'Dina_Romaguera@yahoo.com', 'Y', '2025-09-16 09:46:12.000', '$2b$10$4NdxJ27Uf/b9NncrkJhS.eYkt8/0lT/X4hCl8uS2VhGYbwpaEW/kW', '1-255-688-7021 x929', 'https://avatars.githubusercontent.com/u/27312061', 'user', NULL, NULL, 'inactive', '2025-09-16 09:46:12.000', '2025-09-16 09:46:12.000'),
(32, '0571a55b-90cb-4b5f-8d46-c02bc82fa10d', 'Miss Stephanie Vandervort', 'Velma.Hartmann4@yahoo.com', 'Y', '2025-09-16 09:46:12.000', '$2b$10$MXXsGbcOyOgiKnt132loK.0TtbK2U3ayMec2kvuORYzXFIJrEsCT2', '(969) 305-2114 x8849', 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/96.jpg', 'user', NULL, NULL, 'active', '2025-09-16 09:46:12.000', '2025-09-16 09:46:12.000'),
(33, 'b8669d6b-a65c-47e2-a4fb-9f0f033c2337', 'Danny Trantow', 'Dayne.Abshire68@gmail.com', 'Y', '2025-09-16 09:46:13.000', '$2b$10$XDxkFnRx8Dnn.yvIVkiig.9UYBCbAJjCkVkPRr.XEp9tHhw8Nr6r2', '459-906-8474', 'https://avatars.githubusercontent.com/u/32918852', 'user', NULL, NULL, 'inactive', '2025-09-16 09:46:13.000', '2025-09-16 09:46:13.000'),
(34, 'ce9a0ffa-488a-4b64-905e-f82369ae4150', 'Ms. Katrina Nolan', 'Odessa.Cremin9@yahoo.com', 'Y', '2025-09-16 09:46:13.000', '$2b$10$EcmoPQWizoj0CS5uxNmhqek4ZG0YPw1GwBnU9dlcz07494op1KZnC', '1-613-749-3738', 'https://avatars.githubusercontent.com/u/35786283', 'user', NULL, NULL, 'active', '2025-09-16 09:46:13.000', '2025-09-16 09:46:13.000'),
(35, '9ffb9517-9d17-487b-9f09-5ba8d8a8bf4f', 'Sergio Rogahn', 'Mike_Hagenes@gmail.com', 'Y', '2025-09-16 09:46:13.000', '$2b$10$tQqV6lTcPeEzBVAD/hpaau39NHL2089PCx4hUFmW9lCqyTE2Y78a6', '264-649-9663 x5147', 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/90.jpg', 'user', NULL, NULL, 'active', '2025-09-16 09:46:13.000', '2025-09-16 09:46:13.000'),
(36, '67e8c742-1c57-4563-a53a-52d12cc32db4', 'Cecilia Hansen', 'Lelah.Windler55@hotmail.com', 'Y', '2025-09-16 09:46:13.000', '$2b$10$gA4j8s9ZhQ/GDv4hxcBVHuxjilmY6UcsdTxRFCrinjGkMLhe72eCu', '1-804-450-7097 x3787', 'https://avatars.githubusercontent.com/u/54214110', 'user', NULL, NULL, 'active', '2025-09-16 09:46:13.000', '2025-09-16 09:46:13.000'),
(37, '8f877c3b-d24c-4b58-beef-4d320caaf46d', 'Sylvia Conroy', 'deleted_Neil.Hermiston73@hotmail.com', 'Y', '2025-09-16 09:46:13.000', '$2b$10$jCn80Bigg0kxmsA2x69EQ.0qdttm1fzUMQG87B.ZQZzFOWQvmOdDG', '563.543.3955 x343', 'https://avatars.githubusercontent.com/u/12032721', 'user', NULL, NULL, 'active', '2025-09-16 09:46:13.000', '2025-09-19 08:30:23.000'),
(38, 'ad25c1d0-28d8-4143-9f4c-6bc700b0a6f5', 'Miss Tamara Baumbach', 'Onie.Hansen38@hotmail.com', 'Y', '2025-09-16 09:46:13.000', '$2b$10$ejGwB6MZWKTMkmhTLpggGOT7NjjtlureEyY3qkV2u0OqOxBP5.SYm', '(999) 891-5955 x1234', 'https://avatars.githubusercontent.com/u/79136697', 'user', NULL, NULL, 'inactive', '2025-09-16 09:46:13.000', '2025-09-16 09:46:13.000'),
(39, 'b3963d17-8bab-454e-832f-a9b2456d927f', 'Lonnie Corwin', 'Amelie69@hotmail.com', 'Y', '2025-09-16 09:46:13.000', '$2b$10$4L5TlWvbKQ.P44yncwxxDOLnM/Fg7haWRcktI8Pq6Msk.LSEWCKh6', '1-646-468-7961 x2276', 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/34.jpg', 'user', NULL, NULL, 'active', '2025-09-16 09:46:13.000', '2025-09-19 08:29:01.000'),
(40, '1284907c-4e03-412b-88de-2ced1843e972', 'Lana Schmitt', 'Miles_VonRueden18@yahoo.com', 'Y', '2025-09-16 09:46:13.000', '$2b$10$cIW7gCruIjAowIiuTV0n4ugfczV9Cv0HPbOcIqBVQPKJs3Zn6Y0gO', '1-301-357-3914 x5933', 'https://avatars.githubusercontent.com/u/32961220', 'user', NULL, NULL, 'active', '2025-09-16 09:46:13.000', '2025-09-16 09:46:13.000'),
(41, '97797636-2a1a-4660-97e6-ad247c1f52af', 'Mrs. Brooke Ratke', 'Tanner_Mohr75@yahoo.com', 'Y', '2025-09-16 09:46:13.000', '$2b$10$o0NyNnFh2b4bAiRGn5LQj.8N1iO0/aRrqzZjVgFKq7HZP2I1hTSKG', '(539) 755-8959 x992', 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/77.jpg', 'user', NULL, NULL, 'active', '2025-09-16 09:46:13.000', '2025-09-16 09:46:13.000'),
(42, '14bcbcd1-b7e1-4933-be20-a0f1882440c2', 'Jeffery Hirthe', 'Jacquelyn57@yahoo.com', 'Y', '2025-09-16 09:46:13.000', '$2b$10$A9/eWQK/tYYe9j9bdSf73eqxjUYB/Pw3OWUdf8zVeH1H7qDfsqwxS', '261.508.0337 x748', 'https://avatars.githubusercontent.com/u/3914961', 'user', NULL, NULL, 'active', '2025-09-16 09:46:13.000', '2025-09-16 09:46:13.000'),
(43, 'c211bda0-dfbc-4d0c-9056-de72d4661003', 'Fannie Hammes', 'Tiana.Strosin@yahoo.com', 'Y', '2025-09-16 09:46:14.000', '$2b$10$HCirUpMlti1vpJQYCi19oecYR1WQBSK/lb4Z7Xu1EULMe2s82Vy7u', '1-979-773-0536 x8906', 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/43.jpg', 'user', NULL, NULL, 'active', '2025-09-16 09:46:14.000', '2025-09-16 09:46:14.000'),
(44, '3517faff-421c-474f-aa69-af9ef3f07da7', 'Terry Jaskolski', 'Nya64@hotmail.com', 'Y', '2025-09-16 09:46:14.000', '$2b$10$DvziHykIHJYiY04o9RS7peipA/ptjP1GQboOwh7r/keuBLCEST/ia', '945.586.9582', 'https://avatars.githubusercontent.com/u/93573147', 'user', NULL, NULL, 'active', '2025-09-16 09:46:14.000', '2025-09-16 09:46:14.000'),
(45, '1927a639-ce4a-4704-87c6-dc20b8b183c3', 'Mathew Williamson', 'Maudie85@gmail.com', 'Y', '2025-09-16 09:46:14.000', '$2b$10$oO30M7cvUpYeyGklMMaKo.XBjV9pJsSMkxOs09JfHLRCVhDTVc.lm', '829-284-4698 x77800', 'https://avatars.githubusercontent.com/u/26118216', 'user', NULL, NULL, 'active', '2025-09-16 09:46:14.000', '2025-09-16 09:46:14.000'),
(46, 'eb4002d2-512f-4f23-ab5f-dc8712873b39', 'Owen Schinner', 'Trinity_Barrows@hotmail.com', 'Y', '2025-09-16 09:46:14.000', '$2b$10$iNu20FSyDV1XyHo1HLdRaOfcyCsjC8LYcSZ4XFp581dzc7N2/nyci', '(846) 593-8395', 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/56.jpg', 'user', NULL, NULL, 'active', '2025-09-16 09:46:14.000', '2025-09-16 09:46:14.000'),
(47, '0ef35524-f721-4fd4-acff-e193df30d816', 'Mrs. Lydia Johns-Harber', 'Elena_Berge-Farrell22@yahoo.com', 'Y', '2025-09-16 09:46:14.000', '$2b$10$D4MMRIJjpu0dMDQBpNoT5.H.q3SCajtBUaYAFjXVCyQzw6GHOXEiy', '892.405.8308 x623', 'https://avatars.githubusercontent.com/u/70782348', 'user', NULL, NULL, 'active', '2025-09-16 09:46:14.000', '2025-09-16 09:46:14.000'),
(48, '260f1886-e608-46d3-995a-c24a7c2bfd85', 'Jacob Nolan', 'Gustave_Gerlach@hotmail.com', 'Y', '2025-09-16 09:46:14.000', '$2b$10$WEERgEkNrsAz0VNwAw5UvuG3UcUIQqwVPwLC5ggJuBV23NyJNF7Bi', '303-475-4059', 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/34.jpg', 'user', NULL, NULL, 'active', '2025-09-16 09:46:14.000', '2025-09-16 09:46:14.000'),
(49, '782234e5-6d5a-4e9a-a899-c051861e1000', 'Don Johns III', 'Adolphus.King@gmail.com', 'Y', '2025-09-16 09:46:14.000', '$2b$10$q082sIqOuJ09DaEs7FcQ7.flsfeVEOfTjxVtNbs5vQ9kvKlL2XuEa', '1-833-476-0243', 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/33.jpg', 'user', NULL, NULL, 'active', '2025-09-16 09:46:14.000', '2025-09-16 09:46:14.000'),
(50, 'a9c4a033-9063-4ce8-a757-d9fb12e7759b', 'Olga Hauck MD', 'Edythe.Christiansen31@hotmail.com', 'Y', '2025-09-16 09:46:14.000', '$2b$10$ouAXPwzMotN9aXix3CVBreeXHaQM3Ssvb4WVx8to6j8BnqBswv3.u', '702.707.5380 x169', 'https://avatars.githubusercontent.com/u/21366548', 'user', NULL, NULL, 'inactive', '2025-09-16 09:46:14.000', '2025-09-16 09:46:14.000'),
(51, '62c7375d-41ac-4b99-b229-5ff8fd8f2504', 'Catherine Fadel', 'Jared_McCullough@gmail.com', 'Y', '2025-09-16 09:46:15.000', '$2b$10$VaiptCWM/I0FghDkUPj4NeMk.727OLHXq7KscojHrpWTH4hjq0VVC', '370.413.3303 x412', 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/41.jpg', 'user', NULL, NULL, 'active', '2025-09-16 09:46:15.000', '2025-09-16 09:46:15.000'),
(52, '1d8ac48d-c18c-41b7-a4d8-514f8bb9302b', 'Candace Ebert', 'Joy.Haag19@gmail.com', 'Y', '2025-09-16 09:46:15.000', '$2b$10$WJLfSj.FWrmzaShMj/CCueGPI3R4388zEbLudC1vC0VTPRDixD0vC', '(929) 436-9156 x188', 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/10.jpg', 'user', NULL, NULL, 'inactive', '2025-09-16 09:46:15.000', '2025-09-16 09:46:15.000'),
(53, 'ddc481aa-cac1-44d9-b860-14c6b9471db3', 'Angelina Beatty DVM', 'Bret4@gmail.com', 'Y', '2025-09-16 09:46:15.000', '$2b$10$5aLM1WWgRsFy9UaKkStki.JaX1spsbBaJ6zcLl8GvhxIUjl9hDiKy', '603.630.8173 x1279', 'https://avatars.githubusercontent.com/u/12060032', 'user', NULL, NULL, 'active', '2025-09-16 09:46:15.000', '2025-09-16 09:46:15.000'),
(54, '4ff15931-5520-48a6-8144-9559ba9b0cc7', 'Elmer Champlin', 'Isabella_Fadel9@yahoo.com', 'Y', '2025-09-16 09:46:15.000', '$2b$10$XxSiBRS7wC8wsj9hNznbmewfoisAKDChSQZG6SWr8WtT18/whKzEK', '(266) 497-2720 x4873', 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/29.jpg', 'user', NULL, NULL, 'inactive', '2025-09-16 09:46:15.000', '2025-09-16 09:46:15.000'),
(55, '52b3c478-34f4-486f-8f64-8c7289b67cfd', 'Phil Jenkins PhD', 'Adriel_Hegmann96@hotmail.com', 'Y', '2025-09-16 09:46:15.000', '$2b$10$aihfcCymq4aH3RY9TBYfw.n4xVykI/pXYsGbSbeq.JnMUoHItWwQS', '(982) 536-2677 x5654', 'https://avatars.githubusercontent.com/u/97790627', 'user', NULL, NULL, 'inactive', '2025-09-16 09:46:15.000', '2025-09-16 09:46:15.000'),
(56, '2a244ac4-98fc-4bac-80a3-5e540ed13ea2', 'Winston Welch', 'Mack.Langosh76@yahoo.com', 'Y', '2025-09-16 09:46:15.000', '$2b$10$818mGGUMJ3IA.xwMkHh/H.0V.Q/OzB75lLBXeNwsuX0MzP4OCH.ZK', '(470) 668-2829 x7485', 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/41.jpg', 'user', NULL, NULL, 'active', '2025-09-16 09:46:15.000', '2025-09-16 09:46:15.000'),
(57, '1a035bb0-d6af-4c55-96cd-4a077af10754', 'Mani Pal', 'mani@gmail.com', 'Y', '2025-09-18 05:35:59.000', '$2b$10$yIaNgLTy9GG.YGTSR2Rzy.87wsGhBkjNm0iM//W.KSJ6u2kH5CBc6', NULL, NULL, 'admin', NULL, NULL, 'active', '2025-09-18 05:35:59.000', '2025-09-18 05:35:59.000'),
(58, 'f7ade84b-88d4-4c26-9bb6-3e687a44fe01', 'Ira Gleichner', 'Paolo.Tillman@gmail.com', 'Y', '2025-09-19 08:39:26.000', '$2b$10$xqqft1wgfQevAzNrewmriudgw0T9YY5XnfralA1gp4ZRUHL.6fBUG', '655-699-8622 x864', 'https://avatars.githubusercontent.com/u/21911254', 'user', NULL, NULL, 'active', '2025-09-19 08:39:26.000', '2025-09-19 08:39:26.000'),
(59, '22a0da15-f9e6-4c3f-9aa9-c423a7b63d9d', 'Meredith Corkery', 'Grant.Bechtelar@hotmail.com', 'Y', '2025-09-19 08:39:26.000', '$2b$10$SzYqY.VJZZmjrVp13H9oSu1maaidYmMxhop6UmFlTLQc.0Xr7ksFS', '1-371-563-3131', 'https://avatars.githubusercontent.com/u/25771225', 'user', NULL, NULL, 'suspended', '2025-09-19 08:39:26.000', '2025-09-19 08:39:26.000'),
(60, 'f801942f-6cc7-41f8-a443-87b7ebca900b', 'Andres Stanton', 'Dawn.MacGyver@hotmail.com', 'Y', '2025-09-19 08:39:26.000', '$2b$10$adAQTD6zpdsjFIxjDYhSceI14VwyHzR6kORsQSioHFB0hjf/5fd3O', '1-249-419-4128 x767', 'https://avatars.githubusercontent.com/u/86436373', 'user', NULL, NULL, 'inactive', '2025-09-19 08:39:26.000', '2025-09-19 08:39:26.000'),
(61, '4f32e600-e40b-4ab5-87b6-9811c893167e', 'Dr. Domingo Goodwin', 'Nella22@gmail.com', 'Y', '2025-09-19 08:39:26.000', '$2b$10$4Qokt6OGWdYa.nABYsepgezzOL9oPw6PhfZuxJ59fy.oyDcsXbkgm', '(603) 868-6007 x6469', 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/54.jpg', 'user', NULL, NULL, 'suspended', '2025-09-19 08:39:26.000', '2025-09-19 08:39:26.000'),
(62, '9d93a94e-7d59-49c7-8596-e14e8a10ee87', 'Caleb Casper', 'Gage.Medhurst@gmail.com', 'Y', '2025-09-19 08:39:26.000', '$2b$10$jR6qEkUzsdg4KCHbY3/cy.RF2tDdDJDs8WYsa4os4SpZ5Sk.F5FW.', '1-342-496-7337 x7531', 'https://avatars.githubusercontent.com/u/19116078', 'user', NULL, NULL, 'inactive', '2025-09-19 08:39:26.000', '2025-09-19 08:39:26.000'),
(63, '11b2df1e-fd2a-4f52-836a-0cf9ef0a72b7', 'Alton Witting', 'Cruz_Hand@hotmail.com', 'Y', '2025-09-19 08:39:27.000', '$2b$10$DifgDJ/BW1wT/t8ghnd41uOBBcegnxM9W5MuGqHrPVjrI279BSLiS', '750.706.1075 x2311', 'https://avatars.githubusercontent.com/u/85876287', 'user', NULL, NULL, 'inactive', '2025-09-19 08:39:27.000', '2025-09-19 08:39:27.000'),
(64, '279f159b-a1a0-47d7-86b3-206acde92685', 'Lucia Hoppe-Monahan', 'Trystan.Schimmel-Larkin81@hotmail.com', 'Y', '2025-09-19 08:39:27.000', '$2b$10$9.R6y/eGVxIllBs.ku9riun7ilcGWU0ZqSxFUILFsx5Pu1uwqNIvK', '1-552-656-4039 x167', 'https://avatars.githubusercontent.com/u/96146087', 'user', NULL, NULL, 'suspended', '2025-09-19 08:39:27.000', '2025-09-19 08:39:27.000'),
(65, '663048ba-9aae-4e9b-a6eb-7621de272d06', 'Julius Nicolas', 'Baby_Lang16@yahoo.com', 'Y', '2025-09-19 08:39:27.000', '$2b$10$5swf8HygobzPlCaHQWAFHubDKmSuDitjggw7orYAuUD8iPx3qvHd.', '383-683-7194', 'https://avatars.githubusercontent.com/u/33468951', 'user', NULL, NULL, 'suspended', '2025-09-19 08:39:27.000', '2025-09-19 08:39:27.000'),
(66, '24562e20-934f-49be-b46b-1c40f3c4263f', 'Sherman Keeling-MacGyver', 'Marlen.Harber23@gmail.com', 'Y', '2025-09-19 08:39:27.000', '$2b$10$X4W9W/tAvQQcefGp4EcNUOua4/eqIbwQmBlBypdx1jBYHNzIbdsTm', '(551) 250-5639', 'https://avatars.githubusercontent.com/u/36027619', 'user', NULL, NULL, 'suspended', '2025-09-19 08:39:27.000', '2025-09-19 08:39:27.000'),
(67, '4202c00e-339b-45b0-bf54-7047068f9e75', 'Mr. Philip Gerhold', 'Teagan.Baumbach@hotmail.com', 'Y', '2025-09-19 08:39:27.000', '$2b$10$AXsVTEDUHm.xcpFnaDTFCOgAvqDtX1qzVn8l2mnRHnsL.Eu1XQhim', '306.898.0676 x3689', 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/14.jpg', 'user', NULL, NULL, 'suspended', '2025-09-19 08:39:27.000', '2025-09-19 08:39:27.000'),
(68, '9eb420ac-6232-44f7-bd67-d794bdf65e8d', 'Carlton Schaden IV', 'Cory_Littel@gmail.com', 'Y', '2025-09-19 08:39:27.000', '$2b$10$eGyt/Rrcp/gjwdmahyIC5eFjyepWjBJM4tt5Qka9uqEtMYhLce3Om', '958.228.7770 x478', 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/60.jpg', 'user', NULL, NULL, 'suspended', '2025-09-19 08:39:27.000', '2025-09-19 08:39:27.000'),
(69, 'b0ab86fe-bcd9-498c-a66c-9461a72c299b', 'Mr. Nicolas Nicolas', 'Uriah.Donnelly@gmail.com', 'Y', '2025-09-19 08:39:27.000', '$2b$10$xgaGaQZkiIXNbCr23s/q/O6FoCP6OP.4pVTGmwrij6zNrDLUajJGu', '1-324-201-3625 x6397', 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/53.jpg', 'user', NULL, NULL, 'inactive', '2025-09-19 08:39:27.000', '2025-09-19 08:39:27.000'),
(70, '9b855a1d-6d4a-4f97-bfb3-3b79b38bcb40', 'Lorenzo Franecki', 'Dane_Borer-OConner@gmail.com', 'Y', '2025-09-19 08:39:27.000', '$2b$10$Q.hcPPQB0t7PmXGHifF/FO/scY4LrET.RETcduFQTNFnXDuYa8/Ke', '467-235-2958', 'https://avatars.githubusercontent.com/u/58266081', 'user', NULL, NULL, 'inactive', '2025-09-19 08:39:27.000', '2025-09-19 08:39:27.000'),
(71, '2532c7ed-8575-4874-8169-dd03df7cce38', 'Kelly Lynch IV', 'Brandt.Mayert47@yahoo.com', 'Y', '2025-09-19 08:39:27.000', '$2b$10$Yhe8Vhdf5ZLUvo8pyXh0HeQF3iq2N22TpwkBnzuTyJAuUNcAlLwcK', '647.994.2799', 'https://avatars.githubusercontent.com/u/82041077', 'user', NULL, NULL, 'inactive', '2025-09-19 08:39:27.000', '2025-09-19 08:39:27.000'),
(72, '4f6e5a70-8e00-4207-ac43-6645dcd93a7a', 'Mr. Nelson Pollich', 'Freida27@gmail.com', 'Y', '2025-09-19 08:39:27.000', '$2b$10$Es2/rJFk23747hSuCDbJxOJn5NGwrHykT61Rj9RBEJ.saYtHptfoe', '(708) 377-8492 x556', 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/90.jpg', 'user', NULL, NULL, 'suspended', '2025-09-19 08:39:27.000', '2025-09-19 08:39:27.000'),
(73, '6a796fea-9573-442e-9475-5b54538aae35', 'Beatrice Wolff', 'Jabari.Skiles@yahoo.com', 'Y', '2025-09-19 08:39:27.000', '$2b$10$g6VJoETAsKnAFfcOToTGruVNWP9d9nLbhbDBf2efrHa4FILZEDEdG', '847-449-2114', 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/55.jpg', 'user', NULL, NULL, 'active', '2025-09-19 08:39:27.000', '2025-09-19 08:39:27.000'),
(74, '6f3251b0-bf25-4b8a-a9c2-8b49f78b2074', 'Courtney Mills', 'Sofia.Flatley@gmail.com', 'Y', '2025-09-19 08:39:27.000', '$2b$10$VSn0UKegLTPAk..2F3NSO.q/MFx97wP.iBKGI3vz2xgPVHZElXJXC', '1-690-586-8399 x355', 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/21.jpg', 'user', NULL, NULL, 'active', '2025-09-19 08:39:27.000', '2025-09-19 08:39:27.000'),
(75, '7f4fd02c-5e32-451c-9b50-7fa573e54d25', 'Roger Casper', 'Kolby_Koelpin71@hotmail.com', 'Y', '2025-09-19 08:39:27.000', '$2b$10$Jv3Egi29fftbNWVbBo4jfu4xDW1q.68bIbUp8vmFEDmhlQ6V4EC3K', '275-406-5062 x42015', 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/50.jpg', 'user', NULL, NULL, 'inactive', '2025-09-19 08:39:27.000', '2025-09-19 08:39:27.000'),
(76, 'a383e791-8c27-4d88-8809-0f5dcd027b7a', 'Vera Howe', 'Skyla.Dietrich81@hotmail.com', 'Y', '2025-09-19 08:39:28.000', '$2b$10$..m2QWgwNmqqn4zrvPvUq.WiDgg3VjRQBU1zi6oseOrMqGWsBjtQC', '1-830-356-0755 x7964', 'https://avatars.githubusercontent.com/u/85659032', 'user', NULL, NULL, 'active', '2025-09-19 08:39:28.000', '2025-09-19 08:39:28.000'),
(77, '733bf6a3-cd86-45b4-b21d-9116fd3165a7', 'Felicia Cole', 'Sheila.Ratke@hotmail.com', 'Y', '2025-09-19 08:39:28.000', '$2b$10$49CDCPBHwLK7PvcA7k0/n.wKucsApk01pY6OoKbIQmpcd9cK4norK', '601-725-9260', 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/77.jpg', 'user', NULL, NULL, 'active', '2025-09-19 08:39:28.000', '2025-09-19 09:52:12.000'),
(78, 'ae65a9e0-8292-46ff-800c-cbb521bc3715', 'Elsa Towne', 'Jerry_Gottlieb@gmail.com', 'Y', '2025-09-19 08:39:28.000', '$2b$10$tdE831RJ7e8ROB6bxnPqZOTiAG9vvXf8i2rPUPz/hihzjqg.i1Um6', '(726) 424-7302 x149', 'https://avatars.githubusercontent.com/u/10398212', 'user', NULL, NULL, 'inactive', '2025-09-19 08:39:28.000', '2025-09-19 08:39:28.000'),
(79, 'b42e68a6-54ed-4b05-9847-56aef72b56d8', 'Andrea Sipes', 'Reagan.Leuschke19@yahoo.com', 'Y', '2025-09-19 08:39:28.000', '$2b$10$LprSUtkYI3dZSH9WV32ga.VrkWLMgVz2CPw8waPIdNiBBoqmI5RSG', '839-370-4244', 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/97.jpg', 'user', NULL, NULL, 'active', '2025-09-19 08:39:28.000', '2025-09-19 09:52:36.000'),
(80, '4bf30c21-5988-4de3-99a4-a6563c0fe278', 'Sadie Nicolas', 'Rebecca35@gmail.com', 'Y', '2025-09-19 08:39:28.000', '$2b$10$BswNa1fi/Guuaf7xG965ge2t2UjyW3LxVs20hsfugZNiBrwzRcGi6', '673-975-4847 x172', 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/56.jpg', 'user', NULL, NULL, 'active', '2025-09-19 08:39:28.000', '2025-09-19 08:39:28.000'),
(81, '1c580715-f504-4216-bc95-2d71a94ffc5c', 'Ignacio Hane', 'Toy12@hotmail.com', 'Y', '2025-09-19 08:39:28.000', '$2b$10$YEqr8K37rEZB8UKOE43lJ.vL8W6hKliKeoqzxqQIBiY2Ca6VNNP/2', '1-467-408-6724', 'https://avatars.githubusercontent.com/u/67056994', 'user', NULL, NULL, 'active', '2025-09-19 08:39:28.000', '2025-09-19 08:39:28.000'),
(82, '8f33f2cf-54e2-4fab-830c-8345a0e7eb89', 'Kristine Dicki', 'Earnestine.Klein@yahoo.com', 'Y', '2025-09-19 08:39:28.000', '$2b$10$ev.3z6/c9T.fiCCoiMO6p.Ta9Hk26jZouA5OLYfXouxmiifuCv91q', '1-940-751-0116 x685', 'https://avatars.githubusercontent.com/u/76091334', 'user', NULL, NULL, 'suspended', '2025-09-19 08:39:28.000', '2025-09-19 08:39:28.000'),
(83, '812818d5-6f95-48d1-a6e0-aeded9c36ef7', 'Francisco Lindgren', 'Sallie.Friesen34@yahoo.com', 'Y', '2025-09-19 08:39:28.000', '$2b$10$39oVESJcqc9Lk0qAOyM.2.UYwUgcunrFIULgfgWAhJX4YvuOVACeK', '(259) 977-8092 x2156', 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/61.jpg', 'user', NULL, NULL, 'inactive', '2025-09-19 08:39:28.000', '2025-09-19 09:52:29.000'),
(84, '47b99910-2235-4a36-bb2e-2535d34bef69', 'Shannon Schroeder', 'Hilda.Runolfsdottir68@yahoo.com', 'Y', '2025-09-19 08:39:28.000', '$2b$10$gUpM5UHN/ZTs/n6FrxglJei1.2I8MT4fXs0ENVc.Sz4WSB7sDPIQK', '344.779.0948 x8470', 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/2.jpg', 'user', NULL, NULL, 'active', '2025-09-19 08:39:28.000', '2025-09-19 08:39:28.000'),
(85, 'eac11c7a-0b18-402f-828e-85c1c9010175', 'Elisa Powlowski', 'Shana35@gmail.com', 'Y', '2025-09-19 08:39:28.000', '$2b$10$4j4YrMlGwJ4wE7wuWmdi4e0G7BbTUa0K9vWQEljwcrMD8frUQrwxG', '1-985-755-5910 x7434', 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/3.jpg', 'user', NULL, NULL, 'active', '2025-09-19 08:39:28.000', '2025-09-19 08:39:28.000'),
(86, 'd8287fc4-bc9f-48aa-890f-d76fb4c62ca6', 'Antonia Koelpin', 'Marcelino_Feil44@gmail.com', 'Y', '2025-09-19 08:39:28.000', '$2b$10$c7i58GSmmY5SgI/1WRQS3uUTTSfm8jRa4EyGWnMHk0kw92oemL.EG', '1-926-436-6153', 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/62.jpg', 'user', NULL, NULL, 'inactive', '2025-09-19 08:39:28.000', '2025-09-19 08:39:28.000'),
(87, '0fe00fd3-2d14-4a83-ac44-e34ab9899543', 'Herman Howell', 'Kristofer.Connelly@yahoo.com', 'Y', '2025-09-19 08:39:28.000', '$2b$10$roP.jQLXE4aJroGVtoqxSu0flhM2xjLH7tHHZsKAPReNdc1gwRbVW', '(800) 528-3040', 'https://avatars.githubusercontent.com/u/62979628', 'user', NULL, NULL, 'inactive', '2025-09-19 08:39:28.000', '2025-09-19 08:39:28.000'),
(88, 'b2cc8580-a9b7-42e5-9a56-bfacfeccd3c3', 'Olive Stoltenberg', 'Casper.Emard@gmail.com', 'Y', '2025-09-19 08:39:29.000', '$2b$10$3xAxCwPQP9uJ7iaIjfoKIuxeuRvJe6NS46KfV6peoQ.OQrN/lz5xa', '(862) 481-7100', 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/23.jpg', 'user', NULL, NULL, 'active', '2025-09-19 08:39:29.000', '2025-09-19 08:39:29.000'),
(89, '390ec9cd-1cbd-437d-8cf5-82b3c577d385', 'Rufus Rodriguez', 'Filomena_Anderson@gmail.com', 'Y', '2025-09-19 08:39:29.000', '$2b$10$ZziNSvrjjturDDHgLxG6/uK2USgrfzOfBMgOYr7Nw/lYkvI/XkD1a', '428.871.4957', 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/65.jpg', 'user', NULL, NULL, 'suspended', '2025-09-19 08:39:29.000', '2025-09-19 08:39:29.000'),
(90, 'd7b005b2-515e-488c-83a2-b6287de42de3', 'Victor Tromp', 'Blanca_Wyman30@gmail.com', 'Y', '2025-09-19 08:39:29.000', '$2b$10$ECiwZbvdPoOs6U8ptPOVOOSaw.RGE.tKe1ZhGgvAujsLuNbyz/6wa', '(239) 766-2845', 'https://avatars.githubusercontent.com/u/8514968', 'user', NULL, NULL, 'inactive', '2025-09-19 08:39:29.000', '2025-09-19 08:39:29.000'),
(91, 'b9726ece-de85-4c9f-b32f-e0dcd0b6fc60', 'Jake Grimes', 'Marlon_Jast49@yahoo.com', 'Y', '2025-09-19 08:39:29.000', '$2b$10$n4Nd1w931rEWWtRql58aBOjYB9eM3Vii5q6VZpPYzwPdbL07UcJKm', '1-419-465-0173 x4276', 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/66.jpg', 'user', NULL, NULL, 'suspended', '2025-09-19 08:39:29.000', '2025-09-19 08:39:29.000'),
(92, '81724b8b-a465-4351-be78-83b862410372', 'Forrest Nicolas', 'Maryse.Hintz-Mohr24@yahoo.com', 'Y', '2025-09-19 08:39:29.000', '$2b$10$FiakXRqNgXJ7fgeo9llRfOuGiL5eK33EN27U3ayzOXRtpCBXVC3ne', '324-420-1662 x16246', 'https://avatars.githubusercontent.com/u/91020204', 'user', NULL, NULL, 'active', '2025-09-19 08:39:29.000', '2025-09-19 08:39:29.000'),
(93, '8724a235-3938-43cb-9387-a7f00ebc9823', 'Ron Bashirian', 'Maximillia.Feil75@yahoo.com', 'Y', '2025-09-19 08:39:29.000', '$2b$10$MIie3qqXQPEkIwzA4MUOpeVMyIvoBvA4pgnl1yiPtND.baSBtLos6', '(969) 246-6415', 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/84.jpg', 'user', NULL, NULL, 'suspended', '2025-09-19 08:39:29.000', '2025-09-19 08:39:29.000'),
(94, 'f80d9057-8186-4050-8aa6-415b119e55ca', 'Lucy Orn', 'Demario_OReilly0@hotmail.com', 'Y', '2025-09-19 08:39:29.000', '$2b$10$F2X41g1YOLa5f2CNSX.BpuD6quymx6JmiLywSCs6XGyvBZqQb7Y8G', '(937) 669-2602', 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/73.jpg', 'user', NULL, NULL, 'active', '2025-09-19 08:39:29.000', '2025-09-19 08:39:29.000'),
(95, '990ff857-ddfc-44e5-a881-a21bc977d2cf', 'David Carroll', 'Alyce.Hand@yahoo.com', 'Y', '2025-09-19 08:39:29.000', '$2b$10$bVo1MmddBy1GIfC3a.Yms.petsrBzVR9ODdbC54eXJ5A4v4DqYZ1K', '216-648-8415', 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/25.jpg', 'user', NULL, NULL, 'active', '2025-09-19 08:39:29.000', '2025-09-20 06:25:59.000'),
(96, 'b0e2443e-de09-401e-9297-5d34a15ddc25', 'Cornelius Erdman', 'Colt_Pacocha94@hotmail.com', 'Y', '2025-09-19 08:39:29.000', '$2b$10$GgW4ByMxsJmQR8Fbxv/iC.Svb0X9nJqg2bkOyuUB5lky4PxSYMY5y', '776.849.2459 x4007', 'https://avatars.githubusercontent.com/u/26253985', 'user', NULL, NULL, 'active', '2025-09-19 08:39:29.000', '2025-09-19 08:39:29.000'),
(97, 'fdb9c5d3-5cec-4248-85fe-b219edc62c2f', 'Estelle Harris', 'Maybell80@hotmail.com', 'Y', '2025-09-19 08:39:29.000', '$2b$10$4s7q3BF7vefz5eBwHZdNAeFnxsGedD1ysAzoyMjfCfFEfbKRGWlMO', '1-453-719-4488 x624', 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/51.jpg', 'user', NULL, NULL, 'inactive', '2025-09-19 08:39:29.000', '2025-09-19 08:39:29.000'),
(98, '7c84794e-e507-4aac-a324-32aebca6ad82', 'Dwight Braun', 'Van_Towne@hotmail.com', 'Y', '2025-09-19 08:39:29.000', '$2b$10$EN.f/BrrzEhVJDBzLsCU..r3Pad9.E9weYYFhTcsOEZn7uG3bFece', '1-308-554-0986 x6130', 'https://avatars.githubusercontent.com/u/69321987', 'user', NULL, NULL, 'active', '2025-09-19 08:39:29.000', '2025-09-19 08:39:29.000'),
(99, 'd41ee62c-d5b3-4be0-808f-ebfe8fb41a47', 'Pablo Hansen', 'Jasmin.Mertz84@yahoo.com', 'Y', '2025-09-19 08:39:29.000', '$2b$10$SRBhcJs.mJajRRrvD51qGOHKMtNyBefsI4FQV6JtSOTHd9jeAZIUG', '214.511.7820 x781', 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/50.jpg', 'user', NULL, NULL, 'suspended', '2025-09-19 08:39:29.000', '2025-09-19 08:39:29.000'),
(100, 'c30b5b13-1b79-44cb-8981-9cf108b71eeb', 'Phil Turcotte', 'Cathryn66@gmail.com', 'Y', '2025-09-19 08:39:30.000', '$2b$10$4flyMugJdesoRM.WHZevR.b7nZq7gobCFnh53cZL40TL/BeeLb/la', '359-395-9721 x52357', 'https://avatars.githubusercontent.com/u/60602417', 'user', NULL, NULL, 'inactive', '2025-09-19 08:39:30.000', '2025-09-19 08:39:30.000'),
(101, 'faefa805-0b58-4324-be26-f2b738134c51', 'Wilma Terry', 'Abagail90@gmail.com', 'Y', '2025-09-19 08:39:30.000', '$2b$10$iS1iusUGd7FaZpwwDlD/C.XHu/MYK0tuwcKkUSfH9dB7YjNZV7KzK', '265.290.1019 x596', 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/89.jpg', 'user', NULL, NULL, 'suspended', '2025-09-19 08:39:30.000', '2025-09-19 08:39:30.000'),
(102, 'b3e3d729-740f-4911-bdfa-a052bc68add2', 'Dr. Rufus Langosh-Gulgowski', 'Rodolfo_Volkman60@yahoo.com', 'Y', '2025-09-19 08:39:30.000', '$2b$10$ofeEDEbCL40kkiwUtpBWAunHP4UeqkbCADLMpfIa/FsZD4maJycjC', '1-507-279-9242 x9938', 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/38.jpg', 'user', NULL, NULL, 'active', '2025-09-19 08:39:30.000', '2025-09-19 08:39:30.000'),
(103, '4d3e6b86-31ae-41bc-a541-eb23b42c85f1', 'Clarence Feest', 'Rowena.Ryan@yahoo.com', 'Y', '2025-09-19 08:39:30.000', '$2b$10$hBK/dDE8DEmEiNkeXTAmFeA7gNhJAFuIQxyYN14uW.ykqX63frzqe', '700-513-8039 x60018', 'https://avatars.githubusercontent.com/u/30163608', 'user', NULL, NULL, 'inactive', '2025-09-19 08:39:30.000', '2025-09-19 08:39:30.000'),
(104, 'cdcd401e-21d8-4f7b-b451-5ad3e22e0491', 'Angel Langworth', 'Adolphus29@gmail.com', 'Y', '2025-09-19 08:39:30.000', '$2b$10$S85gI3A0m7PjLFF808cPdO.04Aag1NZVmm6YXoNe6dfAEOGIr8GxC', '1-224-421-2297 x415', 'https://avatars.githubusercontent.com/u/42641722', 'user', NULL, NULL, 'active', '2025-09-19 08:39:30.000', '2025-09-19 10:15:09.000'),
(105, '49f4d51b-2fe2-4c2c-a231-00d8fb48bfd4', 'Eugene Willms', 'Trevion_Crona@gmail.com', 'Y', '2025-09-19 08:39:30.000', '$2b$10$R6tYzVDmFH/mrJLrwTu/2OlUcC0q206voIbxWY.lNtVoBg2K9owpa', '216-217-8877 x0338', 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/43.jpg', 'user', NULL, NULL, 'suspended', '2025-09-19 08:39:30.000', '2025-09-19 08:39:30.000'),
(106, 'f43731ee-766a-472b-a199-264f40a9f418', 'Rebecca Sporer-Cruickshank', 'Jaime15@gmail.com', 'Y', '2025-09-19 08:39:30.000', '$2b$10$bMp.XwyaL0TnTp27jEAIxeztyZhkVhEaPJIuCfpPDBMJU9mfv27iq', '648-318-1262 x7657', 'https://avatars.githubusercontent.com/u/69254516', 'user', NULL, NULL, 'active', '2025-09-19 08:39:30.000', '2025-09-20 08:13:08.000'),
(107, '6edc936e-56d9-4ca0-84ee-09aed3bbdab7', 'Rebecca Schultz', 'Ed.Lind@yahoo.com', 'Y', '2025-09-19 08:39:30.000', '$2b$10$q6UwN8rZ9WKoM/V2r8NoBeG4CzmloWlCr553K/BNgCpTucKRn8W7S', '(395) 841-6087 x3998', 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/35.jpg', 'user', NULL, NULL, 'active', '2025-09-19 08:39:30.000', '2025-09-19 08:39:30.000'),
(108, '25b62df6-77d6-4e97-9fe1-c49fcf429326', 'RJ Singhs', 'rs1@yopamail.com', 'Y', '2025-09-19 12:24:19.000', '$2b$10$UrebIzEyC3H5DpK1r/jVteo1KUX7IRh4fNgV1bXiUx.EE2yBp1dhm', '8855226699', '', 'admin', NULL, NULL, 'active', '2025-09-19 12:24:19.000', '2025-09-20 08:13:02.000'),
(109, '2f06c091-c774-4fb3-9d34-fde8a35a3f23', 'NL K', 'necc@yopmail.com', 'Y', '2025-09-20 05:52:31.000', '$2b$10$h2k08qS7cCfYycIk70HA7epR51znEY3C0cmGnuKhWQ/7BLNP7BEH.', '85522114444', NULL, 'admin', NULL, NULL, 'active', '2025-09-20 05:52:31.000', '2025-09-20 08:12:58.000'),
(110, '803144d1-7285-4d0c-9c9c-44b502a517aa', 'Rajesh Khanna', 'rk@yopmail.com', 'Y', '2025-09-20 07:06:08.000', '$2b$10$y8Cyb9en99UY7FdK2rimUOheKF/qqdZuQVkz5n1q.KzH6BbH16CVa', '8855221144', 'http://localhost:8000/uploads/images/1758351967485-273116607.jpg', 'user', NULL, NULL, 'active', '2025-09-20 07:06:08.000', '2025-09-20 07:06:08.000'),
(111, '1f4d298f-f5d3-4ae1-9643-964ce340ee60', 'Samuel Dickinson', 'Keshawn68@gmail.com', 'Y', '2025-09-25 05:49:04.000', '$2b$10$XcNr4CpvDCbC/LiP9mTX2ustcNdpGtvTLPwLHmrLp910ufxqQ2zP.', '(430) 674-6099 x0889', 'https://avatars.githubusercontent.com/u/62605893', 'user', NULL, NULL, 'active', '2025-09-25 05:49:04.000', '2025-09-25 05:49:04.000'),
(112, '794f4d34-33ae-4740-b6c3-e8911dddc80c', 'Cindy Stracke', 'Kathlyn_Hyatt@gmail.com', 'Y', '2025-09-25 05:49:04.000', '$2b$10$EpXjpKu9nsb0z4GY79b0Du.MoHnCHeZURiTzu5Yao6au4r2GrWWVi', '(228) 932-7138 x868', 'https://avatars.githubusercontent.com/u/37050620', 'user', NULL, NULL, 'active', '2025-09-25 05:49:04.000', '2025-09-25 05:49:04.000'),
(113, '52f81b6c-15bc-4288-85fc-f92b1a893a15', 'Barry Erdman', 'Amos.Ward6@gmail.com', 'Y', '2025-09-25 05:49:04.000', '$2b$10$68hsexJ5XGH3Tfb5ICOGoerlVZXEefo9RJT5r5tsuoAGyPbGWpSvW', '649-315-5605 x945', 'https://avatars.githubusercontent.com/u/72193038', 'user', NULL, NULL, 'active', '2025-09-25 05:49:04.000', '2025-09-25 05:49:04.000'),
(114, 'e848b645-abdf-457a-833b-42b282f463e5', 'Georgia Dach DVM', 'Lambert98@gmail.com', 'Y', '2025-09-25 05:49:04.000', '$2b$10$hfJHciwk7n35tgLfDQeH0e/Ot54ABfRc1uXpHINBRIstEJKAWBeMO', '964.203.9090 x6578', 'https://avatars.githubusercontent.com/u/30887285', 'user', NULL, NULL, 'active', '2025-09-25 05:49:04.000', '2025-09-25 05:49:04.000'),
(115, 'a07788fd-df08-4a5c-bde4-1697e8827f4c', 'Sally Larkin', 'Prudence_Metz81@gmail.com', 'Y', '2025-09-25 05:49:04.000', '$2b$10$kExldAVCojpVRHdZ.c6WqOCunekiXB3YmyPK3LimuYw9VVtLdm9Ta', '847.269.2683 x598', 'https://avatars.githubusercontent.com/u/72486842', 'user', NULL, NULL, 'inactive', '2025-09-25 05:49:04.000', '2025-09-25 05:49:04.000'),
(116, 'b7978ce6-7765-4c39-805b-10b59646a77f', 'Ervin Lynch', 'Eleanora_Halvorson68@yahoo.com', 'Y', '2025-09-25 05:49:04.000', '$2b$10$jksS8CcCpy9La6CPDoy8/uULs7OcY2cps0ASlziYvdMYU2cctF2pm', '1-236-436-3685 x7110', 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/14.jpg', 'user', NULL, NULL, 'active', '2025-09-25 05:49:04.000', '2025-09-25 05:49:04.000'),
(117, '4a6dcf5a-b990-4dca-889b-128c81298bf7', 'Carolyn Predovic', 'Nelson_Pacocha12@gmail.com', 'Y', '2025-09-25 05:49:04.000', '$2b$10$mPM9.Ofzu5xMilDbbaugu.qT3d.uSQgVQ2fSQBXLAhNW/gO83YTUG', '1-605-863-2671 x6376', 'https://avatars.githubusercontent.com/u/93714239', 'user', NULL, NULL, 'active', '2025-09-25 05:49:04.000', '2025-09-25 05:49:04.000'),
(118, '9981dd54-525f-453b-941a-f58cb32ac505', 'Diane Pagac-Fay', 'Hunter.Deckow26@yahoo.com', 'Y', '2025-09-25 05:49:04.000', '$2b$10$nvozXAiJ9UGOEmJ8kDXXeO8eORKTy/o4lqLGoNlCgczqphx9Bp.w2', '(378) 854-2624', 'https://avatars.githubusercontent.com/u/18613567', 'user', NULL, NULL, 'suspended', '2025-09-25 05:49:04.000', '2025-09-25 05:49:04.000'),
(119, '97620f28-c782-43e6-98b9-181900c808d1', 'Mr. Elias Koepp', 'Miles_Bahringer@hotmail.com', 'Y', '2025-09-25 05:49:04.000', '$2b$10$8yeSHDe5CfYfK1ft67WM4.EcE1qFPsqp/9jUlTWaT.CR/FGXA4Eny', '586.404.4852', 'https://avatars.githubusercontent.com/u/7942029', 'user', NULL, NULL, 'active', '2025-09-25 05:49:04.000', '2025-09-25 05:52:28.000'),
(120, 'a6bb7fd9-7522-437f-bb11-df25b9fe56b6', 'Lola Stehr', 'Craig98@yahoo.com', 'Y', '2025-09-25 05:49:04.000', '$2b$10$QJuymVyLZkHG9pCzvRPJ3ekMX8y.DoUQy6Nm91Bdda..Z4Hox9cqS', '790.995.5479 x702', 'https://avatars.githubusercontent.com/u/24954859', 'user', NULL, NULL, 'inactive', '2025-09-25 05:49:04.000', '2025-09-25 05:49:04.000'),
(121, 'fa4d1219-0ebd-425d-8071-606d75029047', 'Demo User', 'demo@example.com', 'Y', '2026-03-10 12:01:43.834', '$2b$10$4Wy./fBfE6loa5iA.PwcduIvlOh5ZuA3xbVKRiDOaAkSw6ikHXBuq', '9999999999', '', 'admin', NULL, NULL, 'active', '2026-03-10 12:01:43.834', '2026-03-10 12:01:43.834');

-- --------------------------------------------------------

--
-- Table structure for table `user_permissions`
--

DROP TABLE IF EXISTS `user_permissions`;
CREATE TABLE IF NOT EXISTS `user_permissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `user_id` int NOT NULL,
  `module_permission_id` int NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `user_permissions_uuid_unique` (`uuid`),
  UNIQUE KEY `unique_user_permission` (`user_id`,`module_permission_id`),
  KEY `modulePermissionId` (`module_permission_id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user_permissions`
--

INSERT INTO `user_permissions` (`id`, `uuid`, `user_id`, `module_permission_id`, `created_at`, `updated_at`) VALUES
(1, '275596bd-f845-4bee-a810-38bcd35ac4d4', 3, 36, '2025-10-01 05:23:56.000', '2025-10-01 05:23:56.000'),
(2, '941431fb-d269-4fb1-b83d-16df05aabf96', 2, 6, '2025-10-01 05:32:09.000', '2025-10-01 05:32:09.000'),
(5, '6e3cc5ed-14d8-4c48-b4ed-9e7c2489c3c4', 2, 7, '2025-10-01 05:32:12.000', '2025-10-01 05:32:12.000'),
(6, '81e60dde-7ca1-4aaf-85f3-026dfc0e6cdb', 2, 12, '2025-10-01 05:32:13.000', '2025-10-01 05:32:13.000'),
(7, 'f0305cda-65f8-45fb-a51b-95fadbc98bab', 2, 37, '2025-10-01 05:32:13.000', '2025-10-01 05:32:13.000'),
(8, 'dd475783-f507-4597-a455-645b0f0eb19f', 2, 8, '2025-10-01 05:32:22.000', '2025-10-01 05:32:22.000'),
(9, 'a13a9706-d9f1-4a37-9ef9-ba17e611860f', 2, 13, '2025-10-01 05:32:22.000', '2025-10-01 05:32:22.000'),
(10, 'aff9d200-94e9-460d-af15-e886c8d50493', 2, 38, '2025-10-01 05:32:23.000', '2025-10-01 05:32:23.000'),
(11, '93037d8c-96b3-423a-a135-d49dd30710da', 2, 9, '2025-10-01 05:32:25.000', '2025-10-01 05:32:25.000'),
(12, '1258a825-f713-420c-b720-ecae53e9d186', 2, 14, '2025-10-01 05:32:26.000', '2025-10-01 05:32:26.000'),
(13, '1c95b830-ae80-4882-a59f-17b6706b5368', 2, 39, '2025-10-01 05:32:27.000', '2025-10-01 05:32:27.000'),
(15, '472668ec-97ae-4035-8b35-0aa0cd9fcb8d', 2, 15, '2025-10-01 05:32:28.000', '2025-10-01 05:32:28.000'),
(17, 'ac95063a-36ab-465f-afa2-2b12e2c990f3', 2, 10, '2025-10-01 05:32:41.000', '2025-10-01 05:32:41.000'),
(18, 'd4a2593b-19e1-4c60-abcd-f67b5816314e', 2, 11, '2025-10-01 07:52:43.000', '2025-10-01 07:52:43.000'),
(19, 'd5eb2e65-6360-45cd-beb0-827dc8625444', 2, 36, '2025-10-01 07:52:46.000', '2025-10-01 07:52:46.000'),
(20, 'd13f512d-439b-4eac-8f29-0d5fbc181f0d', 2, 40, '2025-10-01 07:52:56.000', '2025-10-01 07:52:56.000'),
(28, 'e5ec02e2-6429-4c28-afc6-86ecf658b6ca', 1, 6, '2026-03-11 06:35:20.329', '2026-03-11 06:35:20.329');

-- --------------------------------------------------------

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
CREATE TABLE IF NOT EXISTS `_prisma_migrations` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int UNSIGNED NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('13d0fa5f-f626-4c1b-a43b-f33d091307fd', '0b67b2dca93ccf546227ba63448f45b5e98cb920ce7f002d768b24893dc3f0d9', '2026-03-11 10:21:59.252', '20260311130000_init', NULL, NULL, '2026-03-11 10:21:57.726', 1);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `activitylogs_ibfk_1` FOREIGN KEY (`board_id`) REFERENCES `boards` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `activitylogs_ibfk_2` FOREIGN KEY (`list_id`) REFERENCES `lists` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `activitylogs_ibfk_3` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `activitylogs_ibfk_4` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `attachments`
--
ALTER TABLE `attachments`
  ADD CONSTRAINT `attachments_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `attachments_ibfk_2` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `boards`
--
ALTER TABLE `boards`
  ADD CONSTRAINT `boards_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `conversations`
--
ALTER TABLE `conversations`
  ADD CONSTRAINT `conversations_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `conversation_members`
--
ALTER TABLE `conversation_members`
  ADD CONSTRAINT `conversationmembers_ibfk_1` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `conversationmembers_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `lists`
--
ALTER TABLE `lists`
  ADD CONSTRAINT `lists_ibfk_1` FOREIGN KEY (`board_id`) REFERENCES `boards` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `fk_reply_message` FOREIGN KEY (`reply_to_message_id`) REFERENCES `messages` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `message_files`
--
ALTER TABLE `message_files`
  ADD CONSTRAINT `messagefiles_ibfk_1` FOREIGN KEY (`message_id`) REFERENCES `messages` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `message_status`
--
ALTER TABLE `message_status`
  ADD CONSTRAINT `messagestatus_ibfk_1` FOREIGN KEY (`message_id`) REFERENCES `messages` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messagestatus_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `module_permissions`
--
ALTER TABLE `module_permissions`
  ADD CONSTRAINT `module_permissions_ibfk_1` FOREIGN KEY (`module_id`) REFERENCES `modules` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `module_permissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `role_modules`
--
ALTER TABLE `role_modules`
  ADD CONSTRAINT `role_modules_module_id_foreign` FOREIGN KEY (`module_id`) REFERENCES `modules` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`list_id`) REFERENCES `lists` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tasks_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `tasks_ibfk_3` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`);

--
-- Constraints for table `user_permissions`
--
ALTER TABLE `user_permissions`
  ADD CONSTRAINT `user_permissions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_permissions_ibfk_2` FOREIGN KEY (`module_permission_id`) REFERENCES `module_permissions` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
