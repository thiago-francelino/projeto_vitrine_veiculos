# projeto_vitrine_veiculos

Documentação projeto vitrine de carros

* Instruções do projeto

  As funcionalidades de armazenamento de imagem e validação de todas as requisições não funcionam completamente, a validação JWT somente    valida o usuário no momento do clique do botão sing in, e a imagem só tem o input, além disso alguns nomes ficaram metade em inglês e a   outra metade em português pois o CORS travou algumas requisições se estivessem com nome de rota diferente.

* Criação das tabelas no banco de dados postegres

  CREATE TABLE login_user
  (
      id_user serial,
      email varchar(255) NOT NULL,
      "password" varchar(255) NOT NULL,
      CONSTRAINT login_user_pkey PRIMARY KEY (id_user)
  );
  
  CREATE TABLE car
  (
      car_id serial,
      car_name varchar(255) NOT NULL,
      brand varchar(255) NOT NULL,
      model varchar(255) NOT NULL,
      image varchar(255),
      price numeric(10,2) NOT NULL,
      CONSTRAINT cars_pkey PRIMARY KEY (car_id)
  );

* Criação de um carro

  Na home o primeiro card tem os inputs e um botão de criar, ao clicar em criar a função createCar declarada no home.componente.ts é chamada ela pega os valores dos elementos de input html e faz uma requisição html pro backend usando método post. A função create_car do python faz o insert dos dados passados na requisição no banco de dados.

* Construção dos cards na view

  logo após o primeiro card que tem a função de criação de registros ficam dispostos os registros criados, a generateCarCards gera os cards na view adiciona os inputs, elementos, e funcionalidades como a de edição e deleção ela aciona a função get_car do backend que faz um select no banco e ordena por valor.

* Edição de um carro

  A função generateCarCards adiciona a funcionalidade de edição que ao clicar em um campo ele fica em foco podendo ser feita a alteração do mesmo, ao clicar a tecla enter a função saveCarInfo é chamada e faz uma requisição pro backend passando os valores do card que foi alterado a função update_car é acionada assim fazendo um update na tabela carros.

* Deleção dos carros

  Na função generateCarCards é criado um botão que aciona a função deleteCar essa função faz uma requisição pro banco passando o id do carro para a função delete_car do back end que executa uma deleção na tabela de carros.

* Criação e validação do usuário

  No menu de login existem os inputs de e-mail e senha, além de dois botões, sing in e sing up, sing up aciona a função userCreate que aciona a função create_login do backend fazendo um insert na tabela login_user, o botão sing in aciona a função login que faz uma requisição para a função login do backend e procura no banco um registro com mesmo e-mail informado e valida a senha, se a senha for valida a função login chama a função identity que faz uma pesquisa no banco e retorna o objeto usuário após isso o token é criado e  enviado pro frontend para ser armazenado localmente

