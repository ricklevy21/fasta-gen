module.exports = (sequelize, Sequelize) => {
    const Fasta = sequelize.define("Fasta", {
        SeqID : Sequelize.STRING,
        catalogNumber : Sequelize.STRING,
        sequenceTitle: Sequelize.STRING,
        scientificName : Sequelize.STRING,
        genus : Sequelize.STRING,
        specificEpithet: Sequelize.STRING,
        infraspecificEpithet : Sequelize.STRING,
        taxonRank : Sequelize.STRING,
        species : Sequelize.STRING,
        collectionCode : Sequelize.STRING,
        family : Sequelize.STRING,
        eventDate : Sequelize.STRING,
        recordedBy : Sequelize.STRING,
        country : Sequelize.STRING,
        waterBody : Sequelize.STRING,
        stateProvince : Sequelize.STRING,
        county : Sequelize.STRING,
        municipality : Sequelize.STRING,
        locality : Sequelize.STRING,
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