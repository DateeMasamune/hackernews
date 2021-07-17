const Search = ({value, onChange, children, onSubmit}) =>{
  let input;
  return(
      <div className="searchComponent">
      <form onSubmit={onSubmit}>
          <input
              name="item_title"
              type="text"
              value={ value }
              onChange = { onChange }
              ref = {(node) => input = node}
          />
          <button type="submit">
          {children}
          </button>
      </form>
  </div>
  );
}

export default Search;