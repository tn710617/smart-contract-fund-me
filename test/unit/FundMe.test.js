const { deployments, ethers, getNamedAccounts, network } = require("hardhat")
const { assert, expect } = require("chai")
const { developmentChainIds } = require("../../helper-hardhat-config")

!developmentChainIds.includes(network.config.chainId)
    ? describe.skip
    : describe("FundMe", async function () {
          let fundMe
          let MockV3Aggregator
          let deployer
          const sentValue = ethers.utils.parseEther("1")
          beforeEach(async function () {
              // getSigners 會取得該 network 所有的 account, 比如
              // network.Goerli.accounts
              // const accounts = await ethers.getSigners()
              deployer = (await getNamedAccounts()).deployer
              // 會執行 deploy dir 中, 所有 tags 有 'all' 的 deploy file
              await deployments.fixture(["all"])
              // 取得最新 deployment 中的 FundMe contract
              // 且為 deployer 為該 address 的 FundMe contract
              fundMe = await ethers.getContract("FundMe", deployer)
              MockV3Aggregator = await ethers.getContract(
                  "MockV3Aggregator",
                  deployer
              )
          })
          describe("constructor", async function () {
              it("sets the aggregator address correctly", async function () {
                  const expectedPriceFeedAddress = MockV3Aggregator.address
                  assert.equal(
                      await fundMe.getPriceFeed(),
                      expectedPriceFeedAddress
                  )
              })
          })
          describe("fund", async function () {
              it("should send enough fund", async function () {
                  expect(fundMe.fund()).to.be.revertedWith(
                      "You need to spend more ETH!"
                  )
              })

              it("updated the amount funded data structure", async function () {
                  await fundMe.fund({ value: sentValue.toString() })
                  actualSentValue = await fundMe.getAddressToAmountFunded(
                      deployer
                  )
                  assert.equal(actualSentValue, sentValue.toString())
              })
              it("can get funder", async function () {
                  await fundMe.fund({ value: sentValue.toString() })
                  const funder = await fundMe.getFunder(0)
                  assert.equal(funder, deployer)
              })
          })
          describe("withdraw", async function () {
              beforeEach(async function () {
                  await fundMe.fund({ value: sentValue.toString() })
              })
              it("can withdraw", async function () {
                  const balanceBeforeWithdraw =
                      await ethers.provider.getBalance(fundMe.address)
                  const balanceOfWithdrawer = await ethers.provider.getBalance(
                      deployer
                  )

                  transactionResponse = await fundMe.withdraw()
                  transactionReceipt = await transactionResponse.wait(1)

                  const balanceOfContractAfterWithdraw =
                      await ethers.provider.getBalance(fundMe.address)
                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)
                  const balanceOfDeployerAfterWithdraw =
                      await ethers.provider.getBalance(deployer)
                  const expectedBalanceOfDeployerAfterWithdraw =
                      balanceOfWithdrawer.add(balanceBeforeWithdraw)

                  assert.equal(balanceOfContractAfterWithdraw, 0)
                  assert.equal(
                      balanceOfDeployerAfterWithdraw.add(gasCost).toString(),
                      expectedBalanceOfDeployerAfterWithdraw.toString()
                  )
              })

              it("can withdraw cheaperly", async function () {
                  const balanceBeforeWithdraw =
                      await ethers.provider.getBalance(fundMe.address)
                  const balanceOfWithdrawer = await ethers.provider.getBalance(
                      deployer
                  )

                  transactionResponse = await fundMe.cheaperWithdraw()
                  transactionReceipt = await transactionResponse.wait(1)

                  const balanceOfContractAfterWithdraw =
                      await ethers.provider.getBalance(fundMe.address)
                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)
                  const balanceOfDeployerAfterWithdraw =
                      await ethers.provider.getBalance(deployer)
                  const expectedBalanceOfDeployerAfterWithdraw =
                      balanceOfWithdrawer.add(balanceBeforeWithdraw)

                  assert.equal(balanceOfContractAfterWithdraw, 0)
                  assert.equal(
                      balanceOfDeployerAfterWithdraw.add(gasCost).toString(),
                      expectedBalanceOfDeployerAfterWithdraw.toString()
                  )
              })
              it("can withdraw multiple funders", async () => {
                  const accounts = await ethers.getSigners()

                  for (let i = 1; i <= 6; i++) {
                      const connectedAcount = fundMe.connect(accounts[i])
                      connectedAcount.fund({ value: sentValue })
                  }

                  const deployerBalanceBeforeWithdrawing =
                      await ethers.provider.getBalance(deployer)
                  const contractBalanceBeforeWithdrawing =
                      await ethers.provider.getBalance(fundMe.address)

                  transactionRes = await fundMe.withdraw()
                  trxRecepit = await transactionRes.wait(1)

                  const deployerBalanceAfterWithdrawing =
                      await ethers.provider.getBalance(deployer)
                  const contractAddressAfterWithdrawing =
                      await ethers.provider.getBalance(fundMe.address)

                  const { gasUsed, effectiveGasPrice } = trxRecepit
                  const gasCost = gasUsed.mul(effectiveGasPrice)

                  assert.equal(
                      contractBalanceBeforeWithdrawing
                          .add(deployerBalanceBeforeWithdrawing)
                          .toString(),
                      deployerBalanceAfterWithdrawing.add(gasCost).toString()
                  )

                  assert.equal(contractAddressAfterWithdrawing, 0)

                  await expect(fundMe.getFunder(0)).to.be.reverted

                  for (let i = 1; i <= 6; i++) {
                      assert.equal(
                          await fundMe.getAddressToAmountFunded(
                              accounts[i].address
                          ),
                          0
                      )
                  }
              })
              it("cheaper withdraw", async () => {
                  const accounts = await ethers.getSigners()

                  for (let i = 1; i <= 6; i++) {
                      const connectedAcount = fundMe.connect(accounts[i])
                      connectedAcount.fund({ value: sentValue })
                  }

                  const deployerBalanceBeforeWithdrawing =
                      await ethers.provider.getBalance(deployer)
                  const contractBalanceBeforeWithdrawing =
                      await ethers.provider.getBalance(fundMe.address)

                  transactionRes = await fundMe.cheaperWithdraw()
                  trxRecepit = await transactionRes.wait(1)

                  const deployerBalanceAfterWithdrawing =
                      await ethers.provider.getBalance(deployer)
                  const contractAddressAfterWithdrawing =
                      await ethers.provider.getBalance(fundMe.address)

                  const { gasUsed, effectiveGasPrice } = trxRecepit
                  const gasCost = gasUsed.mul(effectiveGasPrice)

                  assert.equal(
                      contractBalanceBeforeWithdrawing
                          .add(deployerBalanceBeforeWithdrawing)
                          .toString(),
                      deployerBalanceAfterWithdrawing.add(gasCost).toString()
                  )

                  assert.equal(contractAddressAfterWithdrawing, 0)

                  await expect(fundMe.getFunder(0)).to.be.reverted

                  for (let i = 1; i <= 6; i++) {
                      assert.equal(
                          await fundMe.getAddressToAmountFunded(
                              accounts[i].address
                          ),
                          0
                      )
                  }
              })

              it("only allows deployer to withdraw", async () => {
                  const accounts = await ethers.getSigners()
                  const attacker = accounts[1]
                  const attackerConnctedContract = await fundMe.connect(
                      attacker
                  )
                  await expect(
                      attackerConnctedContract.withdraw()
                  ).to.be.revertedWithCustomError(fundMe, "FundMe__NotOwner")
              })
          })
      })
