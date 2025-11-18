import React, { useEffect, useState } from 'react';
import API from '../../api/api';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { PeopleFill, ShopWindow, StarFill } from 'react-bootstrap-icons';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/admin/dashboard')
      .then(res => setStats(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const cardData = [
    { title: 'Total Users', value: stats.totalUsers ?? 0, icon: <PeopleFill size={30} />, bg: 'primary' },
    { title: 'Total Stores', value: stats.totalStores ?? 0, icon: <ShopWindow size={30} />, bg: 'success' },
    { title: 'Total Ratings', value: stats.totalRatings ?? 0, icon: <StarFill size={30} />, bg: 'warning' },
  ];

  return (
    <Container className="mt-4">
      <Row className="g-4">
        {loading ? (
          <Col className="text-center py-5">
            <Spinner animation="border" variant="primary" />
          </Col>
        ) : (
          cardData.map((card, idx) => (
            <Col key={idx} md={4}>
              <Card className={`text-white bg-${card.bg} shadow-sm`}>
                <Card.Body className="d-flex align-items-center justify-content-between">
                  <div>
                    <h5>{card.title}</h5>
                    <h3>{card.value}</h3>
                  </div>
                  <div>{card.icon}</div>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default AdminDashboard;
