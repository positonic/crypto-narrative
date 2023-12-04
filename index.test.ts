require('dotenv').config({ path: '.env.test' });
import { analyze_data, formatNarratives } from './index'; // Import functions from your script

import testData from './testData.json';

describe('DeFi Llama Data Analysis', () => {
    it('should correctly analyze and return top 10 projects per category', () => {
        const result = analyze_data(testData);
        console.log(result)
        // Add your assertions here
        // Example: expect(result['Liquid Staking']).toHaveLength(10);
    });

    it('should format narratives for Telegram correctly', () => {
        const narratives = analyze_data(testData);
        const message = formatNarratives(narratives);
        console.log(message)
        // Add your assertions here
        // Example: expect(message).toContain('Category: Liquid Staking');
    });
});

// Mocking the Telegram Bot
jest.mock('node-telegram-bot-api', () => {
    return jest.fn().mockImplementation(() => {
        return { sendMessage: jest.fn() };
    });
});

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHANNEL_ID = process.env.TELEGRAM_CHAT_ID;

describe('Telegram Bot Posting', () => {
    it('should post message to Telegram', async () => {
        const telegramBot = require('node-telegram-bot-api');
        const bot = new telegramBot(TELEGRAM_TOKEN);

        const narratives = analyze_data(testData);
        const message = formatNarratives(narratives);

        try {
            await bot.sendMessage(TELEGRAM_CHANNEL_ID, message);
        } catch (error) {
            console.error('Failed to post message to Telegram channel:', error);
        }
        expect(bot.sendMessage).toHaveBeenCalled();
        expect(bot.sendMessage).toHaveBeenCalledWith(TELEGRAM_CHANNEL_ID, message);
    });
});
