const { defineConfig } = require("cypress");
module.exports = defineConfig({

//import { defineConfig } from 'cypress'
//export default defineConfig({

  viewportHeight: 1080,
  viewportWidth: 1920,
  video: false,
  env: {
    username: '',
    password: '',
    apiUrl: 'https://conduit-api.bondaracademy.com'
  },
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      const username = process.env.DB_USERNAME
      const password = process.env.PASSWORD

        // if(!password){
        //   throw new Error(`Missing PASSWORD environment variable`)
        // }
      config.env = {username, password}
      return config

    },
    baseUrl: "https://conduit.bondaracademy.com/",
    specPattern: 'cypress/e2e/**/*.spec.{js,jsx,ts,tsx}'
    //excludeSpecPattern: '**/examples/*' 
  },
});
