const { ethers } = require("hardhat");

const ZERO_HASH = '0x0000000000000000000000000000000000000000000000000000000000000000';

module.exports = async ({getNamedAccounts, deployments, network}) => {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();

    if(network.tags.legacy) {
        const contract = await deploy('LegacyENSRegistry', {
            from: deployer,
            args: [],
            log: true,
            contract: await deployments.getArtifact('ENSRegistry')
        });
        await deploy('ENSRegistry', {
            from: deployer,
            args: [contract.address],
            log: true,
            contract: await deployments.getArtifact('ENSRegistryWithFallback')
        });    
    } else {
        await deploy('ENSRegistry', {
            from: deployer,
            args: [],
            log: true,
        });    
    }

    return true;
};
module.exports.tags = ['registry'];
module.exports.id = "ens";
