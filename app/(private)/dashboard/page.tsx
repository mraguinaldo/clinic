"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">...</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Pacientes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">...</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Consultas Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
