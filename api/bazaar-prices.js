// Vercel Serverless Function - Fetch Bazaar Prices
// Endpoint: /api/bazaar-prices

export const config = {
    runtime: 'edge',
};

export default async function handler(req) {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return new Response(
            JSON.stringify({ error: 'Method not allowed' }),
            { status: 405, headers: { 'Content-Type': 'application/json' } }
        );
    }

    try {
        // Fetch from Hypixel API
        const response = await fetch('https://api.hypixel.net/skyblock/bazaar', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Hypixel API error: ${response.status}`);
        }

        const data = await response.json();

        // Transform into simpler format
        const prices = {};
        for (const [productId, productData] of Object.entries(data.products || {})) {
            const quickStatus = productData.quick_status || {};
            prices[productId] = {
                buyPrice: quickStatus.buyPrice || 0,
                sellPrice: quickStatus.sellPrice || 0,
                instantBuyVolume: quickStatus.buyMovingWeek || 0,
                instantSellVolume: quickStatus.sellMovingWeek || 0,
            };
        }

        // Return with CORS headers
        return new Response(
            JSON.stringify(prices),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET',
                },
            }
        );

    } catch (error) {
        console.error('Bazaar prices error:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to fetch bazaar prices', details: error.message }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            }
        );
    }
}
