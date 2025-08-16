import { Container, Card } from 'react-bootstrap';
import TimeGraph from '../charts/TimeGraph';
import OrdersByCategory from '../charts/OrdersByCategory';

export default function MetricsDashboard() {
    return (
        <Container className="my-4">
            <Card className="mb-4">
                <Card.Body>
                    <TimeGraph
                        url={`${import.meta.env.VITE_API_URL}/metrics/orders`}
                        title="Orders Over Time"
                        xLabel="Date"
                        yLabel="Number of Orders"
                    />
                </Card.Body>
            </Card>
            <Card className="mb-4">
                <Card.Body>
                    <TimeGraph
                        url={`${import.meta.env.VITE_API_URL}/metrics/revenue`}
                        title="Revenue Over Time"
                        xLabel="Date"
                        yLabel="Revenue"
                    />
                </Card.Body>
            </Card>
            <Card className="mb-4">
                <Card.Body>
                    <OrdersByCategory />
                </Card.Body>
            </Card>
        </Container>
    );
}

