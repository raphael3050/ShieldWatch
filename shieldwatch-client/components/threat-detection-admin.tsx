/* eslint no-console: ["error", { allow: ["log", "error"] }] */
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Button } from "@nextui-org/button";

export default function ThreatDetectionAdmin() {
  return (
    <Card className="w-full mt-4">
      <CardHeader>
        <h2 className="text-lg font-semibold">Threat Detection Service</h2>
      </CardHeader>
      <Divider />
      <CardBody>
        <p className="text-sm">
          You can open the Apollo Studio to view the schema and run queries
        </p>
        <div className="flex flex-col gap-4 mt-4">
          <Button
            className="mt-4"
            onClick={() =>
              window.open("http://localhost:8080/graphql", "_blank")
            }
          >
            Open <code>/graphql</code>
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
