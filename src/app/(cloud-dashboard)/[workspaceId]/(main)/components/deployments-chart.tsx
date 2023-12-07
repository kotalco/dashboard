"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useParams, useRouter } from "next/navigation";

import { ProtocolsWithoutEthereum2 } from "@/enums";
import { Button } from "@/components/ui/button";

ChartJS.register(ArcElement, Tooltip, Legend);

const CHART_COLORS = {
  aptos: "#000000",
  bitcoin: "#F6931A",
  chainlink: "#295ADA",
  ethereum: "#8C8C8C",
  filecoin: "#0090FF",
  ipfs: "#5CB5BE",
  near: "#000000",
  polkadot: "#E6007A",
  stacks: "#5546FE",
};

const LABELS = {
  aptos: "Aptos",
  bitcoin: "Bitcoin",
  chainlink: "Chainlink",
  ethereum: "Ethereum",
  filecoin: "Filecoin",
  ipfs: "IPFS",
  near: "NEAR",
  polkadot: "Polkadot",
  stacks: "Stacks",
};

const NODES = [
  {
    label: "Aptos",
    createUrl: "/deployments/aptos/new",
    imageUrl: "/images/aptos.svg",
  },
  {
    label: "Bitcoin",
    createUrl: "/deployments/bitcoin/new",
    imageUrl: "/images/bitcoin.svg",
  },
  {
    label: "Chainlink",
    createUrl: "/deployments/chainlink/new",
    imageUrl: "/images/chainlink.svg",
  },
  {
    label: "Execution Client",
    createUrl: "/deployments/ethereum/execution-clients/new",
    imageUrl: "/images/ethereum.svg",
  },
  {
    label: "Beacon",
    createUrl: "/deployments/ethereum/beacon-nodes/new",
    imageUrl: "/images/ethereum2.svg",
  },
  {
    label: "Validator",
    createUrl: "/deployments/ethereum/validators/new",
    imageUrl: "/images/ethereum2.svg",
  },
  {
    label: "Filecoin",
    createUrl: "/deployments/filecoin/new",
    imageUrl: "/images/filecoin.svg",
  },
  {
    label: "IPFS Peer",
    createUrl: "/deployments/ipfs/peers/new",
    imageUrl: "/images/ipfs.svg",
  },
  {
    label: "IPFS Cluster Peer",
    createUrl: "/deployments/ipfs/cluster-peers/new",
    imageUrl: "/images/ipfs.svg",
  },
  {
    label: "NEAR",
    createUrl: "/deployments/near/new",
    imageUrl: "/images/near.svg",
  },
  {
    label: "Polkadot",
    createUrl: "/deployments/polkadot/new",
    imageUrl: "/images/polkadot.svg",
  },
  {
    label: "Stacks",
    createUrl: "/deployments/stacks/new",
    imageUrl: "/images/stacks.svg",
  },
];

const randomProtocol = NODES[Math.floor(Math.random() * NODES.length)];

interface DeploymentsChartProps {
  counts: Record<string, number>;
}

export const DeploymentsChart = ({ counts }: DeploymentsChartProps) => {
  const params = useParams();
  const router = useRouter();

  const keys = Object.keys(counts) as ProtocolsWithoutEthereum2[];
  const filteredKeys = keys.filter((key) => counts[key]);
  const colors = filteredKeys.map((key) => CHART_COLORS[key]);
  const count = filteredKeys.map((key) => counts[key]);
  const labels = filteredKeys.map((key) => LABELS[key]);

  const totalCount = Object.values(counts).reduce(
    (current, prev) => current + prev,
    0
  );

  return (
    <div>
      {!!totalCount && (
        <div className="col-span-4">
          <div className="flex">
            <Doughnut
              data={{
                labels,
                datasets: [
                  {
                    data: count,
                    backgroundColor: colors,
                  },
                ],
              }}
              options={{
                animation: false,
                cutout: "50%",
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                  tooltip: {
                    mode: "index",
                    displayColors: false,
                    callbacks: {
                      title: (item) =>
                        `${item[0].label}: ${item[0].formattedValue} ${
                          item[0].parsed === 1 ? "node" : "nodes"
                        }`,
                      label: () => ``,
                    },
                  },
                  legend: {
                    position: "right",
                    labels: { boxWidth: 15, font: { size: 14 } },
                  },
                },
              }}
            />
          </div>
        </div>
      )}
      {!totalCount && (
        <div>
          <p className="pb-6 mb-6 text-sm text-muted-foreground border-b">
            You haven’t created any deployments yet.
          </p>

          <Button
            onClick={() =>
              router.push(`${params.workspaceId}/${randomProtocol.createUrl}`)
            }
          >
            Create New {randomProtocol.label} Node
          </Button>
        </div>
      )}
    </div>
  );
};
