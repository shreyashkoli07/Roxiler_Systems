import React, { useEffect, useState } from 'react';
import { getStores } from '../../api/stores';
import StoreCard from './StoreCard';
import { Container, Row, Col, Form } from 'react-bootstrap';

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [q, setQ] = useState('');

  const fetch = async () => {
    const res = await getStores({ q, limit: 50 });
    setStores(res.data.stores);
  };

  useEffect(() => { fetch(); }, [q]);

  return (
    <Container className="mt-4">
      <h3>Stores</h3>
      <Form.Control placeholder="Search by name" value={q} onChange={e => setQ(e.target.value)} className="mb-3" />
      <Row>
        {stores.map(s => <Col md={6} key={s.id}><StoreCard store={s} /></Col>)}
      </Row>
    </Container>
  );
};
export default StoreList;
