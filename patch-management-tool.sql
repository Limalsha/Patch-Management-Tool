-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 25, 2025 at 09:40 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `patch-management-tool`
--

-- --------------------------------------------------------

--
-- Table structure for table `activities`
--

CREATE TABLE `activities` (
  `id` int(11) NOT NULL,
  `action` varchar(255) DEFAULT NULL,
  `server_name` varchar(100) DEFAULT NULL,
  `activity_type` enum('info','success','warning','error') DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `patches`
--

CREATE TABLE `patches` (
  `id` int(11) NOT NULL,
  `server_id` int(11) DEFAULT NULL,
  `package_name` varchar(100) DEFAULT NULL,
  `current_version` varchar(50) DEFAULT NULL,
  `available_version` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `severity` enum('critical','high','medium','low') DEFAULT NULL,
  `status` enum('available','excluded','deployed') DEFAULT 'available'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `patches`
--

INSERT INTO `patches` (`id`, `server_id`, `package_name`, `current_version`, `available_version`, `description`, `severity`, `status`) VALUES
(1, 1, 'openssl', '1.1.1f', '1.1.1w', 'CVE-2024-3456 - Critical SSL/TLS vulnerability fix', 'critical', 'available'),
(2, 1, 'nginx', '1.18.0', '1.24.0', 'CVE-2024-2987 - Memory corruption vulnerability', 'high', 'available'),
(3, 1, 'systemd', '245.4', '245.11', 'Improved stability and logging', 'medium', 'available'),
(4, 1, 'curl', '7.68.0', '7.88.1', 'CVE-2024-4123 - RCE vulnerability in curl URL parsing', 'critical', 'available'),
(5, 1, 'python3', '3.8.5', '3.8.18', 'Multiple minor security fixes', 'medium', 'deployed'),
(6, 2, 'kernel', '4.18.0-240', '4.18.0-425', 'Kernel privilege escalation fix (CVE-2024-5678)', 'critical', 'available'),
(7, 2, 'httpd', '2.4.37', '2.4.58', 'Apache HTTPD security and performance update', 'high', 'available'),
(8, 2, 'bash', '5.0.17', '5.2.26', 'CVE-2024-1221 - Input sanitization improvement', 'medium', 'available'),
(9, 2, 'openssl', '1.1.1k', '1.1.1w', 'TLS 1.3 enhancements and fixes', 'high', 'deployed'),
(10, 2, 'glibc', '2.28', '2.34', 'CVE-2024-3298 - Memory leak vulnerability', 'critical', 'available'),
(11, 2, 'kernel', '4.18.0-240', '4.18.0-425', 'Kernel privilege escalation fix (CVE-2024-5678)', 'critical', 'available'),
(12, 2, 'httpd', '2.4.37', '2.4.58', 'Apache HTTPD security and performance update', 'high', 'available'),
(13, 2, 'bash', '5.0.17', '5.2.26', 'CVE-2024-1221 - Input sanitization improvement', 'medium', 'available'),
(14, 2, 'openssl', '1.1.1k', '1.1.1w', 'TLS 1.3 enhancements and fixes', 'high', 'deployed'),
(15, 2, 'glibc', '2.28', '2.34', 'CVE-2024-3298 - Memory leak vulnerability', 'critical', 'available'),
(21, 2, 'kernel', '4.18.0-240', '4.18.0-425', 'Kernel privilege escalation fix (CVE-2024-5678)', 'critical', 'available'),
(22, 2, 'httpd', '2.4.37', '2.4.58', 'Apache HTTPD security and performance update', 'high', 'available'),
(23, 2, 'bash', '5.0.17', '5.2.26', 'CVE-2024-1221 - Input sanitization improvement', 'medium', 'available'),
(24, 2, 'openssl', '1.1.1k', '1.1.1w', 'TLS 1.3 enhancements and fixes', 'high', 'deployed'),
(25, 2, 'glibc', '2.28', '2.34', 'CVE-2024-3298 - Memory leak vulnerability', 'critical', 'available'),
(31, 2, 'kernel', '4.18.0-240', '4.18.0-425', 'Kernel privilege escalation fix (CVE-2024-5678)', 'critical', 'available'),
(32, 2, 'httpd', '2.4.37', '2.4.58', 'Apache HTTPD security and performance update', 'high', 'available'),
(33, 2, 'bash', '5.0.17', '5.2.26', 'CVE-2024-1221 - Input sanitization improvement', 'medium', 'available'),
(34, 2, 'openssl', '1.1.1k', '1.1.1w', 'TLS 1.3 enhancements and fixes', 'high', 'deployed'),
(35, 2, 'glibc', '2.28', '2.34', 'CVE-2024-3298 - Memory leak vulnerability', 'critical', 'available');

-- --------------------------------------------------------

--
-- Table structure for table `patch_activity`
--

CREATE TABLE `patch_activity` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `date` date DEFAULT NULL,
  `total_patches` int(11) DEFAULT NULL,
  `critical_patches` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `patch_activity`
--

INSERT INTO `patch_activity` (`id`, `date`, `total_patches`, `critical_patches`) VALUES
(1, '2025-10-15', 24, 8),
(2, '2025-10-16', 18, 5),
(3, '2025-10-17', 32, 12),
(4, '2025-10-18', 28, 9),
(5, '2025-10-19', 15, 4),
(6, '2025-10-20', 22, 7),
(7, '2025-10-21', 35, 11);

-- --------------------------------------------------------

--
-- Table structure for table `servers`
--

CREATE TABLE `servers` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `ip_address` varchar(50) NOT NULL,
  `os_type` varchar(100) DEFAULT NULL,
  `kernel_version` varchar(50) DEFAULT NULL,
  `agent_version` varchar(50) DEFAULT NULL,
  `status` enum('online','offline') DEFAULT 'offline',
  `last_check_in` datetime DEFAULT NULL,
  `description` text DEFAULT NULL,
  `auth_token` varchar(255) DEFAULT NULL,
  `uptime` varchar(50) DEFAULT NULL,
  `pending_updates` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `servers`
--

INSERT INTO `servers` (`id`, `name`, `ip_address`, `os_type`, `kernel_version`, `agent_version`, `status`, `last_check_in`, `description`, `auth_token`, `uptime`, `pending_updates`) VALUES
(1, 'web-server 01', '10.15.3.17', 'Rocky linux 08', 'N/A', 'N/A', 'offline', '2025-10-22 12:31:43', '', 'APM-kagpzqgd6s8', '0 days', 0),
(2, 'web-server 02', '10.2.3.45', 'Ubuntu', 'N/A', 'N/A', 'offline', '2025-10-22 18:48:08', '', 'APM-fshjsmfswe', '0 days', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activities`
--
ALTER TABLE `activities`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `patches`
--
ALTER TABLE `patches`
  ADD PRIMARY KEY (`id`),
  ADD KEY `server_id` (`server_id`);

--
-- Indexes for table `patch_activity`
--
ALTER TABLE `patch_activity`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `servers`
--
ALTER TABLE `servers`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activities`
--
ALTER TABLE `activities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `patches`
--
ALTER TABLE `patches`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `patch_activity`
--
ALTER TABLE `patch_activity`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `servers`
--
ALTER TABLE `servers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `patches`
--
ALTER TABLE `patches`
  ADD CONSTRAINT `patches_ibfk_1` FOREIGN KEY (`server_id`) REFERENCES `servers` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
