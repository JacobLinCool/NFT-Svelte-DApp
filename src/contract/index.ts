import { ethers } from "ethers";
import abi from "./abi";

export const config = {
    /** The smart contract address */
    ADDRESS: "0x40c5ce295E47A553386A3A8BFcd0E1bd572618d0",
    /** The blockchain Network Informations */
    NETWORK: { NAME: "SmartBCH", SYMBOL: "BCH", ID: 10000 },
    /** The NFT Name */
    NFT_NAME: "TEST_ONLY_TOKEN",
    /** The NFT Symbol */
    SYMBOL: "TOT",
    /** The cost of each NFT, in minimum unit of the coin */
    COST: 100000000000000,
    /** The gas limit for the transaction */
    GAS_LIMIT: 285000,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let ethereum: any = null;
let connection = { connected: false, enabled: false, error: "Not Initialized" };
let readonly_contract: ethers.Contract = null;
let contract: ethers.Contract = null;
let update = (c: typeof connection) => console.log(c);
export function set_update(func: (c: typeof connection) => void) {
    update = func;
}
export const get = {
    ethereum: () => ethereum,
    connection: () => connection,
    contract: () => contract,
    readonly_contract: () => readonly_contract,
};

let initialized = false;
export async function init(): Promise<void> {
    if (typeof window === undefined || initialized) {
        return;
    }
    initialized = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ethereum = (window as any).ethereum;
    listen_ethereum();

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    readonly_contract = new ethers.Contract(config.ADDRESS, abi, provider);
    contract = new ethers.Contract(config.ADDRESS, abi, signer);

    await refresh();
}

async function refresh(): Promise<void> {
    if (!ethereum) {
        connection = { connected: false, enabled: connection.enabled, error: "Not Initialized" };
        return;
    }

    const provider = new ethers.providers.Web3Provider(ethereum);
    const network = await provider.detectNetwork();
    if (network.chainId !== config.NETWORK.ID) {
        connection = {
            connected: false,
            enabled: connection.enabled,
            error: `Wrong Network. Current: 0x${network.chainId.toString(16)}. Expected: 0x${config.NETWORK.ID.toString(
                16,
            )}.`,
        };
        return;
    }

    connection = {
        connected: true,
        enabled: connection.enabled,
        error: connection.enabled ? "" : "Please Enable the Wallets.",
    };
    update(connection);
}

export async function enable(): Promise<void> {
    if (!connection.connected || connection.enabled) {
        return;
    }

    await ethereum.request({ method: "eth_requestAccounts" });
    connection.enabled = true;
    connection.error = "";
    refresh();
}

function listen_ethereum() {
    if (ethereum) {
        ethereum.on("connect", refresh);
        ethereum.on("disconnect", refresh);
        ethereum.on("chainChanged", refresh);
        ethereum.on("accountsChanged", refresh);
    }
}
