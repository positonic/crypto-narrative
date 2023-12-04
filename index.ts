import axios from 'axios';
import chalk from 'chalk';
import TelegramBot from 'node-telegram-bot-api';

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
    daily_growth: number;
    weekly_growth: number;
    monthly_growth: number;
};

type Narratives = {
    [category: string]: Narrative[];
};

// API endpoint
const API_URL = "https://defillama-datasets.llama.fi/lite/protocols2?b=2";

// Telegram Bot setup (replace with your actual bot token and chat ID)
const TELEGRAM_BOT_TOKEN = 'YOUR_BOT_TOKEN';
const TELEGRAM_CHAT_ID = 'YOUR_CHAT_ID';
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN);

async function fetch_data(api_url: string): Promise<{ protocols: Protocol[] }> {
    const response = await axios.get(api_url);
    return response.data;
}

function analyze_data(data: { protocols: Protocol[] }): Narratives {
    const narratives: Narratives = {};
    data.protocols.forEach(protocol => {
        const { category, name, tvl, tvlPrevDay, tvlPrevWeek, tvlPrevMonth } = protocol;

        // Calculate growth rates
        const daily_growth = tvlPrevDay ? (tvl - tvlPrevDay) / tvlPrevDay : 0;
        const weekly_growth = tvlPrevWeek ? (tvl - tvlPrevWeek) / tvlPrevWeek : 0;
        const monthly_growth = tvlPrevMonth ? (tvl - tvlPrevMonth) / tvlPrevMonth : 0;

        if (!narratives[category]) {
            narratives[category] = [];
        }

        narratives[category].push({
            name,
            daily_growth,
            weekly_growth,
            monthly_growth
        });
    });

    // Sort and get top 10 projects in each category
    for (const category in narratives) {
        narratives[category].sort((a, b) => b.daily_growth - a.daily_growth);
        narratives[category] = narratives[category].slice(0, 10);
    }

    return narratives;
}

function formatNarrativesForTelegram(narratives: Narratives): string {
    let message = '';
    for (const category in narratives) {
        message += `*Category: ${category}*\n`;
        narratives[category].forEach(protocol => {
            message += ` - ${protocol.name}: Daily Growth: ${protocol.daily_growth.toFixed(2)}, Weekly Growth: ${protocol.weekly_growth.toFixed(2)}, Monthly Growth: ${protocol.monthly_growth.toFixed(2)}\n`;
        });
        message += '\n';
    }
    return message;
}

async function postToTelegram(message: string) {
    await bot.sendMessage(TELEGRAM_CHAT_ID, message, { parse_mode: 'Markdown' });
}

async function main() {
    try {
        const data = await fetch_data(API_URL);
        const narratives = analyze_data(data);

        // Print results with colors
        for (const category in narratives) {
            console.log(chalk.blue(`Category: ${category}`));
            narratives[category].forEach(protocol => {
                console.log(chalk.green(` - ${protocol.name}:`), `Daily Growth: ${protocol.daily_growth.toFixed(2)}, Weekly Growth: ${protocol.weekly_growth.toFixed(2)}, Monthly Growth: ${protocol.monthly_growth.toFixed(2)}`);
            });
        }

        // Format and send message to Telegram
        const telegramMessage = formatNarrativesForTelegram(narratives);
        await postToTelegram(telegramMessage);
        console.log(chalk.yellow('Results posted to Telegram
