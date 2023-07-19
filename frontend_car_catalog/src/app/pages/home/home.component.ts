import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


  carros: any[] = [];

  constructor(private http: HttpClient) { }


  ngOnInit(): void {
    this.http.get<any[]>('http://127.0.0.1:5000/carros')
      .subscribe((response) => {
        const carros = response;
        console.log(carros);
        this.carros = response as any[];
        generateCarCards(carros);
      }, (error) => {
        console.error(error);
      });
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const createButton = document.querySelector('.create-button');

  if (createButton) {
    createButton.addEventListener('click', createCar)
  }
});
//utiliza o html fixo "car-card" para receber os inputs e fazer uma requisição ao backend
function createCar() {
  const carNameInput = document.querySelector('.car-name-create') as HTMLInputElement;
  const carPriceInput = document.querySelector('.car-price-create') as HTMLInputElement;
  const carModelInput = document.querySelector('.car-model-create') as HTMLInputElement;
  const carBrandInput = document.querySelector('.car-brand-create') as HTMLInputElement;

  if (carNameInput && carPriceInput && carModelInput && carBrandInput) {
    const carName = carNameInput.value;
    const carPrice = parseFloat(carPriceInput.value);
    const carModel = carModelInput.value;
    const carBrand = carBrandInput.value;

    fetch(`http://127.0.0.1:5000/create_carros/${carName}/${carPrice.toString()}/${carModel}/${carBrand}`, {
      method: 'POST'
    })
      .then(response => {
        if (response.ok) {
          console.log('Registro criado com sucesso');
        } else {
          console.error('Erro ao criar o registro');
        }
      })
      .catch(error => {
        console.error('Erro ao criar o registro', error);
      });
  }
}


//essa função cria os cards com base nos registros retornados do banco de dados
//para editar um registro basta clicar nele, fazer as alterações e clicar no enter
//a função também cria o botão delete e ja atribui estilo aos elementos
function generateCarCards(carros: any[]) {
  const carCatalog = document.querySelector('.car-catalog');

  if (carCatalog) {
    carros.forEach(carro => {
      const carCard = document.createElement('div');
      carCard.classList.add('car-card');

      const carImage = document.createElement('input');
      carImage.type = 'file';
      carImage.addEventListener('change', previewImage);

      const carImageContainer = document.createElement('div');

      const carNameContainer = document.createElement('div');
      carNameContainer.classList.add('car-field');

      const carNameLabel = document.createElement('label');
      carNameLabel.textContent = 'Nome:';

      const carName = document.createElement('input');
      carName.classList.add('car-name');
      carName.type = 'text';
      carName.value = carro[1];
      carName.readOnly = true;

      carNameContainer.appendChild(carNameLabel);
      carNameContainer.appendChild(carName);


      carImageContainer.classList.add('car-image-container');

      const carPreviewImage = document.createElement('img');
      carPreviewImage.classList.add('car-preview-image');
      carImageContainer.appendChild(carPreviewImage);

      const carPriceContainer = document.createElement('div');
      carPriceContainer.classList.add('car-field');

      const carPriceLabel = document.createElement('label');
      carPriceLabel.textContent = 'Valor:';

      const carPrice = document.createElement('input');
      carPrice.classList.add('car-price');
      carPrice.type = 'number';
      carPrice.value = carro[5];
      carPrice.readOnly = true;

      carPriceContainer.appendChild(carPriceLabel);
      carPriceContainer.appendChild(carPrice);

      const carModelContainer = document.createElement('div');
      carModelContainer.classList.add('car-field');

      const carModelLabel = document.createElement('label');
      carModelLabel.textContent = 'Modelo:';

      const carModel = document.createElement('input');
      carModel.classList.add('car-model');
      carModel.type = 'text';
      carModel.value = carro[3];
      carModel.readOnly = true;

      carModelContainer.appendChild(carModelLabel);
      carModelContainer.appendChild(carModel);

      const carBrandContainer = document.createElement('div');
      carBrandContainer.classList.add('car-field');

      const carBrandLabel = document.createElement('label');
      carBrandLabel.textContent = 'Marca:';

      const carBrand = document.createElement('input');
      carBrand.classList.add('car-brand');
      carBrand.type = 'text';
      carBrand.value = carro[2];
      carBrand.readOnly = true;

      carBrandContainer.appendChild(carBrandLabel);
      carBrandContainer.appendChild(carBrand);

      const deleteButton = document.createElement('button');
      deleteButton.classList.add('delete-button');
      deleteButton.textContent = 'Excluir';

      deleteButton.addEventListener('click', () => {
        deleteCar(carro[0]);
        carCard.remove();
      });

      carCard.appendChild(carImage);
      carCard.appendChild(carNameContainer);
      carCard.appendChild(carPriceContainer);
      carCard.appendChild(carModelContainer);
      carCard.appendChild(carBrandContainer);
      carCard.appendChild(deleteButton);

      carCatalog.appendChild(carCard);

      carName.addEventListener('click', () => {
        carName.readOnly = false;
        carName.focus();
      });

      carPrice.addEventListener('click', () => {
        carPrice.readOnly = false;
        carPrice.focus();
      });

      carModel.addEventListener('click', () => {
        carModel.readOnly = false;
        carModel.focus();
      });

      carBrand.addEventListener('click', () => {
        carBrand.readOnly = false;
        carBrand.focus();
      });

      const editableFields = [carName, carPrice, carModel, carBrand];

      editableFields.forEach((field) => {
        field.addEventListener('keydown', (event) => {
          if (event.key === 'Enter') {
            editableFields.forEach((field) => {
              field.readOnly = true;
            });
            saveCarInfo(
              carro[0],
              carName.value,
              parseFloat(carPrice.value),
              carModel.value,
              carBrand.value
            );
          }
        });
      });
    });

    const cardStyle = document.createElement('style');
cardStyle.textContent = `
  .delete-button {
    background-color: #ff0000;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 6px 12px;
    font-size: 14px;
    cursor: pointer;
    float: left;
  }

  .delete-button:hover {
    background-color: #cc0000;
  }

  .car-card {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    padding: 20px;
    text-align: center;
    max-width: 25vw;
  }

  .car-card img {
    max-width: 100%;
    height: auto;
    margin: 10px;
  }

  .car-field {
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .car-field label {
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    flex-basis: 100px;
  }

  .car-name,
  .car-price,
  .car-model,
  .car-brand {
    font-size: 16px;
    font-weight: bold;
    border: none;
    outline: none;
    cursor: pointer;
    background-color: transparent;
    flex-grow: 1;
  }
`;

document.head.appendChild(cardStyle);


    document.head.appendChild(cardStyle);
  } else {
    console.error('Elemento .car-catalog não encontrado');
  }
}
//segue uma tentativa de fazer a imagem aparecer no frontend
function previewImage(event: Event) {
  const inputElement = event.target as HTMLInputElement;
  const file = inputElement.files?.[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const imageUrl = e.target?.result as string;
      const previewImg = inputElement.parentElement?.querySelector('.car-preview-image') as HTMLImageElement;
      if (previewImg) {
        previewImg.src = imageUrl;
      }
    };
    reader.readAsDataURL(file);
  }
}

  //essa função é chamada ao editar um registro
  function saveCarInfo(carId:number, newName:string, newPrice:number, newModel:string, carBrand:string) {
    fetch(`http://127.0.0.1:5000/update_carros/${carId}/${newName}/${newPrice.toString()}/${newModel}/${carBrand}`, {
      method: 'PUT'
    })
    .then(Response =>{
      if(Response.ok){
        console.log('Registro atualizado com sucesso')
      } else {
        console.error('Erro ao atualizar o registro');
      }
    })
  }

  //deleta o registro em que a função foi chamada
  function deleteCar(carId: number) {
    fetch(`http://127.0.0.1:5000/delete_carros/${carId}`, {
      method: 'DELETE'
    })
      .then(response => {
        if (response.ok) {
          console.log('Registro excluído com sucesso');
        } else {
          console.error('Erro ao excluir o registro');
        }
      })
      .catch(error => {
        console.error('Erro ao excluir o registro', error);
      });
  };
