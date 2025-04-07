import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, Legend
} from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F'];

const StatsDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/watchlist/stats', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load stats:', err);
      }
    };

    fetchStats();
  }, []);

  if (!stats) return <p>Loading stats...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📊 Your Watchlist Insights</h2>

      <div className="mb-4 space-y-2">
        <p><strong>Total Watch Time:</strong> {stats.totalWatchTime} minutes</p>
        <p><strong>Average Rating:</strong> {stats.averageRating} ⭐</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-2">Top Genres</h3>
          <PieChart width={300} height={300}>
            <Pie data={stats.topGenres} dataKey="count" nameKey="genre" cx="50%" cy="50%" outerRadius={100} label>
              {stats.topGenres.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Watchlist Status</h3>
          <BarChart width={300} height={300} data={Object.entries(stats.statusCounts).map(([status, count]) => ({ status, count }))}>
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#82ca9d" />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;
