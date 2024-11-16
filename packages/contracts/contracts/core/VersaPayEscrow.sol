// contracts/core/VersaPayEscrow.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "../interfaces/IVersaPayEscrow.sol";

contract VersaPayEscrow is IVersaPayEscrow, ReentrancyGuard {
    IERC20 public immutable usdc;
    address public immutable merchant;
    uint256 public constant REFUND_PERIOD = 7 days;

    struct Payment {
        uint256 amount;
        uint256 depositTime;
        bool isRefundRequested;
        bool isProcessed;
    }

    Payment public payment;

    constructor(address _usdc, address _merchant) {
        usdc = IERC20(_usdc);
        merchant = _merchant;
    }

    function makePayment(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(payment.amount == 0, "Payment already exists");
        require(
            usdc.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );

        payment = Payment({
            amount: amount,
            depositTime: block.timestamp,
            isRefundRequested: false,
            isProcessed: false
        });

        emit PaymentReceived(msg.sender, amount);
    }

    function requestRefund() external nonReentrant {
        require(payment.amount > 0, "No payment exists");
        require(!payment.isProcessed, "Payment already processed");
        require(
            block.timestamp <= payment.depositTime + REFUND_PERIOD,
            "Refund period expired"
        );

        payment.isRefundRequested = true;
        emit RefundRequested(msg.sender, payment.amount);
    }

    function processRefund(bool approve) external nonReentrant {
        require(msg.sender == merchant, "Only merchant can process refund");
        require(payment.isRefundRequested, "No refund requested");
        require(!payment.isProcessed, "Already processed");

        if (approve) {
            payment.isProcessed = true;
            require(
                usdc.transfer(msg.sender, payment.amount),
                "Refund transfer failed"
            );
            emit RefundProcessed(msg.sender, payment.amount);
        }
    }

    function releasePayment() external nonReentrant {
        require(msg.sender == merchant, "Only merchant can release");
        require(payment.amount > 0, "No payment exists");
        require(
            !payment.isRefundRequested ||
                block.timestamp > payment.depositTime + REFUND_PERIOD,
            "Cannot release during refund period"
        );

        uint256 amount = payment.amount;
        payment.isProcessed = true;
        require(usdc.transfer(merchant, amount), "Transfer failed");

        emit PaymentReleased(merchant, amount);
    }

    function getPaymentStatus()
        external
        view
        returns (
            uint256 amount,
            uint256 depositTime,
            bool canRefund,
            bool isRefundRequested
        )
    {
        return (
            payment.amount,
            payment.depositTime,
            block.timestamp <= payment.depositTime + REFUND_PERIOD,
            payment.isRefundRequested
        );
    }
}
