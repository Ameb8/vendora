import { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { Spinner, Alert } from 'react-bootstrap';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa'; // for arrow icons

export default function OrdersByCategoryPie() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [collapsed, setCollapsed] = useState(true);

    useEffect(() => {
        if (!collapsed && !data && !error) {
            const token = localStorage.getItem('token');

            fetch(`${import.meta.env.VITE_API_URL}/metrics/categories/`, {
                headers: {
                    'Authorization': `Token ${token}`,
                },
            })
                .then((res) => {
                    if (!res.ok) {
                        throw new Error(`HTTP error! Status: ${res.status}`);
                    }
                    return res.json();
                })
                .then(setData)
                .catch((err) => setError(err.message));
        }
    }, [collapsed]);

    return (
        <div className="mb-4 border p-3 rounded">
            <div
                onClick={() => setCollapsed(!collapsed)}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
                <h4 className="mb-0">Purchases by Category</h4>
                {collapsed ? <FaChevronRight /> : <FaChevronDown />}
            </div>

            {!collapsed && (
                <>
                    {error && <Alert variant="danger" className="mt-3">Error: {error}</Alert>}
                    {!data && !error && <Spinner animation="border" className="mt-3" />}
                    {data && (
                        <Plot
                            data={[
                                {
                                    type: 'pie',
                                    labels: data.categories,
                                    values: data.quantities,
                                    textinfo: 'label+percent',
                                    insidetextorientation: 'radial',
                                },
                            ]}
                            layout={{
                                title: 'Purchases by Category',
                                margin: { t: 50, b: 50, l: 50, r: 50 },
                                autosize: true,
                            }}
                            style={{ width: '100%', height: '400px' }}
                            useResizeHandler
                        />
                    )}
                </>
            )}
        </div>
    );
}

/*
import { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { Spinner, Alert } from 'react-bootstrap';
import { formatLabel } from "../utils/plotFormatting.js";

export default function OrdersByCategory() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        fetch(`${import.meta.env.VITE_API_URL}/metrics/categories/`, {
            headers: {
                'Authorization': `Token ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then(setData)
            .catch((err) => setError(err.message));
    }, []);

    if (error) return <Alert variant="danger">Error: {error}</Alert>;
    if (!data) return <Spinner animation="border" />;

    return (
        <Plot
            data={[
                {
                    x: data.categories,
                    y: data.quantities,
                    type: 'bar',
                    marker: { color: 'indianred' },
                    name: 'Products Ordered',
                },
            ]}
            layout={{
                title: 'Products Ordered by Category',
                xaxis: { title: 'Category', tickangle: -45 },
                yaxis: formatLabel('Items Sold'),
                margin: { b: 150 },
                autosize: true,
            }}
            style={{ width: '100%', height: '400px' }}
            useResizeHandler
        />
    );
}
*/