import React, { useState } from 'react';
import { register } from '../../api/auth';
import { nameValid, emailValid, passwordValid, addressValid } from '../../utils/validators';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Alert, InputGroup, Spinner } from 'react-bootstrap';
import { EyeFill, EyeSlashFill } from 'react-bootstrap-icons';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '' });
  const [err, setErr] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setErr('');
    setSuccess('');

    if (!nameValid(form.name)) return setErr('Name must be 20-60 characters.');
    if (!emailValid(form.email)) return setErr('Invalid email address.');
    if (!passwordValid(form.password)) return setErr('Password must be 8-16 chars, include uppercase and special char.');
    if (!addressValid(form.address)) return setErr('Address is too long.');

    try {
      setLoading(true);
      await register(form);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      setErr(error?.response?.data?.message || 'Error registering.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container style={{ maxWidth: 600 }} className="mt-5 p-4 shadow rounded bg-light">
      <h2 className="mb-4 text-center">Create Your Account</h2>

      {err && <Alert variant="danger">{err}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            name="name"
            placeholder="John Doe"
            value={form.name}
            onChange={onChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="example@mail.com"
            value={form.email}
            onChange={onChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Address</Form.Label>
          <Form.Control
            name="address"
            placeholder="123 Street, City, Country"
            value={form.address}
            onChange={onChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <InputGroup>
            <Form.Control
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Enter password"
              value={form.password}
              onChange={onChange}
            />
            <Button
              variant="outline-secondary"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? <EyeSlashFill /> : <EyeFill />}
            </Button>
          </InputGroup>
          <Form.Text className="text-muted">
            8-16 characters, include uppercase & special character
          </Form.Text>
        </Form.Group>

        <Button className="w-100" type="submit" disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : 'Register'}
        </Button>
      </Form>
    </Container>
  );
};

export default Register;
