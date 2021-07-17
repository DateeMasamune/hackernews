import Sort from "../sort";
import { sortBy } from 'lodash';
import React, { Component } from 'react';
import {
    largeColumn,
    midColumn,
    smallColumn,
} from "../../constant";

const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  COMMENTS: list => sortBy(list, 'num_comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse(),
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

export default Table;