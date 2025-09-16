export function fmtUSD(cents) {
    const numericCents = Number(cents);

    if (isNaN(numericCents)) return '$0.00';

    const dollars = numericCents / 100;

    return dollars.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
    });
}