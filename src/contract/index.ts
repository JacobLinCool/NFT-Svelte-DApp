import Contract from "dapp-contract";
import { ethers } from "ethers";
import abi from "./abi";

export const config = {
    /** The smart contract address */
    ADDRESS: "0x3D0b2d43Bc4249357b54ca917BE56D5ABf04d1C0",
    /** The blockchain Network ID */
    NETWORK: 4,
};

export default new Contract(config.ADDRESS, config.NETWORK, abi, new ethers.providers.InfuraProvider(config.NETWORK));
