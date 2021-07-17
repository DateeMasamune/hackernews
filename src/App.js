import React, { Component } from 'react'; //Импортируем компонент реакт
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { rest, result } from 'lodash';
import PropTypes from 'prop-types';
import { sortBy } from 'lodash';
import classNames from 'classnames';
import {
    DEFAULT_QUERY,
    DEFAULT_HPP,
    PATH_BASE,
    PATH_SEARCH,
    PARAM_SEARCH,
    PARAM_PAGE,
    PARAM_HPP,
    largeColumn,
    midColumn,
    smallColumn,
    list
} from './constant';
import Button from './components/button';
import Loading from './components/loading';
import Search from './components/search';


const SORTS = {
    NONE: list => list,
    TITLE: list => sortBy(list, 'title'),
    AUTHOR: list => sortBy(list, 'author'),
    COMMENTS: list => sortBy(list, 'num_comments').reverse(),
    POINTS: list => sortBy(list, 'points').reverse(),
}
 
const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}&${PARAM_PAGE}`;

const isSearched = searchTerm => item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase());

const updateSearchTopStoriesState = (hits,page) => (prevState) => {
const {searchKey, results} = prevState;

    const oldHits = results && results[searchKey]
    ? results[searchKey].hits // записываем в локальное хранилище хиты с новой страницы
    : []; // либо пустой массив

    const updateHits = [...oldHits,...hits]; // Сливаем вместе старые хиты с новыми которые не находятся на 0 странице в состоянии локального компонента

    return {
        results: {
            ...results,
            [searchKey]: {hits: updateHits, page}
        }, // записываем в локальное хранилище обновляем хиты и страницу
        isLoading: false
    } ;
}

class App extends Component {

    _isMounted = false;

    constructor(props){ // В конструкторе можно только определять свойства для создания экземпляра класса и привязку названий функций все функции должны быть определены за пределами конструктора
        super(props);
        this.state = { // Для реализации кэша на стороне клиента : this.state локальное состояние компонента
            results: null, 
            searchKey: '', // Создаем временный ключ
            searchTerm: DEFAULT_QUERY, // Мы не можем использовать эту переменную так как оне каждый раз изменяется после поиска результата другими словами нужна постоянная переменная
            error: null,
            isLoading: false,
        };
        // Стрелочные функции могут привязываться к this без дополнительной привязки
        this.onDismiss = this.onDismiss.bind(this); //Привязываем переменную функцию к ключевому слову this
        this.onSearchChange = this.onSearchChange.bind(this);
        this.setSearchTopStories = this.setSearchTopStories.bind(this);
        this.onSearchSubmit = this.onSearchSubmit.bind(this);
        this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
        this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this); // Проверка наличия кэша
    }

    needsToSearchTopStories(searchTerm){
        return !this.state.results[searchTerm]; // В searchTerm лежит ключ кэша это либо react либо redux и метод проверяет есть ли уже данные под таким ключем если есть он использует кэш
    }

    fetchSearchTopStories(searchTerm, page = 0){
        this.setState({ isLoading: true });
        axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`) //Запрос к апи идентичен fetch но со своими не большими изменениями
        .then(result => this._isMounted && this.setSearchTopStories(result.data))
        .catch(error => this._isMounted && this.setState({ error })); // Блок используется в случае ошибки
    }

    onSearchSubmit(event){
        const { searchTerm } = this.state;
        this.setState({searchKey: searchTerm});

        if(this.needsToSearchTopStories(searchTerm)){ // Если кэша не существует тогда делаем запрос к АПИ
            this.fetchSearchTopStories(searchTerm);   
        }

        event.preventDefault();
    }

    setSearchTopStories( result ){
        const {hits,page} = result; // Результат содержит в себе хиты и страницу
        
        this.setState( updateSearchTopStoriesState(hits,page) );
    }

    componentDidMount(){ //Метод жизненного цикла для получения данных после монтирования компонента

        this._isMounted = true;

        const { searchTerm } = this.state;
        this.setState({searchKey: searchTerm});
        this.fetchSearchTopStories(searchTerm);
    }

    componentWillUnmount(){
        this._isMounted = false;
    }

    onDismiss(id){
        const {searchKey,results} = this.state;
        const {hits, page} = results[searchKey];

       const isNotId = item => item.objectID !== id; // Стрелочная функция принимает объект и сравнивает айди по нажатию на кнопку и возвращает результат который совпадает с условием
       const updateHits = hits.filter(isNotId); // Метод фильтр висит на объекте и принимает функцию которая выше по строке

       this.setState({ 
           results: {...results, [searchKey]: {hits:updateHits,page}} // Расширяем данные слиянием двух объектов
        });// Обновляем наш лист который лежит в объекта через функцию компонента
    }

    onSearchChange(event){
        this.setState({ searchTerm: event.target.value });//Обновляем локальное состояние переменной
    }

    render(){
        const { searchTerm, results, searchKey, error, isLoading } = this.state;
        const page = (results &&
            results[searchKey] &&
             results[searchKey].page
             ) || 0;
        const list = (
            results &&
            results[searchKey] &&
            results[searchKey].hits
        ) || [];
       
        return(
            <div className="page">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <div className="interactions">
                        <Search // Компонент
                            value = {searchTerm} // Передаем параметры в компонент
                            onChange = {this.onSearchChange}
                            list = {list}
                            isSearched = {isSearched}
                            onSubmit = {this.onSearchSubmit}
                        >
                            Поиск
                        </Search>
                    </div>

                    { error
                        ? 
                        <div className="interactions">
                            <p>Something went wrong.</p>
                        </div> 
                            :<Table // Компонент
                                list = {list}
                                onDismiss = {this.onDismiss}
                            />
                    }
                    <div className="interactions">
                        <ButtonWithLoading
                            isLoading = {isLoading}
                            onClick = {()=> this.fetchSearchTopStories(searchKey, page + 1)}
                        >
                            Больше историй 
                        </ButtonWithLoading>
                    </div>
                    

                    <h2 className="App-title">{ this.state.helloWorld }</h2>
                </header>
            </div>
        );
    }    
}

class Table extends Component{

    constructor(props){
        super(props);

        this.state = {
            sortKey: 'NONE',
            isSortReverse: false,
        };

        this.onSort = this.onSort.bind(this);
    }

    onSort(sortKey){
        const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;
        this.setState({sortKey, isSortReverse});
    }

    render(){

        const { list, onDismiss } = this.props; // this.props это сокращенная форма для свойств они хранят все значения которые вы передали компонентам когда использовали их в компоненте App таким образом компоненты могут передавать свойства через дерево компонентов
        const { sortKey, isSortReverse } = this.state;

        const sortedList = SORTS[sortKey](list);
        const reverseSortedList = isSortReverse
            ? sortedList.reverse()
            : sortedList;

        return(
            <div className="table">
            <div className="table-header">
             <span style={{ width: '40%' }}>
                 <Sort
                    sortKey = {'TITLE'}
                    onSort = {this.onSort}
                    activeSortKey = {sortKey}
                    >
                    Заголовок
                </Sort>
            </span>
            <span style={{ width: '30%' }}>
                <Sort
                    sortKey = {'AUTHOR'}
                    onSort = {this.onSort}
                    activeSortKey = {sortKey}
                    >
                    Автор
                </Sort>
            </span>
            <span style={{ width: '10%' }}>
                <Sort
                    sortKey = {'COMMENTS'}
                    onSort = {this.onSort}
                    activeSortKey = {sortKey}
                    >
                    Комментраии
                </Sort>
            </span>
            <span style={{ width: '10%' }}>
                <Sort
                    sortKey = {'POINTS'}
                    onSort = {this.onSort}
                    activeSortKey = {sortKey}
                    >
                    Очки
                </Sort>
            </span>
            <span style={{ width: '10%' }}>
               Архив
            </span>
        </div>
        { reverseSortedList.map(item =>
        <div key={ item.objectID } className="table-row">
            <span style={largeColumn}>
                <a href={ item.url }>{ item.title }</a><br></br>
            </span>
            <span style={midColumn}>{ item.author }</span>
            <span style={smallColumn}>{ item.num_comments }</span>
            <span style={smallColumn}>{ item.points }</span>
            <span style={smallColumn}>
                <button
                    onClick = { () => onDismiss(item.objectID) }
                    type="button"
                    className="button-inline"
                    >
                    Отбросить
                </button>
            </span>
        </div>
    ) }
    </div>
        )
    }
}

const withLoading = (Component) => ({ isLoading, ...rest }) =>
    isLoading
        ?<Loading/>
        :<Component {...rest}/>

const ButtonWithLoading = withLoading(Button); // Компонент высшего порядка который принимает другой компонент и возвращает компонент

const Sort = ({ sortKey, onSort, children, activeSortKey }) => {

    const sortClass = classNames(
        'button-inline',
        {'button-active': sortKey === activeSortKey}
    );

    return(
        <Button
            onClick = {() => onSort(sortKey)}
            className = {sortClass}
        >
            {children}
        </Button>
    )
}
    

export default App;

export {
    Button,
    Search,
    Table,
};