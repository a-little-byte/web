"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalServices: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [servicesCount, usersCount] = await Promise.all([
        db
          .selectFrom("services")
          .select(db.fn.count("id").as("count"))
          .executeTakeFirst(),
        db
          .selectFrom("users")
          .select(db.fn.count("id").as("count"))
          .executeTakeFirst(),
      ]);

      setStats({
        totalServices: Number(servicesCount?.count || 0),
        totalUsers: Number(usersCount?.count || 0),
      });
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Services</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalServices}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalUsers}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
