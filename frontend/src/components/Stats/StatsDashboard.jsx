import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer
} from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F', '#d88fea', '#8fd8ea'];

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

  if (!stats) return <p className="p-6 text-gray-700">Loading stats...</p>;

  const genreData = Object.entries(stats.genreCounts).map(([genre, count]) => ({
    genre,
    count
  }));

  const ratingData = Object.entries(stats.ratingDistribution).map(([range, count]) => ({
    range,
    count
  }));

  const typeData = Object.entries(stats.typeCounts).map(([type, count]) => ({
    type,
    count
  }));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">📊 Your Watchlist Insights</h2>

      <div className="mb-6 space-y-2 text-lg">
        <p><strong>Total Watch Time:</strong> {stats.totalWatchTime} minutes</p>
        <p><strong>Average Rating:</strong> {stats.averageRating} ⭐</p>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Genre Pie Chart */}
        <div>
          <h3 className="font-semibold mb-2">🎭 Genre Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={genreData}
                dataKey="count"
                nameKey="genre"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {genreData.map((_, i) => (
                  <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Rating Distribution */}
        <div>
          <h3 className="font-semibold mb-2">⭐ Rating Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ratingData}>
              <XAxis dataKey="range" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" name="Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Type Donut Chart */}
        <div>
          <h3 className="font-semibold mb-2">🎬 Type Breakdown (Movie vs TV)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={typeData}
                dataKey="count"
                nameKey="type"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                label
              >
                {typeData.map((_, i) => (
                  <Cell key={`cell-type-${i}`} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;
