module.exports = (sequelize, Sequelize) => {
    const Fasta = sequelize.define("Fasta", {
        SeqID : Sequelize.STRING,
        catalogNumber : Sequelize.STRING,
        description: Sequelize.STRING,
        scientificName : Sequelize.STRING,
        collectionCode : Sequelize.STRING,
        family : Sequelize.STRING,
        eventDate : Sequelize.STRING,
        recordedBy : Sequelize.STRING,
        country : Sequelize.STRING,
        decimalLatitude : Sequelize.STRING,
        decimalLongitude : Sequelize.STRING,
        institutionCode : Sequelize.STRING,
        identifiedBy: Sequelize.STRING,
        user: Sequelize.STRING,
        ITS : Sequelize.TEXT,
        ITS1 : Sequelize.TEXT,
        ITS2 : Sequelize.TEXT,
        SSUrRNA_18s : Sequelize.TEXT,
        LSUrRNA_28s : Sequelize.TEXT
    });

    return Fasta;
};