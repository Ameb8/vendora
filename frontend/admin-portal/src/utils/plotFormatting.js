export function formatLabel(label) {
    return {
        title: {
            text: label,
            font: {
                family: 'Arial, sans-serif',
                size: 14,
                color: 'black',
            },
            standoff: 10,
        },
        showticklabels: true,
        ticks: 'outside',
    };
}
