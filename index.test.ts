import { analyze_data, formatNarratives } from './index'; // Import functions from your script

// Sample data
const sampleData = {
    protocols: [/* ... Your sample data ... */]
};

describe('DeFi Llama Data Analysis', () => {
    it('should correctly analyze and return top 10 projects per category', () => {
        const result = analyze_data(sampleData);
        console.log(result)
        // Add your assertions here
        // Example: expect(result['Liquid Staking']).toHaveLength(10);
    });

    it('should format narratives for Telegram correctly', () => {
        const narratives = analyze_data(sampleData);
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

describe('Telegram Bot Posting', () => {
    it('should post message to Telegram', async () => {
        const telegramBot = require('node-telegram-bot-api');
        const bot = new telegramBot('dummy-token');
        
        const narratives = analyze_data(sampleData);
        const message = formatNarratives(narratives);

        await bot.sendMessage('dummy-chat-id', message);
        
        expect(bot.sendMessage).toHaveBeenCalled();
        expect(bot.sendMessage).toHaveBeenCalledWith('dummy-chat-id', message);
    });
});
