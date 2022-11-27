const { ethers, getNamedAccounts, network } = require("hardhat")
const { assert } = require("chai")
const { developmentChainIds } = require("../../helper-hardhat-config")

developmentChainIds.includes(network.config.chainId)
    ? describe.skip
    : describe("FundMe", async function () {
          let fundMe
          let deployer
          const sentValue = ethers.utils.parseEther("1")

          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              fundMe = await ethers.getContract("FundMe", deployer)
          })
          it("can withdraw and fund", async function () {
              await fundMe.fund({ value: sentValue })
              await fundMe.withdraw()

              const contractBalance = await ethers.provider.getBalance(
                  fundMe.address
              )

              assert.equal(contractBalance.toString(), 0)
          })
      })
