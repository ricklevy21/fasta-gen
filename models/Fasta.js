module.exports = function(sequelize, DataTypes) {
    var Fasta = sequelize.define("Fasta", {
        catalogNumber : DataTypes.STRING,
        description: DataTypes.STRING,
        sequence: DataTypes.TEXT
    });

    return Fasta;
};