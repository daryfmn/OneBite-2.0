import express from 'express';
import type { RowDataPacket } from 'mysql2';
import { pool } from './db.js';

const app = express();

app.get('/api/health', async (_req, res) => {
  await pool.query('SELECT 1');
  res.json({ ok: true });
});

app.get('/api/dishes', async (_req, res) => {
  const [dishes] = await pool.query<RowDataPacket[]>('SELECT * FROM dishes');
  const [times] = await pool.query<RowDataPacket[]>(
    'SELECT dish_id, meal_time FROM dish_best_times');
  const [pitches] = await pool.query<RowDataPacket[]>(
    'SELECT dish_id, pitch FROM dish_pitches ORDER BY dish_id, sort_order');

  res.json(dishes.map((d) => ({
    id: d.id,
    name: d.name,
    emoji: d.emoji,
    cuisine: d.cuisine,
    spicy: d.spicy,
    sweet: !!d.sweet,
    soupy: !!d.soupy,
    heaviness: d.heaviness,
    bestTimes: times.filter((t) => t.dish_id === d.id).map((t) => t.meal_time),
    pitches: pitches.filter((p) => p.dish_id === d.id).map((p) => p.pitch),
  })));
});

app.get('/api/restaurants', async (_req, res) => {
  const [restaurants] = await pool.query<RowDataPacket[]>('SELECT * FROM restaurants');
  const [menu] = await pool.query<RowDataPacket[]>(
    'SELECT restaurant_id, name, price, dish_id FROM menu_items ORDER BY restaurant_id, sort_order');

  res.json(restaurants.map((r) => ({
    id: r.id,
    name: r.name,
    area: r.area,
    lat: r.lat,
    lng: r.lng,
    // '17:00:00' + '02:00:00' -> '17:00-02:00' (24h places become '00:00-24:00')
    hours: `${String(r.open_time).slice(0, 5)}-${String(r.close_time).slice(0, 5)}`,
    menu: menu
      .filter((m) => m.restaurant_id === r.id)
      .map((m) => ({
        name: m.name,
        price: m.price,
        ...(m.dish_id ? { dishId: m.dish_id } : {}),
      })),
  })));
});

app.listen(3001, () => console.log('API running on http://localhost:3001'));