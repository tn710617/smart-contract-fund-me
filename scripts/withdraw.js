const { ethers, getNamedAccounts } = require("hardhat")
const main = async () => {
    const { deployer } = await getNamedAccounts()
    const fundMe = await ethers.getContract("FundMe", deployer)
    console.log("withdraw...")
    const trxRes = await fundMe.withdraw()
    await trxRes.wait(1)
    console.log("withdrawn")
}

main()
    .then(() => {
        process.exit(0)
    })
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
