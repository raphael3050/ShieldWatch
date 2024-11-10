/* eslint no-console: ["error", { allow: ["log", "error"] }] */
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { useState } from "react";
import ReactJsonPretty from "react-json-pretty";
import "react-json-pretty/themes/monikai.css";

export default function ThreatDetection() {
  // State pour stocker l'IP, le contenu de la requête et la réponse brute du serveur
  const [ipAddress, setIpAddress] = useState("");
  const [requestData, setRequestData] = useState("");
  const [serverResponse, setServerResponse] = useState("");

  // Fonction pour gérer l'envoi de la requête POST
  const handleSendRequest = async () => {
    try {
      const response = await fetch("http://localhost:8080/monitor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Forwarded-For": ipAddress,
        },
        body: JSON.stringify({ requestData }),
      });

      setServerResponse(await response.text());
    } catch (error) {
      console.log(error);
      alert("Erreur lors de l'envoi de la requête.");
    }
  };

  // Fonction pour gérer l'envoi de la requête GET
  const handleGetRequest = async () => {
    try {
      const response = await fetch("http://localhost:8080/monitor/status", {
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
        <h2 className="text-lg font-semibold">Threat Detection Service</h2>
      </CardHeader>
      <Divider />
      <CardBody>
        <p className="text-sm">
          You can use the following form to generate a request with chosen
          parameters.
        </p>
        <div className="flex flex-col gap-4 mt-4">
          <Input
            isClearable
            label="Adresse IP"
            placeholder="Entrez une fausse adresse IP"
            value={ipAddress}
            onChange={(e) => setIpAddress(e.target.value)}
          />
          <Input
            isClearable
            label="Contenu de la requête"
            placeholder="Entrez le contenu de la requête"
            value={requestData}
            onChange={(e) => setRequestData(e.target.value)}
          />
          <Button className="mt-4" onClick={handleSendRequest}>
            Envoyer la requête POST
          </Button>
          <Divider />
          <Button className="mt-4" onClick={handleGetRequest}>
            GET <code>/monitor/status</code>
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
