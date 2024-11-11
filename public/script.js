//// Variáveis globais 
let clientesData;
let promocaoData;
let foraDeLinhaData;
let listaPrecosData;
let icmsSTData;
//// Variáveis globais 


// Função para carregar os JSONs teste
fetch('/data/cliente.json')
    .then(response => response.json())
    .then(data => {
        clientesData = data;
    });

fetch('/data/Promocao.json')
    .then(response => response.json())
    .then(data => {
        promocaoData = data;
    });

fetch('/data/Fora de linha.json')
    .then(response => response.json())
    .then(data => {
        foraDeLinhaData = data;
    });

fetch('/data/Lista-precos.json')
    .then(response => response.json())
    .then(data => {
        listaPrecosData = data;
    });

fetch('/data/ICMS-ST.json')
    .then(response => response.json())
    .then(data => {
        icmsSTData = data;
    });

// Função para formatar o CNPJ com máscara
function formatarCNPJ(cnpj) {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
}

// Função para formatar o CEP com máscara
function formatarCEP(cep) {
    return cep.replace(/^(\d{5})(\d{3})$/, "$1-$2");
}

// Função para ajustar o CNPJ com zeros à esquerda, se necessário
function ajustarCNPJ(cnpj) {
    while (cnpj.length < 14) {
        cnpj = '0' + cnpj;
    }
    return cnpj;
}

// Função para buscar o produto em promoção
function buscarPromocao(cod) {
    for (let i = 1; i < promocaoData.length; i++) {
        if (promocaoData[i][0] == cod) {
            return promocaoData[i];
        }
    }
    return null;
}

// Função para verificar se o código está fora de linha
function verificarForaDeLinha(cod) {
    for (let i = 1; i < foraDeLinhaData.length; i++) {
        if (foraDeLinhaData[i][0] == cod) {
            return true;
        }
    }
    return false;
}

// Função para buscar dados na Lista de Preços
function buscarListaPrecos(cod) {
    for (let i = 1; i < listaPrecosData.length; i++) {
        if (listaPrecosData[i][2] == cod) {
            return listaPrecosData[i];
        }
    }
    return null;
}

// Função para buscar os dados do cliente pelo CNPJ
function buscarCliente(cnpj) {
    // Ajusta o CNPJ com zeros à esquerda
    cnpj = ajustarCNPJ(cnpj);

    for (let i = 1; i < clientesData.length; i++) {
        let cnpjCliente = ajustarCNPJ(clientesData[i][1].toString());
        if (cnpjCliente === cnpj) {
            return clientesData[i];
        }
    }
    return null;
}



// Função para verificar se o CNPJ é composto apenas de zeros
function cnpjInvalido(cnpj) {
    return /^0+$/.test(cnpj);
}


// Função para preencher os campos ao digitar o CNPJ
document.getElementById('cnpj').addEventListener('blur', function () {
    
    let cnpj = this.value.replace(/\D/g, ''); // Remove caracteres não numéricos

    // Verifica se o campo está vazio
    if (cnpj === '') {
            return; // Sai da função sem buscar dados
    }

    // Verifica se o CNPJ é inválido (apenas zeros)
    if (cnpjInvalido(cnpj)) {
        alert("CNPJ inválido.");
        this.value = ''; // Limpa o campo CNPJ
        return; // Sai da função sem buscar dados
    }


    cnpj = ajustarCNPJ(cnpj);

    // Aplica a máscara ao CNPJ
    this.value = formatarCNPJ(cnpj);

    let cliente = buscarCliente(cnpj);
    if (cliente) {
        document.getElementById('razao_social').value = cliente[3];
        document.getElementById('ie').value = cliente[2];
        document.getElementById('representante').value = `${cliente[15]} - ${cliente[16]}`;
        document.getElementById('endereco').value = cliente[8];
        document.getElementById('bairro').value = cliente[9];
        document.getElementById('cidade').value = cliente[10];
        document.getElementById('uf').value = cliente[11];

        // Aplica a máscara ao CEP
        let cep = cliente[12].toString();
        document.getElementById('cep').value = formatarCEP(cep);

        document.getElementById('telefone').value = cliente[4];
        document.getElementById('email').value = cliente[6];
        document.getElementById('email_fiscal').value = cliente[7];
        document.getElementById('cod_cliente').value = cliente[17];
        document.getElementById('pay').value = cliente[14];
        document.getElementById('group').value = cliente[19];
        document.getElementById('transp').value = cliente[20];
        document.getElementById('codgroup').value = cliente[18];
    } else {
        alert("Cliente não encontrado.");
    }
});

// Função para zerar os campos da tabela "DADOS PEDIDO"
function zerarCamposPedido() {
    const linhas = document.querySelectorAll('#dadosPedido tbody tr');
    linhas.forEach(tr => {
        const inputs = tr.querySelectorAll('input');
        inputs.forEach(input => input.value = ''); // Zera o valor de cada input
    });

    // Atualiza os totais após zerar os campos
    atualizarTotalComImposto();
    atualizarTotalVolumes();
    atualizarTotalProdutos();
}

// Adiciona o evento para zerar os campos quando o tipo de pedido for alterado
document.getElementById('tipo_pedido').addEventListener('change', zerarCamposPedido);

// Função para atualizar o total com imposto de todas as linhas
function atualizarTotalComImposto() {
    let total = 0;
    const linhas = document.querySelectorAll('#dadosPedido tbody tr');
    
    linhas.forEach(tr => {
        const cell = tr.cells[8]?.querySelector('input');
        if (cell && cell.value) {
            const cellValue = cell.value.replace("R$", "").replace(/\./g, "").replace(",", ".");
            const valor = parseFloat(cellValue);
            if (!isNaN(valor)) {
                total += valor;
            }
        }
    });
    
    document.getElementById('total_imp').value = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Função para atualizar o total de volumes (quantidades) de todas as linhas
function atualizarTotalVolumes() {
    let totalVolumes = 0;
    const linhas = document.querySelectorAll('#dadosPedido tbody tr');

    linhas.forEach(tr => {
        const cell = tr.cells[1]?.querySelector('input');
        if (cell && cell.value) {
            const quantidade = parseFloat(cell.value.replace(",", "."));
            if (!isNaN(quantidade)) {
                totalVolumes += quantidade;
            }
        }
    });

    document.getElementById('volume').value = totalVolumes;
}

// Função para atualizar o total de produtos (quantidade * valor unitário)
function atualizarTotalProdutos() {
    let totalProdutos = 0;
    const linhas = document.querySelectorAll('#dadosPedido tbody tr');

    linhas.forEach(tr => {
        const quantidadeCell = tr.cells[1]?.querySelector('input');
        const valorUnitarioCell = tr.cells[6]?.querySelector('input');
        if (quantidadeCell && valorUnitarioCell && quantidadeCell.value && valorUnitarioCell.value) {
            const quantidade = parseFloat(quantidadeCell.value.replace(",", "."));
            const valorUnitario = parseFloat(valorUnitarioCell.value.replace("R$", "").replace(/\./g, "").replace(",", "."));
            if (!isNaN(quantidade) && !isNaN(valorUnitario)) {
                totalProdutos += quantidade * valorUnitario;
            }
        }
    });

    document.getElementById('total').value = totalProdutos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Função para adicionar uma nova linha à tabela
document.getElementById('adicionarLinha').addEventListener('click', function () {
    let tbody = document.querySelector('#dadosPedido tbody');
    let tr = document.createElement('tr');

    for (let i = 0; i < 9; i++) {
        let td = document.createElement('td');
        let input = document.createElement('input');
        input.type = 'text';
        input.style.width = '100%';
        input.style.boxSizing = 'border-box';

        if (i === 0) {
            input.addEventListener('blur', function () {
                let tipoPedido = document.getElementById('tipo_pedido').value;
                let cod = this.value;
                let ufCliente = document.getElementById('uf').value;

                if (verificarForaDeLinha(cod)) {
                    alert("Item fora de linha, favor digitar outro item");
                    this.value = '';
                    return;
                }

                let promocao = buscarPromocao(cod);
                let listaPrecos = buscarListaPrecos(cod);

                if (tipoPedido === 'Promoção') {
                    if (promocao) {
                        preencherLinha(tr, listaPrecos, promocao, ufCliente);
                    } else {
                        alert("Item não está em promoção, digite outro item");
                        this.value = '';
                    }
                } else if (tipoPedido === 'Venda' || tipoPedido === 'Bonificação') {
                    if (promocao) {
                        alert("Item está em promoção, favor mudar o tipo para promoção");
                        this.value = '';
                    } else if (listaPrecos) {
                        preencherLinha(tr, listaPrecos, null, ufCliente);
                    } else {
                        alert("Item não encontrado na lista de preços.");
                        this.value = '';
                    }
                }
            });
        }

        td.appendChild(input);
        tr.appendChild(td);
    }
    tbody.appendChild(tr);
    atualizarTotalComImposto();
    atualizarTotalVolumes();
    atualizarTotalProdutos();
});

// Função para remover a última linha da tabela
document.getElementById('excluirLinha').addEventListener('click', function () {
    let tbody = document.querySelector('#dadosPedido tbody');
    if (tbody.rows.length > 0) {
        tbody.deleteRow(tbody.rows.length - 1);
        atualizarTotalComImposto();
        atualizarTotalVolumes();
        atualizarTotalProdutos();
    } else {
        alert("Nenhuma linha para remover");
    }
});

// Função para verificar duplicatas de código na tabela
function verificarCodigoDuplicado(codigo) {
    const linhas = document.querySelectorAll('#dadosPedido tbody tr');
    let contador = 0;

    linhas.forEach(tr => {
        const inputCodigo = tr.cells[0]?.querySelector('input');
        if (inputCodigo && inputCodigo.value === codigo) {
            contador++;
        }
    });

    return contador > 1;
}

// Função para preencher os dados da linha com os cálculos baseados no IPI e R$ Unitário
function preencherLinha(tr, listaPrecos, promocao = null, ufCliente) { 
    let cells = tr.getElementsByTagName('td');
    let codProduto = cells[0].querySelector('input').value;

    if (verificarCodigoDuplicado(codProduto)) {
        alert(`O código "${codProduto}" já existe na lista. Por favor, digite outro código.`);
        cells[0].querySelector('input').value = '';
        return;
    }

    let codGroup = document.getElementById('codgroup').value;
   
    for (let i = 0; i < cells.length; i++) {
        if (i !== 0 && i !== 1) {
            cells[i].querySelector('input').setAttribute('readonly', true);
        }
    }

    let codigoConcatenado = codGroup ? `${codGroup}-${codProduto}` : codProduto;
    let precoEncontrado = listaPrecosData.find(item => item[0] === codigoConcatenado);

    if (precoEncontrado) {
        cells[5].querySelector('input').value = (precoEncontrado[12] * 100).toFixed(2) + '%';
    } else {
        let itemPorCodigo = listaPrecosData.find(item => item[2] == codProduto);
        if (itemPorCodigo) {
            cells[5].querySelector('input').value = (itemPorCodigo[12] * 100).toFixed(2) + '%';
        } else {
            cells[5].querySelector('input').value = '';
        }
    }

    let produtoPromocao = promocaoData.find(item => item[0] == codProduto);

    if (produtoPromocao) {
        cells[6].querySelector('input').value = Number(produtoPromocao[5]).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    } else {
        let precoEncontrado = listaPrecosData.find(item => item[0] === codigoConcatenado);
        if (precoEncontrado) {
            cells[6].querySelector('input').value = Number(precoEncontrado[11]).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        } else {
            cells[6].querySelector('input').value = '';
        }
    }

    if (codProduto) {
        let ipiStr = cells[5].querySelector('input').value.replace("%", "");
        let ipi = Number(ipiStr) / 100;
        let valorUnitarioStr = cells[6].querySelector('input').value.replace("R$", "").replace(/\./g, "").replace(",", ".");
        let valorUnitario = Number(valorUnitarioStr);

        if (!isNaN(valorUnitario)) {
            let valorComIPI = valorUnitario * (1 + ipi);
            cells[7].querySelector('input').value = valorComIPI.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        } else {
            cells[7].querySelector('input').value = '';
        }
    } else {
        cells[7].querySelector('input').value = '';
    }

    if (listaPrecos) {
        cells[1].querySelector('input').value = '1';
        cells[2].querySelector('input').value = listaPrecos[9];
        cells[3].querySelector('input').value = listaPrecos[10];
        cells[4].querySelector('input').value = listaPrecos[4];
    }

    function atualizarValorTotal() {
        if (codProduto) {
            let quantidade = Number(cells[1].querySelector('input').value);
            let ipiStr = cells[5].querySelector('input').value.replace("%", "");
            let ipi = Number(ipiStr) / 100;
            let valorUnitarioStr = cells[6].querySelector('input').value.replace("R$", "").replace(/\./g, "").replace(",", ".");
            let valorUnitario = Number(valorUnitarioStr);

            if (!isNaN(valorUnitario)) {
                let valorComIPI = valorUnitario * (1 + ipi);
                let valorTotal = valorComIPI * quantidade;
                cells[8].querySelector('input').value = valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

                atualizarTotalComImposto();
                atualizarTotalVolumes();
                atualizarTotalProdutos();
            } else {
                cells[8].querySelector('input').value = '';
            }
        } else {
            cells[8].querySelector('input').value = '';
        }
    }

    cells[1].querySelector('input').addEventListener('input', function() {
        atualizarValorTotal();
        atualizarTotalVolumes();
        atualizarTotalProdutos();
    });
    cells[6].querySelector('input').addEventListener('input', function() {
        atualizarValorTotal();
        atualizarTotalProdutos();
    });
    cells[8].querySelector('input').addEventListener('input', atualizarTotalComImposto);
}

const btcnpjGeneration = document.getElementById('button_cnpj');

btcnpjGeneration.addEventListener("click", () => {
    
    // Obtém o elemento de entrada do CNPJ
    const inputCNPJ = document.getElementById('cnpj');

    // Define o foco no campo de entrada
    inputCNPJ.focus();

});




btPdfGeneration.addEventListener("click", async () => {
    const razaoSocial = document.getElementById('razao_social').value;
    const codCliente = document.getElementById('cod_cliente').value;
    const pdfBase64 = await html2pdf().set(options).from(content).outputPdf('datauristring');

    try {
        const response = await fetch('/send-pdf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ pdfBase64, razaoSocial, codCliente }) // Envia os dados necessários
        });

        const result = await response.text();
        alert(result);
    } catch (error) {
        console.error('Erro ao enviar o PDF:', error);
        alert('Erro ao enviar o PDF por e-mail');
    }
});
