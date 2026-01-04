"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { CreditCard, FileText } from "lucide-react";

export default function FarmaciaDashboard() {
  const router = useRouter();

  const cards = [
    {
      title: "Medicamentos",
      description: "Gerencie o estoque de medicamentos",
      icon: <CreditCard size={32} />,
      route: "/dashboard/medicamentos",
    },
    {
      title: "Pagamentos",
      description: "Controle os pagamentos realizados",
      icon: <CreditCard size={32} />,
      route: "/dashboard/pagamentos",
    },
    {
      title: "Recibos",
      description: "Visualize e emita recibos",
      icon: <FileText size={32} />,
      route: "/dashboard/recibos",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Farmácia</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Card
            key={card.title}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push(card.route)}
          >
            <CardHeader className="flex items-center gap-4">
              {card.icon}
              <CardTitle>{card.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
