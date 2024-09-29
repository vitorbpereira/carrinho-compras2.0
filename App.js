import React, { useState } from 'react'; // Importa React e o hook useState
import ReactDOM from "https://esm.sh/react-dom"; // Importa ReactDOM para renderização
import './App.css'; // Importa o arquivo de estilos CSS

// Define um array de produtos com id, nome, preço e imagem do item
const dadosProdutos = [
  { id: 1, nome: "Maçã", preco: 1.5, imagem: "https://i.pinimg.com/originals/84/cc/dc/84ccdcf14badb1fe1030ef3e421dc374.png" },
  { id: 2, nome: "Banana", preco: 1.0 , imagem: "https://i.pinimg.com/736x/38/1f/ae/381fae890b6d2e3aef851949e261a13a.jpg"},
  { id: 3, nome: "Laranja", preco: 2.0 , imagem:"https://i.pinimg.com/originals/52/08/b0/5208b0e909679fb39313e644b59483d9.png"},
  { id: 4, nome: "Leite", preco: 3.0 , imagem:"https://png.pngtree.com/png-vector/20240205/ourmid/pngtree-milk-bottle-dairy-product-png-image_11543900.png"},
  { id: 5, nome: "Pão", preco: 2.5 , imagem:"https://i.pinimg.com/originals/b8/bd/dd/b8bdddabafd4892124d854dfecdb4a63.jpg"},
  { id: 6, nome: "Kiwi", preco: 3.00 , imagem:"https://i.pinimg.com/736x/58/14/52/581452ef10a7cb0a8d0223e489bb5113.jpg"}
];

// Função para formatar o preço em reais
function formatarPreco(preco) {
  return `R$ ${preco.toFixed(2)}`; // Retorna o preço formatado com duas casas decimais
}

// Componente que exibe a lista de produtos
function ListaProdutos({ produtos, adicionarAoCarrinho, termoPesquisa }) {
  const [quantidades, setQuantidades] = useState({}); // Estado para armazenar as quantidades dos produtos

  // Filtra os produtos com base no termo de pesquisa
  const produtosFiltrados = produtos.filter(produto =>
    produto.nome.toLowerCase().includes(termoPesquisa.toLowerCase()) // Ignora maiúsculas/minúsculas
  );

  // Função para lidar com a mudança da quantidade
  const handleQuantidadeChange = (id, value) => {
    setQuantidades({
      ...quantidades,
      [id]: value // Atualiza a quantidade do produto específico
    });
  };

  // Função para adicionar o produto ao carrinho
  const handleAdicionarAoCarrinho = (produto) => {
    const quantidade = quantidades[produto.id] || 1; // Pega a quantidade ou 1 se não estiver definida
    adicionarAoCarrinho(produto, quantidade); // Adiciona ao carrinho
    handleQuantidadeChange(produto.id, 1); // Reseta a quantidade para 1 após adicionar
  };

  return (
    <div>
      <h2>Produtos</h2>
      <ul>
        {produtosFiltrados.map((produto) => (
          <li key={produto.id}>
            <img 
              src={produto.imagem} 
              alt={produto.nome} 
              style={{ width: '50px', marginRight: '10px' }} // Ajuste o estilo conforme necessário
            />
            {produto.nome} - {formatarPreco(produto.preco)}
            <input
              type="number"
              min="1"
              value={quantidades[produto.id] || 1}
              onChange={(e) => handleQuantidadeChange(produto.id, Number(e.target.value))}
              style={{ width: '60px', marginLeft: '10px', marginRight: '10px' }}
            />
            <button onClick={() => handleAdicionarAoCarrinho(produto)}>Adicionar ao Carrinho</button>
          </li>
        ))}
      </ul>
    </div>
  );  
}

// Componente que exibe o carrinho de compras
function Carrinho({ itensCarrinho, removerDoCarrinho }) {
  // Calcula o total do carrinho
  const total = itensCarrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

  return (
    <div>
      <h2>Carrinho de Compras</h2>
      <ul>
        {itensCarrinho.map((item, index) => ( // Mapeia os itens do carrinho | Cada item da lista | Exibe nome, preço e quantidade | Exibe o total do carrinho
          <li key={index}>  
            {item.nome} - {formatarPreco(item.preco)} (Quantidade: {item.quantidade})  
            <button onClick={() => removerDoCarrinho(index)} className="remove-btn">Remover</button>  
          </li>
        ))}
      </ul>
      <h3>Total: {formatarPreco(total)}</h3> 
    </div>
  );
}

// Componente que exibe o recibo após a compra
function Recibo({ itensCarrinho, total, onVoltar }) {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f7f9fc' }}> 
      <h2>Recibo</h2>
      <ul>
        {itensCarrinho.map((item, index) => ( // Mapeia os itens do carrinho | Cada item da lista | Exibe informações do item | Exibe o total da compra | Botão para voltar ao carrinho
          <li key={index}> 
            {item.nome} - {formatarPreco(item.preco)} (Quantidade: {item.quantidade}) - Total: {formatarPreco(item.preco * item.quantidade)}  
          </li>
        ))}
      </ul>
      <h3>Total da Compra: {formatarPreco(total)}</h3> 
      <button onClick={onVoltar} className="voltar-btn">Voltar</button>  
    </div>
  );
}

// Componente principal do aplicativo
function App() {
  const [itensCarrinho, setItensCarrinho] = useState([]); // Estado para armazenar os itens do carrinho
  const [termoPesquisa, setTermoPesquisa] = useState(""); // Estado para armazenar o termo de pesquisa
  const [finalizarCompra, setFinalizarCompra] = useState(false); // Estado para controlar se a compra foi finalizada

  // Função para adicionar um produto ao carrinho
  const adicionarAoCarrinho = (produto, quantidade) => {
    const produtoExistente = itensCarrinho.find(item => item.id === produto.id); // Verifica se o produto já está no carrinho

    if (produtoExistente) {
      produtoExistente.quantidade += quantidade; // Se existir, aumenta a quantidade
      setItensCarrinho([...itensCarrinho]); // Atualiza o estado do carrinho
    } else {
      setItensCarrinho([...itensCarrinho, { ...produto, quantidade }]); // Se não existir, adiciona ao carrinho
    }
  };

  // Função para remover um item do carrinho
  const removerDoCarrinho = (index) => {
    const novoCarrinho = itensCarrinho.filter((_, i) => i !== index); // Filtra os itens, removendo o escolhido
    setItensCarrinho(novoCarrinho); // Atualiza o estado do carrinho
  };

  // Função para finalizar a compra
  const handleFinalizarCompra = () => {
    setFinalizarCompra(true); // Muda o estado para indicar que a compra foi finalizada
  };

  // Função para voltar ao carrinho
  const handleVoltar = () => {
    setItensCarrinho([]); // Limpa o carrinho ao voltar
    setFinalizarCompra(false); // Reseta o estado de finalização da compra
    setTermoPesquisa(""); // Reseta o termo de pesquisa
  };

  // Calcula o total do carrinho
  const total = itensCarrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
  //Contêiner para centralizar a caixa de pesquisa
  return (
    <div>
      <h1>Aplicativo de Carrinho de Compras</h1> 
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>  
        <input
          type="text"
          placeholder="Pesquisar produtos..." // Texto do placeholder
          value={termoPesquisa} // Valor da caixa de pesquisa
          onChange={(e) => setTermoPesquisa(e.target.value)} // Atualiza o estado do termo de pesquisa
          style={{ padding: '10px', width: '50%' }} // Estilos da caixa de pesquisa
        />
      </div>
      <button
        onClick={handleFinalizarCompra} // Chama a função para finalizar a compra
        style={{
          backgroundColor: 'red', // Cor de fundo do botão
          color: 'white', // Cor do texto
          padding: '10px 15px', // Estilo de padding do botão
          border: 'none', // Remove a borda padrão
          borderRadius: '5px', // Arredonda os cantos do botão
          float: 'right', // Alinha o botão à direita
        }}
        // Contêiner principal para os produtos e o carrinho | Exibe o carrinho | Exibe a lista de produtos | 
      >
        Finalizar Compra
      </button>
      <div className="container" style={{ marginTop: '20px' }}> 
        {!finalizarCompra ? ( // Se não foi finalizada a compra
          <>
            <ListaProdutos produtos={dadosProdutos} adicionarAoCarrinho={adicionarAoCarrinho} termoPesquisa={termoPesquisa} /> 
            <Carrinho itensCarrinho={itensCarrinho} removerDoCarrinho={removerDoCarrinho} /> 
          </>
        ) : (
          <Recibo itensCarrinho={itensCarrinho} total={total} onVoltar={handleVoltar} /> // Exibe o recibo se a compra foi finalizada
        )}
      </div>
    </div>
  );  
}

//ReactDOM.render(<App />, document.getElementById("root")); necessario utilizar para rodar no Codepen.io
export default App; // Exporta o componente App para uso em outros lugares 
