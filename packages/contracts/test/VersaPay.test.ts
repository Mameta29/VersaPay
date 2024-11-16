// test/VersaPay.test.ts
import { expect, use } from "chai";
import chaiAsPromised from "chai-as-promised";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { getAddress, parseUnits, Address } from "viem";
import hre from "hardhat";

use(chaiAsPromised);

type MerchantInfo = [string, boolean];
type PaymentStatus = [bigint, bigint, boolean, boolean];

describe("VersaPay", function () {
  async function deployFixture() {
    const [owner, merchant, customer] = await hre.viem.getWalletClients();
    const publicClient = await hre.viem.getPublicClient();
    
    // Deploy Mock USDC
    const mockUSDC = await hre.viem.deployContract("MockUSDC", []);
    
    // Deploy Factory
    const factory = await hre.viem.deployContract("VersaPayFactory", [
      getAddress(mockUSDC.address)
    ]);

    return { 
      factory, 
      mockUSDC, 
      owner, 
      merchant, 
      customer,
      publicClient 
    };
  }

  describe("Merchant Registration", function () {
    it("Should allow a merchant to register", async function () {
      const { factory, merchant } = await loadFixture(deployFixture);
      
      // merchantとして登録
      await factory.write.registerMerchant(
        ["Test Shop"] as const,
        { account: merchant.account }
      );
      
      const merchantInfo = await factory.read.getMerchantInfo([
        merchant.account.address as Address
      ]) as MerchantInfo;

      expect(merchantInfo[0]).to.equal("Test Shop");
      expect(merchantInfo[1]).to.be.true;
    });

    it("Should not allow duplicate registration", async function () {
      const { factory, merchant } = await loadFixture(deployFixture);
      
      await factory.write.registerMerchant(
        ["Test Shop"] as const,
        { account: merchant.account }
      );
      
      await expect(
        factory.write.registerMerchant(
          ["Another Shop"] as const,
          { account: merchant.account }
        )
      ).to.be.rejected;
    });
  });

  describe("Escrow Creation", function () {
    it("Should allow registered merchant to create escrow", async function () {
      const { factory, merchant } = await loadFixture(deployFixture);
      
      // まず店舗として登録
      await factory.write.registerMerchant(
        ["Test Shop"] as const,
        { account: merchant.account }
      );

      // エスクロー作成
      await factory.write.createEscrow([],{
        account: merchant.account
      });
      
      const escrows = await factory.read.getMerchantEscrows([
        merchant.account.address as Address
      ]) as Address[];

      expect(escrows.length).to.equal(1);
    });
  });

  describe("Payment Flow", function () {
    it("Should handle full payment flow", async function () {
      const { factory, mockUSDC, merchant, customer } = await loadFixture(deployFixture);
      
      // Register merchant
      await factory.write.registerMerchant(
        ["Test Shop"] as const,
        { account: merchant.account }
      );

      // Create escrow
      await factory.write.createEscrow([],{
        account: merchant.account
      });

      const escrows = await factory.read.getMerchantEscrows([
        merchant.account.address as Address
      ]) as Address[];

      const escrow = await hre.viem.getContractAt("VersaPayEscrow", escrows[0]);
      
      // Mint and approve USDC
      const amount = parseUnits("100", 6); // 100 USDC
      await mockUSDC.write.mint(
        [customer.account.address as Address, amount],
        { account: customer.account }
      );
      
      await mockUSDC.write.approve(
        [escrow.address, amount],
        { account: customer.account }
      );
      
      // Make payment
      await escrow.write.makePayment(
        [amount],
        { account: customer.account }
      );
      
      // Check payment status
      const status = await escrow.read.getPaymentStatus() as PaymentStatus;
      expect(status[0]).to.equal(amount);
    });
  });
});