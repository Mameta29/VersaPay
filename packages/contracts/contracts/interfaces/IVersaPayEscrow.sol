// contracts/interfaces/IVersaPayEscrow.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IVersaPayEscrow {
    event PaymentReceived(address indexed from, uint256 amount);
    event PaymentReleased(address indexed to, uint256 amount);
    event RefundRequested(address indexed from, uint256 amount);
    event RefundProcessed(address indexed to, uint256 amount);

    function makePayment(uint256 amount) external;
    function requestRefund() external;
    function processRefund(bool approve) external;
    function releasePayment() external;
    function getPaymentStatus()
        external
        view
        returns (
            uint256 amount,
            uint256 depositTime,
            bool canRefund,
            bool isRefundRequested
        );
}
