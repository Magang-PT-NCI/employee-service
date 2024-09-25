-- CreateTable
CREATE TABLE `Employee` (
    `nik` VARCHAR(20) NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `area` VARCHAR(50) NOT NULL,
    `role` VARCHAR(50) NOT NULL,
    `position` ENUM('OnSite', 'Koordinator') NOT NULL DEFAULT 'OnSite',
    `profile_photo` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`nik`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
