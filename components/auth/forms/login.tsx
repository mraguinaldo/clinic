/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { api } from "@/service/data";
import { useUserDataStore } from "@/store/use-user-data-store";

export default function LoginForm() {
  const router = useRouter();
  const { login } = useUserDataStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: any) => {
    e.preventDefault();

    if (!email || !password) {
      toast("Por favor, preencha todos os campos.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login/", {
        email,
        password,
      });

      const { access, refresh } = response.data;
      login({ token: access, refreshToken: refresh, user: response.data.user });

      toast("Login realizado com sucesso!");

      router.push("/dashboard");
    } catch {
      toast("Erro ao fazer login. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm shadow-lg">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Login</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <Label>Senha</Label>
            <Input
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
