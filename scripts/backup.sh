#!/bin/bash

# Database backup script

BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/studentmentor_$TIMESTAMP.archive"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Get MongoDB connection string from environment
MONGO_URI="${MONGODB_URI:-mongodb://admin:password@localhost:27017/StudentMentorDB}"

echo "📦 Starting backup..."

# Use mongodump to backup
mongodump --uri="$MONGO_URI" --archive="$BACKUP_FILE" --gzip

if [ $? -eq 0 ]; then
  echo "✓ Backup successful: $BACKUP_FILE"
  echo "✓ Size: $(du -h $BACKUP_FILE | cut -f1)"
else
  echo "✗ Backup failed!"
  exit 1
fi
