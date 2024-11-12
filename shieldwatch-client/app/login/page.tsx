/* eslint no-console: ["error", { allow: ["log", "error"] }] */
"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Card } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";

const Login = () => {
  const [username, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:3005/auth/login",
        { username, password },
        { withCredentials: true },
      );

      console.log(response.status);
      router.refresh(); // Forcer la mise à jour du cache côté client
      router.push("/admin");
    } catch (err) {
      setError("Échec de connexion au service d'authentification");
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center">
      <Card className="p-8 shadow-lg max-w-lg w-full text-center rounded-lg">
        <h3 className="text-2xl font-semibold mb-4">Connexion</h3>
        <form className="space-y-6" onSubmit={handleLogin}>
          <Input
            fullWidth
            isClearable
            className="focus:ring-2 focus:ring-blue-500"
            placeholder="Username"
            value={username}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            fullWidth
            isClearable
            className="focus:ring-2 focus:ring-blue-500"
            placeholder="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition-colors"
            type="submit"
          >
            Connexion
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Login;
