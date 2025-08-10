import { useState } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import OrderDetails from './OrderDetails';
import OrderAddress from './OrderAddress';

function ViewOrder() {
    const [codeInput, setCodeInput] = useState('');
    const [submittedCode, setSubmittedCode] = useState(null);
    const [viewingAddress, setViewingAddress] = useState(false);
    const [orderId, setOrderId] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (codeInput.trim() !== '') {
            setSubmittedCode(codeInput.trim());
        }
    };

    const resetView = () => {
        setSubmittedCode(null);
        setCodeInput('');
        setViewingAddress(false);
        setOrderId(null);
    };

    const handleShowAddress = (orderId) => {
        setOrderId(orderId);
        setViewingAddress(true);
    };

    return (
        <Container className="my-5">
            {!submittedCode ? (
                <Card className="p-4 shadow-sm">
                    <Form onSubmit={handleSubmit}>
                        <h4 className="mb-3 text-center">Enter Order Code</h4>
                        <Form.Group controlId="orderCodeInput">
                            <Form.Control
                                type="text"
                                placeholder="e.g. 01f2fcc4-8eee-41c8-b8c8-58f5765acb6e"
                                value={codeInput}
                                onChange={(e) => setCodeInput(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100 mt-3">
                            View Order
                        </Button>
                    </Form>
                </Card>
            ) : (
                <>
                    <div className="text-end mb-2">
                        <Button variant="outline-secondary" size="sm" onClick={resetView}>
                            &larr; Back to Order Code Entry
                        </Button>
                    </div>
                    {viewingAddress ? (
                        <>
                            <div className="text-end mb-2">
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() => setViewingAddress(false)}
                                >
                                    &larr; Back to Order Details
                                </Button>
                            </div>
                            <OrderAddress orderId={orderId} />
                        </>
                    ) : (
                        <OrderDetails
                            orderCode={submittedCode}
                            onShowAddress={handleShowAddress}
                        />
                    )}
                </>
            )}
        </Container>
    );
}


export default ViewOrder;
