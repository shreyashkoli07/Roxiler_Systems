import React, { useEffect, useState } from 'react';
import API from '../../api/api';
import { Table, Container, Form, Button } from 'react-bootstrap';

const AdminStoreList = () => {
  const [stores,setStores] = useState([]);
  const [q,setQ] = useState('');
  const [form,setForm] = useState({ name:'', email:'', address:'' });

  const load = async () => {
    const res = await API.get('/stores', { params: { q } });
    setStores(res.data.stores);
  };

  useEffect(()=>{ load(); }, [q]);

  const onChange = e => setForm({...form, [e.target.name]: e.target.value});
  const create = async () => { try { await API.post('/stores', form); setForm({name:'',email:'',address:''}); load(); } catch { alert('Error'); } };

  return (
    <Container className="mt-4">
      <h3>Stores</h3>
      <Form.Control placeholder="Search by name/address" value={q} onChange={e=>setQ(e.target.value)} className="mb-3" />
      <h5>Add Store</h5>
      <Form className="mb-3">
        <Form.Control className="mb-2" placeholder="Store Name" name="name" value={form.name} onChange={onChange} />
        <Form.Control className="mb-2" placeholder="Email" name="email" value={form.email} onChange={onChange} />
        <Form.Control className="mb-2" placeholder="Address" name="address" value={form.address} onChange={onChange} />
        <Button onClick={create}>Add Store</Button>
      </Form>
      <Table striped bordered>
        <thead><tr><th>Name</th><th>Email</th><th>Address</th><th>Rating</th></tr></thead>
        <tbody>{stores.map(s=> <tr key={s.id}><td>{s.name}</td><td>{s.email}</td><td>{s.address}</td><td>{s.avg_rating || 0}</td></tr>)}</tbody>
      </Table>
    </Container>
  );
};
export default AdminStoreList;
