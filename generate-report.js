const fs = require('fs');
const path = require('path');

/**
 * Generate a detailed test execution summary report
 */
function generateReport() {
    const jsonReportDir = path.join(__dirname, 'reports', 'json');
    const outputFile = path.join(__dirname, 'reports', 'test-summary.txt');

    try {
        // Check if reports directory exists
        if (!fs.existsSync(jsonReportDir)) {
            console.log('❌ No test reports found. Please run tests first using: npm test');
            return;
        }

        // Get all JSON report files
        const files = fs.readdirSync(jsonReportDir).filter(file => file.endsWith('.json'));
        
        if (files.length === 0) {
            console.log('❌ No JSON report files found. Please run tests first using: npm test');
            return;
        }

        // Get the most recent report file
        const latestFile = files
            .map(file => ({
                name: file,
                time: fs.statSync(path.join(jsonReportDir, file)).mtime.getTime()
            }))
            .sort((a, b) => b.time - a.time)[0].name;

        console.log(`\n📊 Generating report from: ${latestFile}\n`);

        // Read and parse the JSON report
        const reportData = JSON.parse(fs.readFileSync(path.join(jsonReportDir, latestFile), 'utf8'));

        let totalTests = 0;
        let passedTests = 0;
        let failedTests = 0;
        let skippedTests = 0;
        const failureDetails = [];
        const testDetails = [];

        // Process each suite
        if (reportData.suites) {
            reportData.suites.forEach(suite => {
                processSuite(suite, failureDetails, testDetails);
            });
        }

        // Calculate statistics
        totalTests = testDetails.length;
        passedTests = testDetails.filter(t => t.state === 'passed').length;
        failedTests = testDetails.filter(t => t.state === 'failed').length;
        skippedTests = testDetails.filter(t => t.state === 'skipped').length;

        // Generate report content
        const reportContent = generateReportContent(
            totalTests,
            passedTests,
            failedTests,
            skippedTests,
            testDetails,
            failureDetails,
            reportData
        );

        // Ensure reports directory exists
        const reportsDir = path.join(__dirname, 'reports');
        if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir, { recursive: true });
        }

        // Write report to file
        fs.writeFileSync(outputFile, reportContent, 'utf8');

        // Print summary to console
        console.log('═'.repeat(70));
        console.log('                    TEST EXECUTION SUMMARY');
        console.log('═'.repeat(70));
        console.log(`\n📝 Total Tests:       ${totalTests}`);
        console.log(`✅ Passed Tests:      ${passedTests} (${totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(2) : 0}%)`);
        console.log(`❌ Failed Tests:      ${failedTests} (${totalTests > 0 ? ((failedTests / totalTests) * 100).toFixed(2) : 0}%)`);
        if (skippedTests > 0) {
            console.log(`⏭️  Skipped Tests:     ${skippedTests}`);
        }
        console.log(`\n⏱️  Execution Time:    ${formatDuration(reportData.duration || 0)}`);
        console.log('═'.repeat(70));

        if (failedTests > 0) {
            console.log('\n❌ FAILED TESTS:\n');
            failureDetails.forEach((failure, index) => {
                console.log(`${index + 1}. ${failure.title}`);
                console.log(`   Suite: ${failure.suite}`);
                console.log(`   Error: ${failure.error.split('\n')[0]}`);
                console.log('');
            });
        }

        console.log(`\n📄 Detailed report saved to: ${outputFile}`);
        console.log(`🌐 HTML report available at: reports/html-report/report.html`);
        console.log(`\n💡 To open HTML report, run: npm run report:open\n`);

    } catch (error) {
        console.error('❌ Error generating report:', error.message);
        console.error('Stack trace:', error.stack);
    }
}

/**
 * Process a test suite recursively
 */
function processSuite(suite, failureDetails, testDetails) {
    if (suite.tests) {
        suite.tests.forEach(test => {
            testDetails.push({
                title: test.title,
                suite: suite.title,
                state: test.state,
                duration: test.duration
            });

            if (test.state === 'failed') {
                failureDetails.push({
                    title: test.title,
                    suite: suite.title,
                    error: test.error ? (test.error.message || test.error.toString()) : 'Unknown error',
                    stack: test.error ? test.error.stack : ''
                });
            }
        });
    }

    // Process nested suites
    if (suite.suites) {
        suite.suites.forEach(nestedSuite => {
            processSuite(nestedSuite, failureDetails, testDetails);
        });
    }
}

/**
 * Generate the full report content
 */
function generateReportContent(totalTests, passedTests, failedTests, skippedTests, testDetails, failureDetails, reportData) {
    const timestamp = new Date().toLocaleString();
    let content = '';

    content += '═'.repeat(80) + '\n';
    content += '                         TEST EXECUTION REPORT\n';
    content += '═'.repeat(80) + '\n\n';
    content += `Generated: ${timestamp}\n\n`;

    // Summary Statistics
    content += '─'.repeat(80) + '\n';
    content += 'SUMMARY STATISTICS\n';
    content += '─'.repeat(80) + '\n';
    content += `Total Tests:          ${totalTests}\n`;
    content += `Passed Tests:         ${passedTests} (${totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(2) : 0}%)\n`;
    content += `Failed Tests:         ${failedTests} (${totalTests > 0 ? ((failedTests / totalTests) * 100).toFixed(2) : 0}%)\n`;
    if (skippedTests > 0) {
        content += `Skipped Tests:        ${skippedTests}\n`;
    }
    content += `\nExecution Time:       ${formatDuration(reportData.duration || 0)}\n`;
    content += `Status:               ${failedTests === 0 ? 'PASSED ✓' : 'FAILED ✗'}\n`;
    content += '\n';

    // Test Details
    content += '─'.repeat(80) + '\n';
    content += 'TEST DETAILS\n';
    content += '─'.repeat(80) + '\n\n';

    testDetails.forEach((test, index) => {
        const status = test.state === 'passed' ? '✓ PASS' : 
                      test.state === 'failed' ? '✗ FAIL' : 
                      '⊘ SKIP';
        content += `${index + 1}. [${status}] ${test.title}\n`;
        content += `   Suite: ${test.suite}\n`;
        content += `   Duration: ${formatDuration(test.duration)}\n\n`;
    });

    // Failure Details
    if (failureDetails.length > 0) {
        content += '─'.repeat(80) + '\n';
        content += 'DETAILED FAILURE MESSAGES\n';
        content += '─'.repeat(80) + '\n\n';

        failureDetails.forEach((failure, index) => {
            content += `${index + 1}. ${failure.title}\n`;
            content += `   Suite: ${failure.suite}\n`;
            content += `   Error: ${failure.error}\n`;
            if (failure.stack) {
                content += `   Stack Trace:\n`;
                content += `   ${failure.stack.split('\n').join('\n   ')}\n`;
            }
            content += '\n' + '─'.repeat(80) + '\n\n';
        });
    }

    content += '═'.repeat(80) + '\n';
    content += 'END OF REPORT\n';
    content += '═'.repeat(80) + '\n';

    return content;
}

/**
 * Format duration in milliseconds to readable format
 */
function formatDuration(ms) {
    if (ms < 1000) {
        return `${ms}ms`;
    } else if (ms < 60000) {
        return `${(ms / 1000).toFixed(2)}s`;
    } else {
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(2);
        return `${minutes}m ${seconds}s`;
    }
}

// Run the report generation
generateReport();
