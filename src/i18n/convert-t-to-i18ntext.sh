
#!/bin/bash

# Script to help convert t() calls to <I18nText> components
# Usage: ./convert-t-to-i18ntext.sh path/to/file.tsx

FILE_PATH=$1

if [ -z "$FILE_PATH" ]; then
  echo "Please provide a file path."
  echo "Usage: ./convert-t-to-i18ntext.sh path/to/file.tsx"
  exit 1
fi

if [ ! -f "$FILE_PATH" ]; then
  echo "File not found: $FILE_PATH"
  exit 1
fi

# Check if file imports I18nText already
if ! grep -q "import { I18nText } from '@/components/ui/i18n-text'" "$FILE_PATH"; then
  # Add import after the last import statement
  LAST_IMPORT_LINE=$(grep -n "^import " "$FILE_PATH" | tail -1 | cut -d: -f1)
  
  if [ -n "$LAST_IMPORT_LINE" ]; then
    sed -i "${LAST_IMPORT_LINE}a\\import { I18nText } from '@/components/ui/i18n-text';" "$FILE_PATH"
    echo "✓ Added I18nText import to $FILE_PATH"
  else
    sed -i "1i\\import { I18nText } from '@/components/ui/i18n-text';" "$FILE_PATH"
    echo "✓ Added I18nText import at the beginning of $FILE_PATH"
  fi
fi

# Find and replace t() calls with I18nText components
# This is a simple replacement and may need manual review
sed -i "s/{t('\([^']*\)')}/<I18nText translationKey=\"\1\" \/>/g" "$FILE_PATH"
sed -i "s/{t(\"\([^\"]*\)\")}/<I18nText translationKey=\"\1\" \/>/g" "$FILE_PATH"

# Handle t() calls with parameters - this is more complex and may need manual adjustment
echo "✓ Basic t() replacements completed in $FILE_PATH"
echo "⚠ Please manually review any complex t() calls with parameters!"
echo "Done processing $FILE_PATH"

