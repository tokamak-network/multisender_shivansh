const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Multisender", function () {
    let owner, user1, user2, user3, user4, user5, user6, user7, user8, user9, user10;
    let multisender;
    let usdt;
    let usdc;
    let ton;
    let mock;
    let mockNFT;
    let mockNFT1

    beforeEach(async function () {
        [user1, user2, user3, user4, user5, user6, user7, user8, user9, user10] = await ethers.getSigners();
        owner = await ethers.getImpersonatedSigner("0x08a74A0075a2C3A786A84439812a141C6C8b73f3")

        const amountInWei = ethers.parseEther('100')
        // Send the transaction
        const tx = {
            to: owner.address,
            value: amountInWei
        };

        const transactionResponse = await user1.sendTransaction(tx);
        await transactionResponse.wait();

        const Multisender = await ethers.getContractFactory("Multisender", owner);
        multisender = await upgrades.deployProxy(
            Multisender, []
        );
        usdt = await ethers.getContractAt("ERC20", "0x79E0d92670106c85E9067b56B8F674340dCa0Bbd", owner)
        usdc = await ethers.getContractAt("ERC20", "0xFF3Ef745D9878AfE5934Ff0b130868AFDDbc58e8", owner)
        ton = await ethers.getContractAt("ERC20", "0x7c6b91D9Be155A6Db01f749217d76fF02A7227F2", owner)
        mock = await (await ethers.getContractFactory('Token', owner)).deploy()
        mockNFT = await (await ethers.getContractFactory('MockNFT', owner)).deploy()
        mockNFT1 = await (await ethers.getContractFactory('MockNFT1', owner)).deploy()

    });

    describe("Multisend Tokens", function () {
        it("will send Ton", async function () {
            await ton.approve(multisender.target, ethers.parseEther('100'))
            expect(await multisender.multisendERC20(ton.target, [user1.address, user2.address, user3.address, user4.address, user5.address, user6.address, user7.address, user8.address, user9.address, user10.address], [ethers.parseEther('10'), ethers.parseEther('10'), ethers.parseEther('10'), ethers.parseEther('10'), ethers.parseEther('10'), ethers.parseEther('10'), ethers.parseEther('10'), ethers.parseEther('10'), ethers.parseEther('10'), ethers.parseEther('10')], ethers.parseEther('100')))
        });
        it("will send USDC", async function () {
            await usdc.approve(multisender.target, ethers.parseUnits('100'));
            expect(await multisender.multisendERC20(usdc.target, [user1.address, user2.address, user3.address, user4.address, user5.address, user6.address, user7.address, user8.address, user9.address, user10.address], [ethers.parseUnits('10', 6), ethers.parseUnits('10', 6), ethers.parseUnits('10', 6), ethers.parseUnits('10', 6), ethers.parseUnits('10', 6), ethers.parseUnits('10', 6), ethers.parseUnits('10', 6), ethers.parseUnits('10', 6), ethers.parseUnits('10', 6), ethers.parseUnits('10', 6)], ethers.parseUnits('100', 6))).not.to.be.reverted
        });
        it("will send USDT", async function () {
            await usdt.approve(multisender.target, ethers.parseUnits('100'));
            expect(await multisender.multisendERC20(usdt.target, [user1.address, user2.address, user3.address, user4.address, user5.address, user6.address, user7.address, user8.address, user9.address, user10.address], [ethers.parseUnits('10', 6), ethers.parseUnits('10', 6), ethers.parseUnits('10', 6), ethers.parseUnits('10', 6), ethers.parseUnits('10', 6), ethers.parseUnits('10', 6), ethers.parseUnits('10', 6), ethers.parseUnits('10', 6), ethers.parseUnits('10', 6), ethers.parseUnits('10', 6)], ethers.parseUnits('100', 6))).not.to.be.reverted
        });

        it("will send Mock Token", async function () {
            await mock.approve(multisender.target, ethers.parseEther('100'))
            expect(await multisender.multisendERC20(mock.target, [user1.address, user2.address, user3.address, user4.address, user5.address, user6.address, user7.address, user8.address, user9.address, user10.address], [ethers.parseEther('10'), ethers.parseEther('10'), ethers.parseEther('10'), ethers.parseEther('10'), ethers.parseEther('10'), ethers.parseEther('10'), ethers.parseEther('10'), ethers.parseEther('10'), ethers.parseEther('10'), ethers.parseEther('10')], ethers.parseEther('100'))).not.to.be.reverted
        });
        it("will send Mock Token", async function () {
            await mock.approve(multisender.target, ethers.parseEther('100'))
            expect(await multisender.multisendERC20(mock.target, [user1.address, user2.address], [ethers.parseEther('10'), ethers.parseEther('10')], ethers.parseEther('20'))).to.changeTokenBalances(mock, [user1.address, user2.address], [ethers.parseEther('10'), ethers.parseEther('10')])
        });
    });
    describe("Multisend NFT", function () {
        beforeEach(async function () {
            await mockNFT.mint(owner.address, 0)
            await mockNFT.mint(owner.address, 1)
            await mockNFT.mint(owner.address, 2)
            await mockNFT.mint(owner.address, 3)
            await mockNFT.mint(owner.address, 4)


        });
        it("will send Mock NFT", async function () {
            await mockNFT.setApprovalForAll(multisender.target, true)
            await expect(multisender.multisendERC721(mockNFT.target, [user1.address, user2.address, user3.address, user4.address, user5.address], [0, 1, 2, 3, 4])).not.to.be.reverted
        });

        it("will revert when NFT sent to smart contract which does not support onERC721received", async function () {
            await mockNFT.setApprovalForAll(multisender.target, true)
            await expect(multisender.multisendERC721(mockNFT.target, [user1.address, mockNFT1.target], [0, 1])).to.be.rejected
        });

        it("will send when NFT sent to smart contract which support onERC721received", async function () {
            await mockNFT.setApprovalForAll(multisender.target, true)
            await expect(multisender.multisendERC721(mockNFT.target, [user1.address, mockNFT.target], [0, 1])).not.to.be.rejected
        });

    });
    describe("Multisend ETH", function () {
        it("will send ETH", async function () {
            expect(await multisender.multisendETH([user1.address, user2.address, user3.address, user4.address, user5.address, user6.address, user7.address, user8.address, user9.address, user10.address], [ethers.parseEther('10'), ethers.parseEther('10'), ethers.parseEther('10'), ethers.parseEther('10'), ethers.parseEther('10'), ethers.parseEther('10'), ethers.parseEther('10'), ethers.parseEther('10'), ethers.parseEther('10'), ethers.parseEther('10')], { value: ethers.parseEther('100') })).not.to.be.reverted
        });

    });
});
