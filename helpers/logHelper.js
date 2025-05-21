const Model_LogTransaksi = require('../model/Model_LogTransaksi');

const createLogTransaksi = async (idPemesanan, statusTransaksi, keterangan) => {
    try {
        const logData = {
            id_pemesanan: idPemesanan,
            status_transaksi: statusTransaksi,
            keterangan: keterangan,
            waktu: new Date()
        };
        
        await Model_LogTransaksi.store(logData);
        return true;
    } catch (error) {
        console.error('Gagal membuat log transaksi:', error);
        return false;
    }
};

module.exports = { createLogTransaksi };