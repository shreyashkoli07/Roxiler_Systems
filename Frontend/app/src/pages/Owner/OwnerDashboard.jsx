import React, { useEffect, useState } from "react";
import { getUser } from "../../utils/auth";
import { getOwnerRatings } from "../../api/owner";
import { Container, Card, Table, Spinner, Alert } from "react-bootstrap";

const OwnerDashboard = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  const [user] = useState(() => getUser());


  const load = async () => {
    setError("");

    try {
      setLoading(true);

      const res = await getOwnerRatings(user.id);

      const rawStores = res?.data?.stores || [];

      const normalized = rawStores.map((store) => ({
        id: store.id,
        name: store.name || "Untitled Store",
        address: store.address || "",
        average:
          store.average !== null && store.average !== undefined
            ? Number(store.average)
            : null,

        ratings: Array.isArray(store.ratings)
          ? store.ratings.map((r) => ({
            id: r.id,
            user_id: r.user_id ?? r.user?.id ?? null,
            user_name: r.user_name ?? r.user?.name ?? "Unknown",
            email: r.email ?? r.user?.email ?? "",
            rating: r.rating ?? null,
            comment: r.comment ?? "",
            created_at: r.created_at ?? r.createdAt ?? null,
          }))
          : [],
      }));

      setStores(normalized);
    } catch (err) {
      console.error("OwnerDashboard load error:", err);
      setError(
        err?.response?.data?.message || "Failed to load store ratings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) load();
  }, [user.id]);
  if (loading)
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" />
      </Container>
    );

  return (
    <Container className="mt-4">
      <h3>Your Stores & Ratings</h3>

      {error && <Alert variant="danger">{error}</Alert>}

      {stores.length === 0 && !error ? (
        <Card className="mt-3">
          <Card.Body>No stores found for your account.</Card.Body>
        </Card>
      ) : (
        stores.map((store) => (
          <Card key={store.id} className="mb-3">
            <Card.Body>
              <Card.Title>{store.name}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                {store.address}
              </Card.Subtitle>

              <h6>
                Average Rating:{" "}
                {store.average !== null ? store.average : "No ratings"}
              </h6>

              <Table striped bordered className="mt-3">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Rating</th>
                    <th>Comment</th>
                  </tr>
                </thead>
                <tbody>
                  {store.ratings.length ? (
                    store.ratings.map((r) => (
                      <tr key={r.id ?? `${store.id}-${r.user_id}`}>
                        <td>{r.user_name}</td>
                        <td>{r.email}</td>
                        <td>{r.rating}</td>
                        <td>{r.comment}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center">
                        No ratings yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
};

export default OwnerDashboard;
