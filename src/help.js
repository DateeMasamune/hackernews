/*Разница между использованием класса this и новых функциональных компонентов с помощью хуков*/
                                                                /**Класс */
const initialCount = 0;
class Counter extends Component {
    constructor(props) {
        super(props);
        this.state = { count: initialCount };
    }
    render() {
        return (
            <div>
                <p>You clicked {this.state.count} times</p>
                <button
                onClick={() => this.setState(({count}) => ({ count: count + 1 }))} // В классе используется ключевое слово this
                >
                Click me
                </button>
            </div>
        );
    }
}

                                                                /**Хук */
import { useState } from "react";
const initialCount = 0; // Создается переменная счетчика за функцией
function Counter() {
    const [count, setCount] = useState(initialCount); //В функции используется создание деструкторизации массива и записывает сюда переменную счетчика
    return (
        <div>
            <p>You clicked {count} times</p> 
            <button
            onClick={() => setCount((c) => c + 1)}
            >
            Click me
            </button>
        </div>
    );
}

/**doc */
import logo from './logo.svg';
import './App.css';
import React, { Component, useState } from 'react';


const list = [{
    title: 'React',
    url: 'https://reactjs.org',
    author: 'Jordan Walk',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https"//redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    pounts: 5,
    objectID: 1,
  },
];

class ExplainBindingsComponent extends Component{
  constructor(){
    super();

    this.name = 'Dimasta';
    this.onClickMe = this.onClickMe.bind(this); // Привязка к классу и ключевому слову this должна происходить только внутри конструктора для лучшей оптимизации приложения
  }
  onClickMe(){ // Все методы класса конструктора должны быть определены за пределами конструктора чтобы не загромождать конструктор
    console.log("я привязан к this " + this);
    console.log("выведу ключик из объекта " + this.name)
  }
   /*onClickMeTwo привязки нет*/
  onClickMeTwo(){ // Так как этот метод не привязан к ключевому слову this в конструкторе при вызове этой функции будет undefined
    console.log("я не привязан к this " + this);
  }

  render(){
    return(
      <div className="block_buttons">
        <button
        onClick={this.onClickMe}
        type="button"
        >
          Нажми на меня
        </button>
        <button
        onClick={this.onClickMeTwo}
        type="button"
        >
          Нажми на меня
        </button>
      </div>
    );
  }
}
let test1 = new ExplainBindingsComponent();


function App() {
  
  const [listing, setListing] = useState(list);
  const helloWorld = 'Добро пожаловать в Путь к изучению React';
  const name = 'Dmitry';
  const family = 'Ovsienko';

  const numbers = [1, 2, 3, 4, 5];
  const doubled = numbers.map((number) => number * 2); //Стрелочная функция может не иметь тела функции и ретерна, если нет параметра обязательно круглые пустые скобки перед стрелкой если есть параметр можно без скобок
  console.log("New array " + doubled); // функция мап создает новый массив с новыми значениями и изменениями данные если это заложено в инструкции
  console.log("Old array " + numbers);

  class Developer{
    constructor(firstname,lastname){
      this.firstname = firstname;
      this.lastname = lastname;
    }

    getName(){
      return this.firstname + ' ' + this.lastname;
    }
  }

  var fruitStateVariable = React.useState('банан'); // Возвращает пару значений
  var fruit = fruitStateVariable[0]; // Извлекаем первое значение строка банан
  var setFruit = fruitStateVariable[1]; // Извлекаем второе значение функция
  console.log("первое значение " + fruit)
  console.log("Второе значение " + setFruit);

  const robin = new Developer('Robin','Wieruch');
  console.log(robin.getName());

  const [value, setValue] = React.useState( /*в квадратных скобках создается 2 переменные не с фиксированными названиями это называется "деструкторизацией массивов"*/
    localStorage.getItem('myValueInLocalStorage') || '',/*в value будет записано первое значение вернувшееся из useState а в setValue второе*/
  );

  React.useEffect(() => {
    localStorage.setItem('myValueInLocalStorage', value);
  },[value]);
  const onSearchChange = event => setValue(event.target.value);
  

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>{ helloWorld }</h2>
        <h1> {name} {family}</h1>
        {test1.render()}
        <form>
          <input
          value={value}
           type="text"
           onChange={onSearchChange}
           />
           <p><strong>Данные из инпута:</strong> {value}</p>
           {setListing(value).map(item =>
            
            )}  
        </form> 
        {list.map((item) => 
              <div key={item.objectID}>
                <span>
                  <a href={item.url}>{item.title}</a>
                </span>
                <span>{item.author}</span>
                <span>{item.num_comments}</span>
                <span>{item.points}</span>
                <span>
                  <button  
                  onClick={() => 
                    console.log(item.objectID)
                  }          
                  type="button"
                  >
                    Отбросить
                  </button>
                </span>
              </div>
        )}
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}



export default App;
