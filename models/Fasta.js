module.exports = (sequelize, Sequelize) => {
    const Fasta = sequelize.define("Fasta", {
        catalogNumber : Sequelize.STRING,
        description: Sequelize.STRING,
        sequence: Sequelize.TEXT,
        scientificName : Sequelize.STRING,
        collectionCode : Sequelize.STRING,
        family : Sequelize.STRING,
        eventDate : Sequelize.STRING,
        recordedBy : Sequelize.STRING,
        country : Sequelize.STRING,
        decimalLatitude : Sequelize.STRING,
        decimalLongitude : Sequelize.STRING,
        institutionCode : Sequelize.STRING,
        identifiedBy: Sequelize.STRING
    });

    return Fasta;
};