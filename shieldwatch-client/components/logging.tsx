/* eslint no-console: ["error", { allow: ["log", "error"] }] */
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { useState } from "react";
import ReactJsonPretty from "react-json-pretty";
import "react-json-pretty/themes/monikai.css";

export default function Logging() {
  // State pour stocker la réponse brute du serveur
  const [serverResponse, setServerResponse] = useState("");
  const [logId, setLogId] = useState("");

  // Fonction pour gérer l'envoi de la requête GET pour récupérer les logs
  const handleGetLogs = async () => {
    try {
      const response = await fetch("http://localhost:3005/log", {
        method: "GET",
        credentials: "include", // Permet d'inclure les cookies pour la requête
      });

      if (response.ok) {
        const data = await response.text();

        setServerResponse(data);
      } else {
        setServerResponse(
          `Échec de la requête (${response.status}) : ${await response.text()}`,
        );
      }
    } catch (error: any) {
      console.log(error);
      setServerResponse(
        `Erreur lors de l'envoi de la requête : ${error.message}`,
      );
    }
  };

  // Fonction pour gérer l'envoi de la requête DELETE pour supprimer un log par ID
  const handleDeleteLogById = async () => {
    if (!logId) {
      setServerResponse("Veuillez entrer un ID de log valide.");

      return;
    }

    try {
      const response = await fetch(`http://localhost:3005/log/${logId}`, {
        method: "DELETE",
        credentials: "include", // Permet d'inclure les cookies pour la requête
      });

      if (response.ok) {
        const data = await response.text();

        setServerResponse(`Log supprimé : ${data}`);
      } else {
        setServerResponse(
          `Échec de la suppression (${response.status}) : ${await response.text()}`,
        );
      }
    } catch (error: any) {
      console.log(error);
      setServerResponse(
        `Erreur lors de la suppression du log : ${error.message}`,
      );
    }
  };

  // Fonction pour gérer l'envoi de la requête DELETE pour supprimer tous les logs
  const handleDeleteAllLogs = async () => {
    try {
      const response = await fetch("http://localhost:3005/log", {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.text();

        setServerResponse(`Tous les logs ont été supprimés : ${data}`);
      } else {
        setServerResponse(
          `Échec de la suppression des logs (${response.status}) : ${await response.text()}`,
        );
      }
    } catch (error: any) {
      console.log(error);
      setServerResponse(
        `Erreur lors de la suppression des logs : ${error.message}`,
      );
    }
  };

  return (
    <Card className="w-full mt-4">
      <CardHeader>
        <h2 className="text-lg font-semibold">Logging Service</h2>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="flex flex-col gap-4 mt-4">
          <Button className="" onClick={handleGetLogs}>
            GET <code>/logs</code>
          </Button>
          <Divider />
          <div className="flex flex-col gap-2">
            <Input
              className="mt-2"
              placeholder="Entrez l'ID du log à supprimer"
              value={logId}
              onChange={(e) => setLogId(e.target.value)}
            />
            <Button className="mt-2" onClick={handleDeleteLogById}>
              DELETE <code>/log/:id</code>
            </Button>
          </div>
          <Divider />
          <Button className="mt-4" onClick={handleDeleteAllLogs}>
            DELETE <code>/log</code> (Tous)
          </Button>
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
