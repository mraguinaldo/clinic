/* eslint-disable @next/next/no-img-element */
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UserCardProps {
  nome: string;
  sobrenome: string;
  email: string;
  tipo: string;
  img?: string | null;
}

export function UserCard({ nome, sobrenome, email, tipo, img }: UserCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {nome} {sobrenome}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-4">
        <img
          src={img || "/user-placeholder.png"}
          alt={`${nome} ${sobrenome}`}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <p className="text-sm">{email}</p>
          <p className="text-xs text-gray-500">{tipo}</p>
        </div>
      </CardContent>
    </Card>
  );
}
