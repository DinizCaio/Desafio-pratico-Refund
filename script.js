// Capturando elementos do DOM.
const form = document.querySelector("form");
const amount = document.querySelector("#amount");
const expense = document.querySelector("#expense");
const category = document.querySelector("#category");
const expensesList = document.querySelector("ul");
const quantity = document.querySelector("#quantity");
const total = document.querySelector("#total");

// Captura evento de input do elemento amount.
amount.oninput = () => {
  // Obtém o valor atual do input e remove os caracteres não numéricos.
  let value = amount.value.replace(/\D/g, "");

  // Converte o valor para número e o transforma em centavos.
  value = Number(value) / 100;

  //Atualiza o valor do input com o valor formatado em reais.
  amount.value = formatCurrencyBRL(value);
};

// Função para formatar o valor em reais.
function formatCurrencyBRL(value) {
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  return value;
}

// Captura evento de submit do formulário.
form.onsubmit = (event) => {
  // Previne o comportamento padrão de recarregar a página.
  event.preventDefault();

  // Cria um objeto com detalhes da nova despesa.
  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date(),
  };

  // Chama a função para adicionar a nova despesa na lista.
  expenseAdd(newExpense);
};

// Cria o elemento e o adiciona na lista.
function expenseAdd(newExpense) {
  try {
    // Cria elemento li e adiciona a classe.
    const expenseItem = document.createElement("li");
    expenseItem.classList.add("expense");

    // Cria o elemento img, define o src e alt de acordo com a categoria.
    const typeIcon = document.createElement("img");
    typeIcon.setAttribute("src", `./img/${newExpense.category_id}.svg`);
    typeIcon.setAttribute("alt", `Ícone de tipo da despesa`);

    // Cria o elemento div e adiciona a classe.
    const expenseInfo = document.createElement("div");
    expenseInfo.classList.add("expense-info");

    // Cria o elemento strong, define o texto como o nome da despesa.
    const expenseName = document.createElement("strong");
    expenseName.textContent = newExpense.expense;

    // Cria o elemento span, define o texto com a categoria da despesa.
    const expenseCategory = document.createElement("span");
    expenseCategory.textContent = newExpense.category_name;

    // Adiciona os elementos filhos (expenseName e expenseCategory) ao elemento pai (expenseInfo).
    expenseInfo.append(expenseName, expenseCategory);

    // Cria o elemento span e adiciona a classe, define o innerHTML como o texto já formatado com o valor da despesa.
    const expenseAmount = document.createElement("span");
    expenseAmount.classList.add("expense-amount");
    expenseAmount.innerHTML = `<small>R$</small> ${newExpense.amount.toUpperCase().replace("R$", "")}`;

    // Cria o elemento img, adiciona a classe e define src e o alt.
    const removeIcon = document.createElement("img");
    removeIcon.classList.add("remove-icon");
    removeIcon.setAttribute("src", "./img/remove.svg");
    removeIcon.setAttribute("alt", "Ícone de remover");

    // Adiciona os elementos filhos (typeIcon, expenseInfo, expenseAmount e removeIcon) ao elemento pai (expenseItem).
    expenseItem.append(typeIcon, expenseInfo, expenseAmount, removeIcon);

    // Adiciona o elemento expenseItem à lista de despesas.
    expensesList.appendChild(expenseItem);

    // Chama a função para atualizar a quantidade de despesas.
    updateQuantity();

    // Chama a função para limpar os campos do formulário.
    clearForm();
  } catch (error) {}
}

//Função para atualizar a quantidade de despesas na lista e o valor total.
function updateQuantity() {
  try {
    // Obtém a quantidade de despesas na lista.
    const expensesQuantity = expensesList.children;

    // Atualiza o texto do elemento quantity com a quantidade de despesas.
    quantity.textContent = `${expensesQuantity.length} ${expensesQuantity.length > 1 ? "despesas" : "despesa"}`;

    // Inicializa a variável totalAmount para calcular o valor total das despesas.
    let totalAmount = 0;

    // Itera sobre cada item da lista de despesas para extrair o valor e somar ao totalAmount.
    for (let item = 0; item < expensesQuantity.length; item++) {
      const itemAmount =
        expensesQuantity[item].querySelector(".expense-amount");

      // Extrai o valor do texto do item, removendo os caracteres não numéricos e substituindo a vírgula por ponto para conversão correta.
      let value = itemAmount.textContent
        .replace(/[^\d,]/g, "")
        .replace(",", ".");

      // Converte o valor para número de ponto flutuante.
      value = parseFloat(value);

      // Verifica se o valor é um número válido antes de somar ao totalAmount.
      if (isNaN(value)) {
        return alert(
          "Não foi possível calcular o total. O valor não parece ser um número.",
        );
      }

      // Incrementa o totalAmount com o valor da despesa atual.
      totalAmount += value;
    }

    // Atualiza o texto do elemento total com o valor total formatado em reais.
    total.innerHTML = `<small>R$</small>${String(totalAmount.toFixed(2)).replace(".", ",")}`;
  } catch (error) {
    console.log(error);
    alert("Não foi possível atualizar os totais. Por favor, tente novamente.");
  }
}

// Captura evento de clique na lista de despesas para remover um item.
expensesList.onclick = (event) => {
  // Verifica se o elemento clicado é o ícone de remover.
  if (event.target.classList.contains("remove-icon")) {
    // Obtém o elemento pai do ícone de remover, que é o item da despesa.
    const removeItem = event.target.parentElement;

    // Remove o item da despesa da lista.
    removeItem.remove();

    // Chama a função para atualizar a quantidade de despesas e o total após a remoção.
    updateQuantity();
  }
};

// Limpa os campos do formulário.
function clearForm() {
  expense.value = "";
  category.value = "";
  amount.value = "";
}
