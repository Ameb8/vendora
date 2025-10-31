import { Container, Row, Col } from "react-bootstrap";
import TenantDropdown from "./TenantDropdown.jsx";
import "./AdminHeader.css";

export default function AdminHeader() {
    return (
        <header className="admin-header bg-dark text-white d-flex align-items-center shadow-sm">
            <Container fluid>
                <Row className="align-items-center">
                    <Col xs="auto">
                        <h6 className="mb-0 ms-3 fw-semibold text-uppercase text-light">
                            Admin Dashboard
                        </h6>
                    </Col>
                    <Col className="d-flex justify-content-end align-items-center me-3">
                        <div className="tenant-selector-wrapper">
                            <TenantDropdown />
                        </div>
                    </Col>
                </Row>
            </Container>
        </header>
    );
}
