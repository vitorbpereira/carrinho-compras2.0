import React, { useState } from "https://esm.sh/react"; // Importa React e o hook useState
import ReactDOM from "https://esm.sh/react-dom"; // Importa ReactDOM para renderização
//import './App.css'; // Importa o arquivo de estilos CSS

const dadosProdutos = [
  { id: 1, nome: "Maçã", preco: 1.5, imagem: "https://i.pinimg.com/originals/84/cc/dc/84ccdcf14badb1fe1030ef3e421dc374.png" },
  { id: 2, nome: "Banana", preco: 1.0, imagem: "https://i.pinimg.com/736x/38/1f/ae/381fae890b6d2e3aef851949e261a13a.jpg" },
  { id: 3, nome: "Laranja", preco: 2.0, imagem: "https://i.pinimg.com/originals/52/08/b0/5208b0e909679fb39313e644b59483d9.png" },
  { id: 4, nome: "Leite", preco: 3.0, imagem: "https://png.pngtree.com/png-vector/20240205/ourmid/pngtree-milk-bottle-dairy-product-png-image_11543900.png" },
  { id: 5, nome: "Pão", preco: 2.5, imagem: "https://i.pinimg.com/originals/b8/bd/dd/b8bdddabafd4892124d854dfecdb4a63.jpg" },
  { id: 6, nome: "Kiwi", preco: 3.00, imagem: "https://i.pinimg.com/736x/58/14/52/581452ef10a7cb0a8d0223e489bb5113.jpg" }
];

function formatarPreco(preco) {
  return `R$ ${preco.toFixed(2)}`;
}

function ListaProdutos({ produtos, adicionarAoCarrinho, termoPesquisa }) {
  const [quantidades, setQuantidades] = useState({});

  const produtosFiltrados = produtos.filter(produto =>
    produto.nome.toLowerCase().includes(termoPesquisa.toLowerCase())
  );

  const handleQuantidadeChange = (id, value) => {
    setQuantidades({
      ...quantidades,
      [id]: value
    });
  };

  const handleAdicionarAoCarrinho = (produto) => {
    const quantidade = quantidades[produto.id] || 1;
    adicionarAoCarrinho(produto, quantidade);
    handleQuantidadeChange(produto.id, 1);
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
              style={{ width: '50px', marginRight: '10px' }} 
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

function Carrinho({ itensCarrinho, removerDoCarrinho, removerItem }) {
  const [quantidadesParaRemover, setQuantidadesParaRemover] = useState({});

  const handleQuantidadeRemoverChange = (index, value) => {
    setQuantidadesParaRemover({
      ...quantidadesParaRemover,
      [index]: value
    });
  };

  const handleRemoverQuantidade = (index) => {
    const quantidadeParaRemover = quantidadesParaRemover[index] || 1;
    removerDoCarrinho(index, quantidadeParaRemover);
    setQuantidadesParaRemover({ ...quantidadesParaRemover, [index]: 1 });
  };

  const total = itensCarrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

  return (
    <div>
      <h2>Carrinho de Compras</h2>
      <ul>
        {itensCarrinho.map((item, index) => (
          <li key={index}>  
            {item.nome} - {formatarPreco(item.preco)} (Quantidade: {item.quantidade})  
            <input
              type="number"
              min="1"
              value={quantidadesParaRemover[index] || 1}
              onChange={(e) => handleQuantidadeRemoverChange(index, Number(e.target.value))}
              style={{ width: '60px', marginLeft: '10px', marginRight: '10px' }}
            />
            <button onClick={() => handleRemoverQuantidade(index)} className="remove-btn">Remover Quantidade</button>
            <button onClick={() => removerItem(index)} className="remove-item-btn" style={{ backgroundColor: 'red', color: 'white' }}>Remover Item</button>
          </li>
        ))}
      </ul>
      <h3>Total: {formatarPreco(total)}</h3> 
    </div>
  );
}

function Recibo({ itensCarrinho, total, onVoltar }) {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f7f9fc' }}> 
      <h2>Recibo</h2>
      <ul>
        {itensCarrinho.map((item, index) => (
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

function App() {
  const [itensCarrinho, setItensCarrinho] = useState([]);
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [finalizarCompra, setFinalizarCompra] = useState(false);

  const adicionarAoCarrinho = (produto, quantidade) => {
    const produtoExistente = itensCarrinho.find(item => item.id === produto.id);

    if (produtoExistente) {
      produtoExistente.quantidade += quantidade;
      setItensCarrinho([...itensCarrinho]);
    } else {
      setItensCarrinho([...itensCarrinho, { ...produto, quantidade }]);
    }
  };

  const removerDoCarrinho = (index, quantidade) => {
    const item = itensCarrinho[index];
    if (item.quantidade > quantidade) {
      item.quantidade -= quantidade;
      setItensCarrinho([...itensCarrinho]);
    } else {
      const novoCarrinho = itensCarrinho.filter((_, i) => i !== index);
      setItensCarrinho(novoCarrinho);
    }
  };

  const removerItem = (index) => {
    const novoCarrinho = itensCarrinho.filter((_, i) => i !== index);
    setItensCarrinho(novoCarrinho);
  };

  const handleFinalizarCompra = () => {
    setFinalizarCompra(true);
  };

  const handleVoltar = () => {
    setItensCarrinho([]);
    setFinalizarCompra(false);
    setTermoPesquisa("");
  };

  const total = itensCarrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

  return (
    <div>
      <h1>Aplicativo de Carrinho de Compras</h1> 
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>  
        <input
          type="text"
          placeholder="Pesquisar produtos..."
          value={termoPesquisa}
          onChange={(e) => setTermoPesquisa(e.target.value)}
          style={{ padding: '10px', width: '50%' }}
        />
      </div>
      <button
        onClick={handleFinalizarCompra}
        style={{
          backgroundColor: 'red',
          color: 'white',
          padding: '10px 15px',
          border: 'none',
          borderRadius: '5px',
          float: 'right',
        }}
      >
        Finalizar Compra
      </button>
      <div className="container" style={{ marginTop: '20px' }}> 
        {!finalizarCompra ? (
          <>
            <ListaProdutos produtos={dadosProdutos} adicionarAoCarrinho={adicionarAoCarrinho} termoPesquisa={termoPesquisa} /> 
            <Carrinho 
              itensCarrinho={itensCarrinho} 
              removerDoCarrinho={removerDoCarrinho} 
              removerItem={removerItem} 
            /> 
          </>
        ) : (
          <Recibo itensCarrinho={itensCarrinho} total={total} onVoltar={handleVoltar} />
        )}
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root")); //necessario utilizar para rodar no Codepen.io
//export default App; // Exporta o componente App para uso em outros lugares 
