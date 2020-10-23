module.exports = (sequelize, Sequelize) => {
    const Fasta = sequelize.define("Fasta", {
        catalogNumber : Sequelize.STRING,
        description: Sequelize.STRING,
        sequence: Sequelize.TEXT
    });

    return Fasta;
};