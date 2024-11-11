// Importar a biblioteca do SendGrid
const sgMail = require('@sendgrid/mail');


// Configurar a API Key do SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

console.log(process.env.SENDGRID_API_KEY)

exports.sendPdf = async (req, res) => {


    const { pdfBase64, razaoSocial, codCliente } = req.body; // Recebe os dados necessários

    if (!pdfBase64) {
        return res.status(400).send('Nenhum PDF foi recebido.');
    }

    try {

        const subject = `Pedido de Venda ${razaoSocial} - ${codCliente}`;
        const fileName = `Pedido de Venda ${razaoSocial} - ${codCliente}.pdf`;

        // Configurando o e-mail com SendGrid
        const msg = {
            to: ['alxnvn@yahoo.com.br','alex.lima@kidszoneworld.com.br'] ,// Substitua pelo destinatário real
            from: 'alex.lima@kidszoneworld.com.br', // Precisa ser um endereço verificado no SendGrid
            subject: subject,
            text: `Segue em anexo o PDF gerado para o cliente : ${razaoSocial}`,
            attachments: [
                {
                    content: pdfBase64.split("base64,")[1], // Remove a parte 'data:application/pdf;base64,'
                    filename: fileName,
                    type: 'application/pdf',
                    disposition: 'attachment'
                }
            ]
        };

        // Envia o e-mail usando SendGrid
        await sgMail.send(msg);

        res.status(200).send('E-mail enviado com sucesso!');
    } catch (error) {
        console.error('Erro ao enviar o e-mail:', error);
        res.status(500).send('Erro ao enviar o e-mail');
    }
};

