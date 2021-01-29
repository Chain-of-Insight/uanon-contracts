const { outputFile } = require('fs-extra');
module.exports = (name, address, network) => {
    return outputFile(
        `${process.cwd()}/deployments/${network}/${name}.js`,
        `module.exports = "${address}";`
    );
};