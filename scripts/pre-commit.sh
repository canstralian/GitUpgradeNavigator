
#!/bin/bash

echo "Running pre-commit checks..."

# Run TypeScript type checking
echo "🔍 Type checking..."
npm run check
if [ $? -ne 0 ]; then
  echo "❌ TypeScript type checking failed"
  exit 1
fi

# Run tests
echo "🧪 Running tests..."
npm run test:ci
if [ $? -ne 0 ]; then
  echo "❌ Tests failed"
  exit 1
fi

echo "✅ All checks passed!"
