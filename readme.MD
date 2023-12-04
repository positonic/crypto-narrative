# DeFi Llama Category Analyzer

This project is designed to fetch and analyze data from DeFi Llama, specifically focusing on different DeFi categories. It identifies emerging trends and narratives in the DeFi space by analyzing Total Value Locked (TVL) data. The script is scheduled to run daily and sends its insights to a specified Telegram channel using GitHub Actions.

## Features

- Fetching DeFi Llama categories and data using their API. ([Same data used here](https://defillama.com/categories))
- Analyzing TVL data to identify growth trends in various DeFi categories.
- Posting the analysis results daily to a Telegram channel.
- Scheduled script execution using GitHub Actions.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js and npm (or Yarn)
- TypeScript
- A Telegram bot token and a chat ID for posting messages

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
Navigate to the project directory:

```bash
cd defi-llama-category-analyzer
```

Install dependencies:

```bash
npm install
```

or if you're using Yarn:

```bash
yarn install
```

Set up environment variables for the Telegram bot token and chat ID. You can do this in a .env file or directly in your environment.

Usage
To run the script manually:

```bash
npm run start
```

or with Yarn:

```bash
yarn start
```