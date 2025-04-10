import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#FF5722",
  "#673AB7",
  "#FFEB3B",
  "#4DD0E1",
  "#F06292",
  "#FF9800",
];

const StatsDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5001/api/watchlist/stats",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load stats:", err);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <p className="p-6 text-gray-400">Loading stats...</p>;

  const genreData = Object.entries(stats.genreCounts).map(([genre, count]) => ({
    genre,
    count,
  }));
  const ratingData = Object.entries(stats.ratingDistribution).map(
    ([range, count]) => ({ range, count })
  );
  const typeData = Object.entries(stats.typeCounts).map(([type, count]) => ({
    type,
    count,
  }));

  return (
    <div className="bg-background text-text-primary min-h-screen px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-accent-orange">
          📊 Your Watchlist Insights
        </h2>

        <div className="mb-8 space-y-2 text-lg">
          <p>
            <span className="text-accent-purple font-semibold">
              Total Watch Time:
            </span>{" "}
            {stats.totalWatchTime} minutes
          </p>
          <p>
            <span className="text-accent-purple font-semibold">
              Average Rating:
            </span>{" "}
            {stats.averageRating} ⭐
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Genre Pie Chart */}
          <div className="bg-card p-6 rounded-xl shadow-xl">
            <h3 className="text-lg font-semibold mb-4">
              🎭 Genre Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={genreData}
                  dataKey="count"
                  nameKey="genre"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ genre }) => genre}
                  cornerRadius={8}
                >
                  {genreData.map((_, i) => (
                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#2a2a2a",
                    borderRadius: "6px",
                    border: "none",
                  }}
                />
                <Legend
                  iconType="circle"
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Rating Bar Chart */}
          <div className="bg-card p-6 rounded-xl shadow-xl">
            <h3 className="text-lg font-semibold mb-4">
              ⭐ Rating Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ratingData}>
                <XAxis dataKey="range" stroke="#ccc" />
                <YAxis stroke="#ccc" allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#2a2a2a",
                    borderRadius: "6px",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="count"
                  fill="#FF5722"
                  barSize={30}
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Type Donut Chart */}
          <div className="bg-card p-6 rounded-xl shadow-xl md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">🎬 Type Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={typeData}
                  dataKey="count"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  label={({ type }) => type}
                  cornerRadius={10}
                >
                  {typeData.map((_, i) => (
                    <Cell
                      key={`cell-type-${i}`}
                      fill={COLORS[i % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#2a2a2a",
                    borderRadius: "6px",
                  }}
                />
                <Legend
                  iconType="circle"
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;
