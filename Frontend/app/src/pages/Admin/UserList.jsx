import React, { useEffect, useState } from "react";
import { adminCreateUser, adminGetUsers } from "../../api/admin";
import { Table, Form, Container, Button, Row, Col, Alert } from "react-bootstrap";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [q, setQ] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "", address: "", role: "USER" });
  const [msg, setMsg] = useState('');

  const load = async () => {
    try {
      const res = await adminGetUsers({ q });
      // res.data.users format from backend
      setUsers(res.data.users || res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { load(); }, [q]);

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const createUser = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      await adminCreateUser(form);
      setMsg('User created successfully');
      setForm({ name: "", email: "", password: "", address: "", role: "USER" });
      load();
    } catch (err) {
      setMsg(err?.response?.data?.message || 'Error creating user');
    }
  };

  return (
    <Container className="mt-4">
      <h3>Users</h3>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Control placeholder="Search by name/email" value={q} onChange={e => setQ(e.target.value)} />
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <h5>Add User</h5>
          {msg && <Alert variant="info">{msg}</Alert>}
          <Form onSubmit={createUser}>
            <Form.Control className="mb-2" name="name" placeholder="Full name (20-60 chars)" value={form.name} onChange={onChange} />
            <Form.Control className="mb-2" name="email" placeholder="Email" value={form.email} onChange={onChange} />
            <Form.Control className="mb-2" name="password" type="password" placeholder="Password (8-16, uppercase & special)" value={form.password} onChange={onChange} />
            <Form.Control className="mb-2" name="address" placeholder="Address" value={form.address} onChange={onChange} />
            <Form.Select className="mb-2" name="role" value={form.role} onChange={onChange}>
              <option value="USER">Normal User</option>
              <option value="STORE_OWNER">Store Owner</option>
              <option value="ADMIN">Admin</option>
            </Form.Select>
            <Button type="submit">Create User</Button>
          </Form>
        </Col>
      </Row>

      <Table striped bordered>
        <thead><tr><th>Name</th><th>Email</th><th>Address</th><th>Role</th></tr></thead>
        <tbody>
          {users.map(u => (<tr key={u.id}><td>{u.name}</td><td>{u.email}</td><td>{u.address}</td><td>{u.role}</td></tr>))}
        </tbody>
      </Table>
    </Container>
  );
};

export default UserList;
