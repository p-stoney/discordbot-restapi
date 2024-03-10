## Discord Bot for Celebrating Accomplishments

### Overview

This Discord bot is designed to congratulate students on completion of their academic models within a specific channel on the Turing College Discord server. It integrates with the GIPHY API to include celebratory GIFs with each congratulatory message. This is accomplished through the implementation of a REST API which wraps a database containing data on to students and sprints. The bot automatically sends a message containing the student's username, the specific sprint completed, and the GIPHY GIF upon receipt of a JSON package request from a Turing College server. 

Built on a backbone of TypeScript and Express.js, this application employs an architecture comprising controllers, services, and repositories to facilitate a clear separation of concerns. Test-Driven development was utilized to provide a well-tested codebase, and dependency injection has been heavily incorporated to enhance modularity and ease of testing. The overall strategy includes unit and integration tests, factories for test data generation, and an in-memory test database to ensure good testing practies.

### Supported Endpoints

Where (module) is any one of messages, sprints, templates, or users.

- `GET /(module)` : Retrieve a list of all (module). Supports pagination through query parameters `limit` and `offset`.
- `POST /(module)` : Create a new (module) in the database. Expects a JSON payload with (module) details.
- `GET /(module)/:id` : Retrieve a specific (module) by its ID.
- `PATCH /(module)/:id` : Update a specific (module) by its ID. Expects a JSON payload with the updated (module) details.
- `DELETE /(module)/:id`: Delete a specific (module) by its ID.
- `POST /messages/send` : Send a congratulatory message to a Discord user. Expects a JSON payload with `username`, `code`.

### Technologies

**discord.js**: A library that enables interaction with the Discord API. Utilized to create the bot, send messages to Discord channels, and handle events within the Discord server. Abstracts away the complexity ofthe Discord API, providing an accessible interface for bot development.

**Kysely**: A type-safe SQL query builder for TypeScript. Used to safely interact with the SQLite database, ensuring that all queries are type-checked against the database schema. Further enhances development experience by providing auto-completion and preventing runtime SQL errors.

**Zod**: A TypeScript-first schema declaration and validation library. Employed to enforce data integrity throughout the application by validating incoming requests against predefined schemas. Helps catch errors early in the development process and ensures that only valid data is processed by the bot.

**Custom Middleware**: `jsonRoute` wraps controller actions, ensuring a consistent API response format and centralized error handling. `jsonErrors` captures and formats error responses, providing meaningful feedback to the client. `auditLog` logs request details, including execution time, aiding in monitoring and debugging the application.

### Setup and Installation

1. Ensure Node.js is installed, and you have both a Discord bot token ([Discord.js Guide](https://discordjs.guide/#before-you-begin "Discord.js Guide")) and GIPHY API key ([GIPHY API Guide](https://developers.giphy.com/docs/api/#quick-start-guide)).

2. Clone the repository to your local machine with `git clone https://github.com/TuringCollegeSubmissions/pstone-FE.4/` .

3. Navigate to the project directory and install dependencies with `npm install` .

4. Copy the `.env.example` file to a new file named `.env` and fill in your environment variables.

5. Run the database migrations to set up your local database structure with `npm run migrate:latest` .

### Running the Application

1. To start the application in development mode with live reloading: `npm run dev` .

2. To start the application normally: `npm run start` .

3. To revert the last database migration: `npm run migrate:revert` .

4. To generate TypeScript types for the database schema: `npm run gen:types` .

5. To run tests using Vitest: `npm run test` .

### Interacting with the Bot

Before running the application, ensure you've set up your .env file correctly, especially the CHANNEL_ID environment variable, which should match the ID of the Discord channel where messages will be posted. After starting the application, you can test the bot's functionality by sending a POST request to http://localhost:3000/messages/send. This request should mimic the payload expected by the bot to trigger a congratulatory message in the designated Discord channel. For testing, you can use tools like Thunder Client, Postman, or any other API testing tool that allows you to make HTTP requests easily.

**Example Request**

```
    URL: http://localhost:3000/messages/send
    Method: POST
    Headers: Content-Type: application/json
    Body:
          {
            "username": "student_username",
            "code": "sprint_code"
          }
```

Replace "student_username" with the Discord username of the user to congratulate, and "sprint_code" with the code of the sprint they've completed. Once the request is sent, check the Discord channel specified by your CHANNEL_ID environment variable to see the bot posting the congratulatory message along with a random celebration GIF.

