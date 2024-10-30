/* eslint no-console: ["error", { allow: ["log", "error"] }] */
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { useState } from "react";

export default function Logging() {
  // State pour stocker l'IP, le contenu de la requête et la réponse brute du serveur
  const [ipAddress, setIpAddress] = useState("");
  const [requestData, setRequestData] = useState("");
  const [serverResponse, setServerResponse] = useState("");

  // Fonction pour gérer l'envoi de la requête GET
  const handleGetRequest = async () => {
    try {
      const response = await fetch("http://localhost:3001/monitor/status", {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.text();

        setServerResponse(data);
      } else {
        setServerResponse(`
          Échec de la requête (${response.status}) : ${response.text}`);
      }
    } catch (error) {
      console.log(error);
      setServerResponse(`Erreur lors de l'envoi de la requête : ${error}`);
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
          <Divider />
          <Button className="mt-4" onClick={handleGetRequest}>
            GET <code>/log</code>
          </Button>
          {serverResponse && (
            <div className="mt-4 p-4 dark:bg-neutral-900 rounded border border-neutral-600">
              <h3 className="text-md font-semibold">Réponse du serveur :</h3>
              <pre>{serverResponse}</pre>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
