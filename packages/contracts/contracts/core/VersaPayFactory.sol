// contracts/core/VersaPayFactory.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./VersaPayEscrow.sol";
import "../interfaces/IVersaPayFactory.sol";

contract VersaPayFactory is IVersaPayFactory, Ownable, ReentrancyGuard {
    address public immutable usdcToken;

    struct Merchant {
        string name;
        bool isRegistered;
        address[] escrows;
    }

    mapping(address => Merchant) public merchants;

    constructor(address _usdcToken) Ownable(msg.sender) {
        usdcToken = _usdcToken;
    }

    function registerMerchant(string memory name) external nonReentrant {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(!merchants[msg.sender].isRegistered, "Already registered");

        merchants[msg.sender].name = name;
        merchants[msg.sender].isRegistered = true;

        emit MerchantRegistered(msg.sender, name);
    }

    function createEscrow() external nonReentrant returns (address) {
        require(
            merchants[msg.sender].isRegistered,
            "Not registered as merchant"
        );

        VersaPayEscrow newEscrow = new VersaPayEscrow(usdcToken, msg.sender);
        merchants[msg.sender].escrows.push(address(newEscrow));

        emit EscrowCreated(msg.sender, address(newEscrow));

        return address(newEscrow);
    }

    function getMerchantEscrows(
        address merchant
    ) external view returns (address[] memory) {
        require(merchants[merchant].isRegistered, "Merchant not registered");
        return merchants[merchant].escrows;
    }

    function isMerchant(address account) external view returns (bool) {
        return merchants[account].isRegistered;
    }

    function getMerchantInfo(
        address merchant
    ) external view returns (string memory name, bool isRegistered) {
        Merchant storage m = merchants[merchant];
        return (m.name, m.isRegistered);
    }

    // Optional: Add merchant deregistration function if needed
    function deregisterMerchant(address merchant) external onlyOwner {
        require(merchants[merchant].isRegistered, "Merchant not registered");
        merchants[merchant].isRegistered = false;
    }
}
