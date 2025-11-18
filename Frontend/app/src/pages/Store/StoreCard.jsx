import React, { useState, useEffect } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { getStoreRatings } from '../../api/stores';
import { submitRating } from '../../api/ratings';
import { getUser } from '../../utils/auth';

const StoreCard = ({ store }) => {
  const [userRating, setUserRating] = useState(null);
  const [ratingVal, setRatingVal] = useState(5);
  const [ratings, setRatings] = useState([]);

  const loadRatings = async () => {
    const res = await getStoreRatings(store.id);
    setRatings(res.data);
    const user = getUser();
    if (user) {
      const mine = res.data.find(r => r.user_id === user.id);
      if (mine) { setUserRating(mine.rating); setRatingVal(mine.rating); }
    }
  };

  useEffect(() => { loadRatings(); }, []);

  const submit = async () => {
    try {
      await submitRating({ store_id: store.id, rating: ratingVal, comment: '' });
      await loadRatings();
    } catch (err) { alert('Login as normal user to rate'); }
  };

  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>{store.name}</Card.Title>
        <Card.Text>{store.address}</Card.Text>
        <Card.Text>Average: {store.avg_rating ?? 'No ratings'}</Card.Text>
        <Form.Select value={ratingVal} onChange={e => setRatingVal(Number(e.target.value))}>
          {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
        </Form.Select>
        <Button className="mt-2" onClick={submit}>{userRating ? 'Update Rating' : 'Submit Rating'}</Button>
      </Card.Body>
    </Card>
  );
};
export default StoreCard;
