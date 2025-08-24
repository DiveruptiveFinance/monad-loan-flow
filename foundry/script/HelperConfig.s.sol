// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script} from "forge-std/Script.sol";

contract HelperConfig is Script {
    struct NetworkConfig {
        address usdc;
        uint256 deployerKey;
    }

    uint256 public DEFAULT_ANVIL_KEY = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;

    NetworkConfig public activeNetworkConfig;

    constructor() {
        if (block.chainid == 10143) {
            activeNetworkConfig = getMonadTestnetNetworkConfig();
        } else {
            activeNetworkConfig = getAnvilNetworkConfig();
        }
    }

    function getMonadTestnetNetworkConfig() public view returns (NetworkConfig memory) {
        return NetworkConfig({
            deployerKey: vm.envUint("PRIVATE_KEY")
        });
    }

    function getAnvilNetworkConfig() public view returns (NetworkConfig memory) {
        if (activeNetworkConfig.usdc != address(0)) {
            return activeNetworkConfig;
        }

        return NetworkConfig({
            usdc: address(0),
            deployerKey: DEFAULT_ANVIL_KEY
        });
    }
}