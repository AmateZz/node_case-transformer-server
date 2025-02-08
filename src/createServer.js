/* eslint-disable max-len */
const http = require('http');
const url = require('url');

const { convertToCase } = require('./convertToCase');

function createServer() {
  return http.createServer((req, res) => {
    const parsedUrl = url.URL(req.url, true);
    const textToConvert = parsedUrl.pathname.slise(1);
    const caseType = parsedUrl.query.toCase;

    const errors = [];

    if (!textToConvert) {
      errors.push({
        message:
          'Text to convert is required. Correct request is: "/<TEXT_TO_CONVERT>?toCase=<CASE_NAME>".',
      });
    }

    if (!caseType) {
      errors.push({
        message:
          '"toCase" query param is required. Correct request is: "/<TEXT_TO_CONVERT>?toCase=<CASE_NAME>".',
      });
    }

    if (
      caseType &&
      !['SNAKE', 'KEBAB', 'CAMEL', 'PASCAL', 'UPPER'].includes(caseType)
    ) {
      errors.push({
        message:
          'This case is not supported. Available cases: SNAKE, KEBAB, CAMEL, PASCAL, UPPER.',
      });
    }

    if (errors.length > 0) {
      res.writeHead(400, { 'Content-type': 'application/json' });
      res.end(JSON.stringify({ errors }));

      return;
    }

    const result = convertToCase(caseType, textToConvert);

    res.writeHead(200, { 'Content-Type': 'application/json' });

    res.end(
      JSON.stringify({
        originalCase: result.convertedText,
        targetCase: caseType,
        originText: textToConvert,
        convertedText: result.convertedText,
      }),
    );
  });
}

module.exports = { createServer };
