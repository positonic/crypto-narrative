import axios from 'axios';

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

    return narratives;
}

async function main() {
    try {
        const data = await fetch_data(API_URL);
        const narratives = analyze_data(data);

        // Print results
        for (const category in narratives) {
            console.log(`Category: ${category}`);
            narratives[category].forEach(protocol => {
                console.log(` - ${protocol.name}: Daily Growth: ${protocol.daily_growth}, Weekly Growth: ${protocol.weekly_growth}, Monthly Growth: ${protocol.monthly_growth}`);
            });
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

main();
