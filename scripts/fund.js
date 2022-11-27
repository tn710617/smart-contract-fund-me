const { ethers, getNamedAccounts } = require("hardhat")
const main = async () => {
    const { deployer } = await getNamedAccounts()
    const fundMe = await ethers.getContract("FundMe", deployer)
    console.log("funding contract...")
    const trxRes = await fundMe.fund({
        value: ethers.utils.parseEther("0.1"),
    })
    await trxRes.wait(1)
    console.log("funded")
}

main()
    .then(() => {
        process.exit(0)
    })
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
