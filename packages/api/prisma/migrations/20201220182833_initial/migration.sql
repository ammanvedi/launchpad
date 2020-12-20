-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'DESIGNER', 'MANUFACTURER', 'DESIGNER_MANUFACTURER', 'PARTNER');

-- CreateEnum
CREATE TYPE "ConsentType" AS ENUM ('TERMS_OF_USE', 'PRIVACY_POLICY', 'COOKIES', 'TRACKING', 'ANALYTICS');

-- CreateTable
CREATE TABLE "Consent" (
"id" SERIAL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "consentedTo" "ConsentType" NOT NULL,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("userId","consentedTo")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "externalId" TEXT NOT NULL DEFAULT E'',
    "firstName" TEXT,
    "lastName" TEXT,
    "profileImage" TEXT,
    "bio" TEXT,
    "role" "Role" NOT NULL DEFAULT E'USER',

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Consent" ADD FOREIGN KEY("userId")REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
