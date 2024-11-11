exports.sendPdf = async (req, res) => {
    const { pdfBase64, razaoSocial, codCliente } = req.body; // Recebe os dados necessários

    if (!pdfBase64) {
        return res.status(400).send('Nenhum PDF foi recebido.');
    }

    try {
        // Simplesmente retorna uma mensagem de sucesso sem enviar e-mail
        res.status(200).send('Processo concluído.');
    } catch (error) {
        console.error('Erro ao processar o pedido:', error);
        res.status(500).send('Erro ao processar o pedido.');
    }
};
