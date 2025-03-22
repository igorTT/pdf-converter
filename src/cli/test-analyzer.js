#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * This tool analyzes test files to ensure they follow the project's testing guidelines.
 * It checks for:
 * - Proper describe/it structure
 * - AAA pattern usage (Arrange, Act, Assert)
 * - Descriptive test names
 * - Test coverage indicators
 */

const filePath = process.argv[2];

if (!filePath) {
  console.error('Please provide a test file path');
  process.exit(1);
}

if (!fs.existsSync(filePath)) {
  console.error(`File not found: ${filePath}`);
  process.exit(1);
}

const fileContent = fs.readFileSync(filePath, 'utf8');

// Check for proper describe/it structure
const hasProperStructure =
  /describe\(.*,\s*\(\)\s*=>\s*\{[\s\S]*it\(.*,\s*\(\)\s*=>\s*\{[\s\S]*\}\);[\s\S]*\}\);/g.test(
    fileContent
  );

// Check for AAA pattern
const hasAAAPattern =
  /\/\/\s*Arrange[\s\S]*\/\/\s*Act[\s\S]*\/\/\s*Assert/g.test(fileContent) ||
  /(arrange|act|assert)/gi.test(fileContent) ||
  /expect\(/g.test(fileContent);

// Check for descriptive test names
const testNames = fileContent.match(/it\(['"`](.*?)['"`]/g) || [];
const hasDescriptiveNames = testNames.every((name) => name.length > 15); // Simple heuristic

// Check for mocking usage
const hasMocks =
  /jest\.mock\(/g.test(fileContent) || /mock/gi.test(fileContent);

// Check for coverage of edge cases
const hasEdgeCases = /edge case|error|exception|fail/gi.test(fileContent);

// Count the number of test cases
const testCount = (fileContent.match(/it\(/g) || []).length;

// Results
console.log(`\n📊 Test Analysis: ${path.basename(filePath)}`);
console.log('==================================================');
console.log(`Test structure:        ${hasProperStructure ? '✅' : '❌'}`);
console.log(`AAA pattern:           ${hasAAAPattern ? '✅' : '❌'}`);
console.log(`Descriptive names:     ${hasDescriptiveNames ? '✅' : '❌'}`);
console.log(`Mocking:               ${hasMocks ? '✅' : '❌'}`);
console.log(`Edge cases:            ${hasEdgeCases ? '✅' : '❌'}`);
console.log(`Number of tests:       ${testCount}`);
console.log('--------------------------------------------------');

// The component or module being tested
const testedModule = fileContent.match(/import.*from ['"](.*)['"]/) || [];
if (testedModule.length > 1) {
  console.log(`Testing component:     ${path.basename(testedModule[1])}`);
}

if (
  !hasProperStructure ||
  !hasAAAPattern ||
  !hasDescriptiveNames ||
  !hasMocks ||
  !hasEdgeCases
) {
  console.log('\n🛠 Recommendations:');
  if (!hasProperStructure) {
    console.log('- Ensure tests use proper describe/it structure');
    console.log(
      '  Example: describe("Component", () => { it("should...", () => { ... }); });'
    );
  }
  if (!hasAAAPattern) {
    console.log('- Follow the Arrange-Act-Assert pattern');
    console.log('  Use comments or structure to indicate each phase');
  }
  if (!hasDescriptiveNames) {
    console.log(
      '- Use descriptive test names that explain what is being tested'
    );
    console.log(
      '  Bad: "should work", Good: "should return correct data when given valid input"'
    );
  }
  if (!hasMocks) {
    console.log(
      '- Consider using mocks for dependencies to isolate the component under test'
    );
  }
  if (!hasEdgeCases) {
    console.log(
      '- Add tests for edge cases, error handling, and failure scenarios'
    );
  }
  if (testCount < 3) {
    console.log('- Consider adding more test cases to increase coverage');
  }
}

console.log('==================================================\n');
