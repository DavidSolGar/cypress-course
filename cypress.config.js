const { defineConfig } = require("cypress");

module.exports = defineConfig({
  viewportHeight : 1080,
  viewportWidth : 1920, 
  video: false,
  env: {   
    username: 'testdavichin1@gmail.com',
    password: 'testdavichin1',
    apiUrl: 'https://conduit-api.bondaracademy.com'
    
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "https://conduit.bondaracademy.com/",
    specPattern:'cypress/e2e/**/*.spec.js'
    //excludeSpecPattern: '**/examples/*' 
  },
});
