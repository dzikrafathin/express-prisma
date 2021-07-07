-- CreateTable
CREATE TABLE `Penulis` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191),
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Penulis.email_unique`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Postingan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `judul` VARCHAR(255) NOT NULL,
    `isi` TEXT,
    `published` BOOLEAN NOT NULL DEFAULT false,
    `penulisId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Postingan` ADD FOREIGN KEY (`penulisId`) REFERENCES `Penulis`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
