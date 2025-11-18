import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { EnvelopeFill } from "react-bootstrap-icons";

const Footer = () => {
    return (
        <footer
            style={{
                background: "#222",
                color: "#ddd",
                padding: "15px 0",
                marginTop: "40px",
                fontSize: "14px",
            }}
        >
            <Container>
                <Row className="text-center text-md-start align-items-center">


                    <Col md={4} className="mb-2 mb-md-0">
                        © {new Date().getFullYear()} All Rights Reserved.
                    </Col>


                    <Col
                        md={4}
                        className="text-center mb-2 mb-md-0"
                        style={{ fontWeight: 500 }}
                    >
                        Made with ❤️ by <span style={{ fontWeight: "bold", color: "#fff" }}>Shreyash</span>
                    </Col>


                    <Col
                        md={4}
                        className="text-md-end d-flex justify-content-center justify-content-md-end align-items-center"
                    >
                        <EnvelopeFill size={16} className="me-2" />
                        shreyashkoli2301@gmail.com
                    </Col>

                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
