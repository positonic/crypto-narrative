import axios from 'axios';
//import chalk from 'chalk';
import TelegramBot from 'node-telegram-bot-api';
import testData from './testData.json';

// Define types for the protocol data
type Protocol = {
    category: string;
    name: string;
    tvl: number;
    tvlPrevDay: number;
    tvlPrevWeek: number;
    tvlPrevMonth: number;
};

type Narrative = {
    name: string;
    tvl: number;
};

type Narratives = {
    [category: string]: Narrative[];
};

// API endpoint
const API_URL = "https://defillama-datasets.llama.fi/lite/protocols2?b=2";

// Telegram Bot Configurations
const TELEGRAM_TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN';
const TELEGRAM_CHANNEL_ID = '@YourChannelID';

const bot = new TelegramBot(TELEGRAM_TOKEN); // Constructing the bot

export function analyze_data(data: { protocols: Protocol[] }): Narratives {
    const narratives: Narratives = {};
    data.protocols.forEach(protocol => {
        const { category, name, tvl } = protocol;

        if (!narratives[category]) {
            narratives[category] = [];
        }

        narratives[category].push({ name, tvl });
    });

    // Sort and pick top 10
    for (const category in narratives) {
        narratives[category].sort((a, b) => b.tvl - a.tvl);
        narratives[category] = narratives[category].slice(0, 10);
    }

    return narratives;
}

export function formatNarratives(narratives: Narratives): string {
    let message = '';
    for (const category in narratives) {
        //message += chalk.bold.blue(`Category: ${category}\n`);
        message += `Category: ${category}\n`;
        narratives[category].forEach((protocol, index) => {
            //message += chalk.green(` ${index + 1}. ${protocol.name}: ${protocol.tvl}\n`);
            message += ` ${index + 1}. ${protocol.name}: ${protocol.tvl}\n`;
        });
    }
    return message;
}

async function postToTelegram(message: string) {
    try {
        await bot.sendMessage(TELEGRAM_CHANNEL_ID, message, { parse_mode: 'Markdown' });
        // console.log(chalk.bold.yellow('Message posted to Telegram channel successfully.'));
        console.log('Message posted to Telegram channel successfully.');
    } catch (error) {
        // console.error(chalk.bold.red('Failed to post message to Telegram channel:'), error);
        console.error('Failed to post message to Telegram channel:', error);
    }
}

async function fetch_data(api_url: string): Promise<{ protocols: Protocol[] }> {
    const isTest = process.env.NODE_ENV === 'test'; // Check if the environment is 'test'
    if (isTest) {
        return testData as { protocols: Protocol[] };
    } else {
        const response = await axios.get(api_url); // Fetch data from API in other environments
        return response.data as { protocols: Protocol[] }; 
    }
}

async function main() {
    try {
        const data = await fetch_data(API_URL); // This will now fetch data based on the environment
        const narratives = analyze_data(data);
        const formattedNarratives = formatNarratives(narratives);

        console.log(formattedNarratives);
        await postToTelegram(formattedNarratives);
    } catch (error) {
        console.error("Error:", error);
    }
}

main();
