# Kotal

## Introduction

Kotal is a NextJS application designed to .... It offers ....

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (version 21.1 or above)
- npm or yarn

## Getting Started

Follow these steps to get your copy of the project up and running on your local machine for development and testing purposes.

### Cloning the Repository

To clone the repository, run the following command in your terminal:

```bash
git clone git@github.com:kotalco/dashboard.git kotalco
```

### Installing Dependencies

Navigate to the cloned directory and install the necessary dependencies:

```bash
cd kotalco
npm install # or yarn install
```

### Setting Up Environment Variables

Your application requires certain environment variables to run properly. Create a **_'.env.local'_** file in the root of your project and add the necessary variables. These are the variables you need to provide

```bash
NEXT_PUBLIC_BASE_URL
BASE_URL
NEXT_PUBLIC_API_URL
NEXT_PUBLIC_WS_API_URL
API_URL
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
NEXT_PUBLIC_RETURN_URL_ROOT
```

**Note:** Do not commit your **_'.env.local'_** file to the repository. It's recommended to add **_'.env.local'_** to your **_'.gitignore'_** file.

### Running the Application

#### Development

To run the application in development mode, use the following command:

```bash
npm run dev # or yarn dev
```

This will start the development server on **_http://localhost:3000_**. Open this URL in your browser to view the application.

#### Production

To run the application in production mode, you need to build the application first and then start it:

```bash
npm run build # or yarn build
npm start # or yarn start
```

This will compile the application into an optimized production build and start the server.
