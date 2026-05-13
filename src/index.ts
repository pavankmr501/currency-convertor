import { getRate } from './currencies';

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function handleConvert(url: URL): Response {
  const amountParam = url.searchParams.get('amount');
  const fromParam = url.searchParams.get('from');
  const toParam = url.searchParams.get('to');

  if (amountParam === null) {
    return jsonResponse({ error: 'Missing required parameter: amount' }, 400);
  }
  if (fromParam === null) {
    return jsonResponse({ error: 'Missing required parameter: from' }, 400);
  }
  if (toParam === null) {
    return jsonResponse({ error: 'Missing required parameter: to' }, 400);
  }

  const amount = Number(amountParam);
  if (!isFinite(amount)) {
    return jsonResponse({ error: 'Invalid amount: must be a numeric value' }, 400);
  }

  const from = fromParam.toUpperCase();
  const to = toParam.toUpperCase();

  if (from !== 'USD' && to !== 'USD') {
    return jsonResponse(
      { error: "Cross-currency conversion not supported. One of 'from' or 'to' must be USD" },
      400
    );
  }

  // Determine which non-USD code (if any) needs a rate lookup
  const nonUsdCode = from === 'USD' ? to : from;
  const csvRate = getRate(nonUsdCode); // units of nonUsdCode per 1 USD

  if (csvRate === null) {
    return jsonResponse({ error: `Unknown currency code: ${nonUsdCode}` }, 400);
  }

  // csvRate = units of nonUsdCode per 1 USD
  let result: number;
  let rate: number;

  if (from === 'USD') {
    // USD → to: multiply by rate
    result = amount * csvRate;
    rate = csvRate;
  } else {
    // from → USD: divide by rate
    result = amount / csvRate;
    rate = 1 / csvRate;
  }

  return jsonResponse({ from, to, amount, result, rate });
}

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === 'GET' && url.pathname === '/convert') {
      return handleConvert(url);
    }

    if (request.method === 'GET' && url.pathname === '/') {
      return jsonResponse({ message: 'Hello World!' });
    }

    return new Response('Not Found', { status: 404 });
  },
};
