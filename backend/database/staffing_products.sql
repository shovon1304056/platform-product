-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 15, 2025 at 05:37 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `staffing_products`
--

-- --------------------------------------------------------

--
-- Table structure for table `staffingdb_brands`
--

CREATE TABLE `staffingdb_brands` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `logo_public_id` varchar(255) NOT NULL,
  `logo_url` text NOT NULL,
  `status` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staffingdb_brands`
--

INSERT INTO `staffingdb_brands` (`id`, `name`, `logo_public_id`, `logo_url`, `status`) VALUES
(1, 'TechCorp', 'logo_techcorp', 'https://example.com/logos/techcorp.png', 1),
(2, 'SoundX', 'logo_soundx', 'https://example.com/logos/soundx.png', 1),
(3, 'ViewMax', 'logo_viewmax', 'https://example.com/logos/viewmax.png', 1),
(4, 'GameForce', 'logo_gameforce', 'https://example.com/logos/gameforce.png', 1);

-- --------------------------------------------------------

--
-- Table structure for table `staffingdb_products`
--

CREATE TABLE `staffingdb_products` (
  `id` bigint(20) NOT NULL,
  `category_id` bigint(20) NOT NULL,
  `brand_id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `cutted_price` decimal(10,2) NOT NULL,
  `stock` int(11) DEFAULT 1,
  `warranty` int(11) DEFAULT 1,
  `ratings` decimal(3,2) DEFAULT 0.00,
  `num_of_reviews` int(11) DEFAULT 0,
  `status` int(10) NOT NULL DEFAULT 1,
  `created_by` bigint(20) NOT NULL,
  `updated_by` bigint(20) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staffingdb_products`
--

INSERT INTO `staffingdb_products` (`id`, `category_id`, `brand_id`, `name`, `description`, `price`, `cutted_price`, `stock`, `warranty`, `ratings`, `num_of_reviews`, `status`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'Smartphone X1', 'Latest flagship phone.', 799.99, 899.99, 50, 1, 4.50, 12, 1, 1, 1, '2025-07-15 19:37:41', '2025-07-15 19:37:41'),
(2, 1, 2, 'Wireless Headphones', 'Noise cancelling over-ear headphones.', 199.99, 249.99, 100, 2, 4.20, 30, 1, 2, 2, '2025-07-15 19:37:41', '2025-07-15 19:38:11'),
(3, 2, 3, '4K TV 55\"', 'Ultra HD smart TV with HDR.', 599.00, 699.00, 20, 3, 4.80, 45, 1, 1, 1, '2025-07-15 19:37:41', '2025-07-15 19:38:14'),
(4, 2, 4, 'Gaming Laptop Z7', 'High performance laptop for gaming.', 1299.99, 1499.99, 15, 2, 4.60, 22, 1, 3, 3, '2025-07-15 19:37:41', '2025-07-15 19:38:17'),
(9, 1, 1, 'Abc 10', 'Usefull product', 20.00, 15.00, 5, 2, 0.00, 0, 1, 1, 1, '2025-07-15 21:32:41', '2025-07-15 21:32:41'),
(10, 1, 1, 'Abc 11', 'Usefull product', 20.00, 15.00, 5, 2, 0.00, 0, 1, 1, 1, '2025-07-15 21:32:50', '2025-07-15 21:32:50'),
(11, 1, 1, 'Abc 17', 'Usefull product', 20.00, 15.00, 5, 2, 0.00, 0, 1, 1, 1, '2025-07-15 21:37:04', '2025-07-15 21:37:04');

-- --------------------------------------------------------

--
-- Table structure for table `staffingdb_product_categories`
--

CREATE TABLE `staffingdb_product_categories` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL DEFAULT 'default_image.png',
  `status` int(11) NOT NULL DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staffingdb_product_categories`
--

INSERT INTO `staffingdb_product_categories` (`id`, `title`, `image`, `status`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, 'Laptop', 'default_image.png', 1, 1, 1, '2025-07-15 19:17:37', '2025-07-15 19:17:37'),
(2, 'Mobile Phone', 'default_image.png', 1, 1, 1, '2025-07-15 19:17:37', '2025-07-15 19:17:37');

-- --------------------------------------------------------

--
-- Table structure for table `staffingdb_product_highlights`
--

CREATE TABLE `staffingdb_product_highlights` (
  `id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `highlight` text NOT NULL,
  `status` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staffingdb_product_highlights`
--

INSERT INTO `staffingdb_product_highlights` (`id`, `product_id`, `highlight`, `status`) VALUES
(1, 1, '128GB Storage', 1),
(2, 1, 'Fast Charging', 1),
(3, 2, 'Bluetooth 5.2', 1),
(4, 3, 'Smart TV OS', 1),
(5, 9, 'below 30 degree', 1),
(6, 9, 'below 30 degree', 1),
(7, 10, 'below 30 degree', 1),
(8, 10, 'below 30 degree', 1),
(9, 11, 'below 30 degree', 1),
(10, 11, 'below 30 degree', 1);

-- --------------------------------------------------------

--
-- Table structure for table `staffingdb_product_images`
--

CREATE TABLE `staffingdb_product_images` (
  `id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `public_id` varchar(255) NOT NULL,
  `url` text NOT NULL,
  `status` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staffingdb_product_images`
--

INSERT INTO `staffingdb_product_images` (`id`, `product_id`, `public_id`, `url`, `status`) VALUES
(1, 1, 'img_x1_01', 'https://example.com/x1-front.jpg', 1),
(2, 1, 'img_x1_02', 'https://example.com/x1-back.jpg', 1),
(3, 2, 'img_hp_01', 'https://example.com/headphones.jpg', 1),
(4, 3, 'img_tv_01', 'https://example.com/tv-front.jpg', 1),
(5, 9, '7f837b01-1ed6-4bcb-8770-1ad7dfed0149', '1752593561106-u24Odefepw.png', 1),
(6, 9, '7f837b01-1ed6-4bcb-8770-1ad7dfed0149', '1752593561106-u24Odefepw.png', 1),
(7, 10, 'b46f9f5c-01e6-45e0-bdde-902971243a0b', '1752593570820-A5gpupTETq.png', 1),
(8, 10, 'b46f9f5c-01e6-45e0-bdde-902971243a0b', '1752593570820-A5gpupTETq.png', 1),
(9, 11, 'a3aa92a9-ec7c-45ec-85c0-f416d678cbbb', '1752593824174-fHPLdfKNcG.png', 1),
(10, 11, 'a3aa92a9-ec7c-45ec-85c0-f416d678cbbb', '1752593824174-fHPLdfKNcG.png', 1);

-- --------------------------------------------------------

--
-- Table structure for table `staffingdb_product_reviews`
--

CREATE TABLE `staffingdb_product_reviews` (
  `id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `rating` decimal(2,1) NOT NULL,
  `comment` text NOT NULL,
  `status` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staffingdb_product_reviews`
--

INSERT INTO `staffingdb_product_reviews` (`id`, `product_id`, `user_id`, `name`, `rating`, `comment`, `status`) VALUES
(1, 1, 2, 'Alice', 5.0, 'Amazing phone!', 1),
(2, 1, 3, 'Bob', 4.0, 'Battery could be better.', 1),
(3, 2, 2, 'Clara', 4.5, 'Excellent noise cancellation.', 1),
(4, 4, 1, 'David', 5.0, 'Perfect for gaming!', 1);

-- --------------------------------------------------------

--
-- Table structure for table `staffingdb_roles`
--

CREATE TABLE `staffingdb_roles` (
  `id` int(11) NOT NULL,
  `title` varchar(50) NOT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staffingdb_roles`
--

INSERT INTO `staffingdb_roles` (`id`, `title`, `status`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, 'super_admin', 1, 1, 1, '2025-01-03 02:28:55', '2025-01-03 02:28:55');

-- --------------------------------------------------------

--
-- Table structure for table `staffingdb_super_admins`
--

CREATE TABLE `staffingdb_super_admins` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL DEFAULT 'Unknown',
  `email` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `profile_image` varchar(255) NOT NULL DEFAULT 'default_image.png',
  `status` int(11) NOT NULL DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staffingdb_super_admins`
--

INSERT INTO `staffingdb_super_admins` (`id`, `name`, `email`, `address`, `profile_image`, `status`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, 'Admin User', 'adminuser@gmail.com', 'Dhaka', 'default_image.png', 1, 1, 1, '2025-07-15 15:17:37', '2025-07-15 15:17:37');

-- --------------------------------------------------------

--
-- Table structure for table `staffingdb_users`
--

CREATE TABLE `staffingdb_users` (
  `id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL DEFAULT 0,
  `profile_id` int(11) NOT NULL DEFAULT 0,
  `email` varchar(255) DEFAULT NULL,
  `password` text DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT 1 COMMENT '1 =active , 2 = de-active',
  `updated_by` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staffingdb_users`
--

INSERT INTO `staffingdb_users` (`id`, `role_id`, `profile_id`, `email`, `password`, `status`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'adminuser@gmail.com', '$2b$10$REUeKiIvt2ftFOHfn0xuuehM0Rphdm6pQ93xYTYzrf9l0t7kPEc2e', 1, 0, '2025-07-15 14:02:44', '2025-07-15 14:04:32');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `staffingdb_brands`
--
ALTER TABLE `staffingdb_brands`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `staffingdb_products`
--
ALTER TABLE `staffingdb_products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `staffingdb_product_categories`
--
ALTER TABLE `staffingdb_product_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `staffingdb_product_highlights`
--
ALTER TABLE `staffingdb_product_highlights`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `staffingdb_product_images`
--
ALTER TABLE `staffingdb_product_images`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `staffingdb_product_reviews`
--
ALTER TABLE `staffingdb_product_reviews`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `staffingdb_roles`
--
ALTER TABLE `staffingdb_roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `staffingdb_super_admins`
--
ALTER TABLE `staffingdb_super_admins`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `staffingdb_users`
--
ALTER TABLE `staffingdb_users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `staffingdb_brands`
--
ALTER TABLE `staffingdb_brands`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `staffingdb_products`
--
ALTER TABLE `staffingdb_products`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `staffingdb_product_categories`
--
ALTER TABLE `staffingdb_product_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `staffingdb_product_highlights`
--
ALTER TABLE `staffingdb_product_highlights`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `staffingdb_product_images`
--
ALTER TABLE `staffingdb_product_images`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `staffingdb_product_reviews`
--
ALTER TABLE `staffingdb_product_reviews`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `staffingdb_roles`
--
ALTER TABLE `staffingdb_roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `staffingdb_super_admins`
--
ALTER TABLE `staffingdb_super_admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `staffingdb_users`
--
ALTER TABLE `staffingdb_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
