import { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { Dropdown, ButtonGroup, Spinner, Alert } from 'react-bootstrap';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

const granularities = ['daily', 'weekly', 'monthly', 'yearly'];

const tickFormats = {
    daily: '%Y-%m-%d',
    weekly: '%Y-%m-%d',
    monthly: '%b %Y',
    yearly: '%Y'
};

const dtickValues = {
    daily: 86400000,
    weekly: 604800000,
    monthly: 'M1',
    yearly: 'M12'
};

export default function TimeGraph({ url, title, xLabel, yLabel }) {
    const [granularity, setGranularity] = useState('daily');
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [collapsed, setCollapsed] = useState(true);

    const fetchData = async (selectedGranularity) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${url}?granularity=${selectedGranularity}`, {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`,
                }
            });
            if (!response.ok) throw new Error('Failed to fetch data');
            const data = await response.json();
            setChartData({
                x: data.dates,
                y: data.counts
            });
        } catch (err) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!collapsed) {
            fetchData(granularity);
        }
    }, [granularity, url, collapsed]);

    return (
        <div className="mb-4 border p-3 rounded">
            <div
                onClick={() => setCollapsed(!collapsed)}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
                <h4 className="mb-0">{title}</h4>
                {collapsed ? <FaChevronRight /> : <FaChevronDown />}
            </div>

            {!collapsed && (
                <>
                    <Dropdown as={ButtonGroup} className="my-3">
                        <Dropdown.Toggle variant="primary" id="dropdown-basic">
                            View: {granularity.charAt(0).toUpperCase() + granularity.slice(1)}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {granularities.map((option) => (
                                <Dropdown.Item
                                    key={option}
                                    onClick={() => setGranularity(option)}
                                    active={option === granularity}
                                >
                                    {option.charAt(0).toUpperCase() + option.slice(1)}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>

                    {loading && <Spinner animation="border" variant="primary" />}
                    {error && <Alert variant="danger">{error}</Alert>}
                    {chartData && !loading && (
                        <Plot
                            data={[
                                {
                                    x: chartData.x,
                                    y: chartData.y,
                                    type: 'scatter',
                                    mode: 'lines+markers',
                                    marker: { color: '#007bff' },
                                    line: { shape: 'linear' },
                                    name: yLabel
                                }
                            ]}
                            layout={{
                                title: `${title} (${granularity.charAt(0).toUpperCase() + granularity.slice(1)})`,
                                xaxis: {
                                    title: xLabel,
                                    type: 'date',
                                    tickangle: -45,
                                    tickformat: tickFormats[granularity],
                                    dtick: dtickValues[granularity],
                                    range: [
                                        chartData?.x?.[0] || null,
                                        chartData?.x?.[chartData.x.length - 1] || null
                                    ]
                                },
                                yaxis: { title: yLabel },
                                plot_bgcolor: '#fff',
                                paper_bgcolor: '#fff',
                                margin: { t: 50, l: 50, r: 30, b: 80 },
                                font: { family: 'Arial, sans-serif', size: 12 }
                            }}
                            config={{ responsive: true }}
                            style={{ width: '100%', height: '100%' }}
                        />
                    )}
                </>
            )}
        </div>
    );
}
/*
import { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { Dropdown, ButtonGroup, Spinner, Alert } from 'react-bootstrap';

const granularities = ['daily', 'weekly', 'monthly', 'yearly'];

const tickFormats = {
    daily: '%Y-%m-%d',
    weekly: '%Y-%m-%d',
    monthly: '%b %Y',
    yearly: '%Y'
};

const dtickValues = {
    daily: 86400000,
    weekly: 604800000,
    monthly: 'M1',
    yearly: 'M12'
};

export default function TimeGraph({url, title, xLabel, yLabel}) {
    const [granularity, setGranularity] = useState('daily');
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async (selectedGranularity) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${url}?granularity=${selectedGranularity}`, {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`,
                }
            });
            if (!response.ok) throw new Error('Failed to fetch data');
            const data = await response.json();
            setChartData({
                x: data.dates,
                y: data.counts
            });
        } catch (err) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(granularity);
    }, [granularity, url]);

    return (
        <div>
            <h3 className="mb-3">{title}</h3>

            <Dropdown as={ButtonGroup} className="mb-4">
                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                    View: {granularity.charAt(0).toUpperCase() + granularity.slice(1)}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {granularities.map((option) => (
                        <Dropdown.Item
                            key={option}
                            onClick={() => setGranularity(option)}
                            active={option === granularity}
                        >
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>

            {loading && <Spinner animation="border" variant="primary" />}
            {error && <Alert variant="danger">{error}</Alert>}
            {chartData && !loading && (
                <Plot
                    data={[
                        {
                            x: chartData.x,
                            y: chartData.y,
                            type: 'scatter',
                            mode: 'lines+markers',
                            marker: { color: '#007bff' },
                            line: { shape: 'linear' },
                            name: yLabel
                        }
                    ]}
                    layout={{
                        title: `${title} (${granularity.charAt(0).toUpperCase() + granularity.slice(1)})`,
                        xaxis: {
                            title: xLabel,
                            type: 'date',
                            tickangle: -45,
                            tickformat: tickFormats[granularity],
                            dtick: dtickValues[granularity],
                            range: [
                                chartData?.x?.[0] || null,
                                chartData?.x?.[chartData.x.length - 1] || null
                            ]
                        },
                        yaxis: { title: yLabel },
                        plot_bgcolor: '#fff',
                        paper_bgcolor: '#fff',
                        margin: { t: 50, l: 50, r: 30, b: 80 },
                        font: { family: 'Arial, sans-serif', size: 12 }
                    }}
                    config={{ responsive: true }}
                    style={{ width: '100%', height: '100%' }}
                />
            )}
        </div>
    );
}

 */