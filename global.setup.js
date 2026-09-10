const { setCredentials } = require('@evinced/js-playwright-sdk');

async function globalSetup() {
  try {
    await setCredentials({
      serviceId: '922eff48-df42-cd03-0d83-8f1b7efc2f5a',
      secret: 'dLLkcxp0gVlh90XICsmLQs3Zo6Pp4Oz7',
    });
  } catch (error) {
    throw new Error('Evinced SDK authorization failure: ' + error.message);
  }
}

module.exports = globalSetup;
