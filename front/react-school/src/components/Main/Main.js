import Tables from "../../helpers/Consts";


function Main() {
    return (
      <div style={{display: 'flex', flexDirection: 'column'}}>
        {
          Tables.map((table) => {
            return (
              <a href={`/${table.value}`}>{table.label}</a>
            )
          })
        }
      </div>
    );
}
export default Main;