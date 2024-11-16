// contracts/interfaces/IVersaPayFactory.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IVersaPayFactory {
    event MerchantRegistered(address indexed merchant, string name);
    event EscrowCreated(address indexed merchant, address indexed escrow);

    function registerMerchant(string memory name) external;
    function createEscrow() external returns (address);
    function getMerchantEscrows(
        address merchant
    ) external view returns (address[] memory);
    function isMerchant(address account) external view returns (bool);
    function getMerchantInfo(
        address merchant
    ) external view returns (string memory name, bool isRegistered);
}
