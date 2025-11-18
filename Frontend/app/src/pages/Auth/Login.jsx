import React, { useState } from 'react';
import { login } from '../../api/auth';
import { saveToken, saveUser } from '../../utils/auth';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Form, Button, Alert, Card, Row, Col } from 'react-bootstrap';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const res = await login(form);
      saveToken(res.data.token);
      saveUser(res.data.user);

      if (res.data.user.role === 'ADMIN') navigate('/admin/dashboard');
      else if (res.data.user.role === 'STORE_OWNER') navigate('/owner/dashboard');
      else navigate('/stores');
    } catch (err) {
      setErr(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card className="shadow-sm w-100" style={{ maxWidth: '450px' }}>
        <Card.Body>
          <h3 className="mb-4 text-center text-primary">Welcome Back</h3>
          {err && <Alert variant="danger">{err}</Alert>}
          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={onChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={onChange}
                required
              />
            </Form.Group>

            <Button type="submit" className="w-100 mb-2" variant="primary" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>

            <div className="text-center">
              <small>
                Don't have an account? <Link to="/register">Register here</Link>
              </small>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;
