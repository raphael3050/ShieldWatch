/* eslint no-console: ["error", { allow: ["log", "error"] }] */
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { useState } from "react";
import ReactJsonPretty from "react-json-pretty";
import "react-json-pretty/themes/monikai.css";

export default function Authentication() {
  const [serverResponse, setServerResponse] = useState("");

  // État pour la création d'utilisateur
  const [createUsername, setCreateUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  // État pour la mise à jour d'utilisateur
  const [updateUsername, setUpdateUsername] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("");

  // État pour la suppression d'utilisateur
  const [deleteUsername, setDeleteUsername] = useState("");

  // Fonction pour récupérer tous les utilisateurs
  const handleGetUsers = async () => {
    try {
      const response = await fetch("http://localhost:3002/auth/users", {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        setServerResponse(data.users);
      } else {
        setServerResponse(data.message);
      }
    } catch (error: any) {
      console.error(error);
      setServerResponse(
        `Erreur lors de la récupération des utilisateurs : ${error.message}`,
      );
    }
  };

  // Fonction pour créer un nouvel utilisateur
  const handleCreateUser = async () => {
    if (!createUsername || !password) {
      setServerResponse(
        "Veuillez entrer un nom d'utilisateur et un mot de passe.",
      );

      return;
    }

    try {
      const response = await fetch("http://localhost:3002/auth/signup", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: createUsername, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        setServerResponse(data);
      } else {
        setServerResponse(data.message);
      }
    } catch (error: any) {
      console.error(error);
      setServerResponse(
        `Erreur lors de la création de l'utilisateur : ${error.message}`,
      );
    }
  };

  // Fonction pour mettre à jour un utilisateur
  const handleUpdateUser = async () => {
    if (!updateUsername) {
      setServerResponse("Veuillez entrer le nom d'utilisateur actuel.");

      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3002/auth/update/${updateUsername}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newUsername: newUsername || undefined,
            newPassword: newPassword || undefined,
            newRole: newRole || undefined,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setServerResponse(data);
      } else {
        setServerResponse(data.message);
      }
    } catch (error: any) {
      console.error(error);
      setServerResponse(
        `Erreur lors de la mise à jour de l'utilisateur : ${error.message}`,
      );
    }
  };

  // Fonction pour supprimer un utilisateur
  const handleDeleteUser = async () => {
    if (!deleteUsername) {
      setServerResponse("Veuillez entrer le nom d'utilisateur à supprimer.");

      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3002/auth/delete/${deleteUsername}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (response.ok) {
        setServerResponse(data);
      } else {
        setServerResponse(data.message);
      }
    } catch (error: any) {
      console.error(error);
      setServerResponse(
        `Erreur lors de la suppression de l'utilisateur : ${error.message}`,
      );
    }
  };

  return (
    <Card className="w-full mt-4">
      <CardHeader>
        <h2 className="text-lg font-semibold">Auth Service</h2>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="flex flex-col gap-4 mt-4">
          {/* Récupérer tous les utilisateurs */}
          <Button onClick={handleGetUsers}>
            GET <code>/auth/users</code>
          </Button>

          <Divider />

          {/* Ajouter un nouvel utilisateur */}
          <div className="flex flex-col gap-2">
            <Input
              placeholder="Nom d'utilisateur"
              value={createUsername}
              onChange={(e) => setCreateUsername(e.target.value)}
            />
            <Input
              placeholder="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input
              placeholder="Rôle (user/admin)"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
            <Button onClick={handleCreateUser}>
              POST <code>/auth/signup</code>
            </Button>
          </div>

          <Divider />

          {/* Mettre à jour un utilisateur */}
          <div className="flex flex-col gap-2">
            <Input
              placeholder="Nom d'utilisateur actuel"
              value={updateUsername}
              onChange={(e) => setUpdateUsername(e.target.value)}
            />
            <Input
              placeholder="Nouveau nom d'utilisateur"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
            <Input
              placeholder="Nouveau mot de passe"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Input
              placeholder="Nouveau rôle (user/admin)"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
            />
            <Button onClick={handleUpdateUser}>
              PUT <code>/auth/update/:username</code>
            </Button>
          </div>

          <Divider />

          {/* Supprimer un utilisateur */}
          <div className="flex flex-col gap-2">
            <Input
              placeholder="Nom d'utilisateur à supprimer"
              value={deleteUsername}
              onChange={(e) => setDeleteUsername(e.target.value)}
            />
            <Button onClick={handleDeleteUser}>
              DELETE <code>/auth/delete/:username</code>
            </Button>
          </div>

          <Divider />

          {/* Affichage de la réponse du serveur */}
          {serverResponse && (
            <div>
              <h3 className="text-md font-semibold">Réponse du serveur :</h3>
              <div className="mt-4 p-4 dark:bg-neutral-900 rounded border border-neutral-600">
                <ReactJsonPretty data={serverResponse} />
              </div>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
